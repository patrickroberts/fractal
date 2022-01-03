import type { Bindings, Complex } from 'complex-js';
import { cartesian, compile } from 'complex-js';
import { createDetailedValidator, registerType } from 'typecheck.macro'

export interface SetupOptions {
  width: number;
  height: number;
  zoom: number;
  center: string;
  c?: string;
  iterate: string;
  iterations: number;
  escape: number;
  potential: string;
}

registerType('SetupOptions');

export interface RenderOptions {
  length: number;
  x: number;
  y: number;
}

let width: number;
let height: number;
let zoom: number;
let center: Complex;
let c: Complex | undefined;
let iterate: (variables: Bindings) => Complex;
let iterations: number;
let escapeSquared: number;
let potential: (variables: Bindings) => Complex;

const validate = createDetailedValidator<SetupOptions>();

const setup = (options: SetupOptions) => {
  const errors: [string, unknown, string][] = [];

  if (!validate(options, errors)) {
    const [[name, actual, expected]] = errors;

    throw new TypeError(`Expected ${name} to be ${expected}; got ${actual}`);
  }

  const re = (z: Complex) => cartesian(z.real, 0);
  const im = (z: Complex) => cartesian(z.imag, 0);
  const abs = (z: Complex) => cartesian(z.abs, 0);
  const arg = (z: Complex) => cartesian(z.arg, 0);
  const constants: Bindings = { re, im, abs, arg };

  width = options.width;
  height = options.height;
  zoom = options.zoom;
  center = compile(options.center)() as typeof center;
  iterate = compile(options.iterate, constants) as typeof iterate;
  iterations = options.iterations;
  escapeSquared = options.escape * options.escape;
  constants.N = cartesian(iterations, 0);
  potential = compile(options.potential, constants) as typeof potential;

  if (options.c === undefined) {
    c = options.c;
  } else {
    c = compile(options.c)() as typeof c;
  }
}

const render = (options: RenderOptions) => {
  const { length, x, y } = options;
  const cx = width / 2;
  const cy = height / 2;
  const data = new Uint8ClampedArray(length * 4);
  const { real, imag } = center;
  const bindings = { c: c!, z: c! };

  for (let index = 0; index < length; ++index) {
    let iteration = 0;

    bindings.z = cartesian(
      real + ((x + index) - cx) / zoom,
      imag + (y - cy) / zoom,
    );

    if (!c) {
      bindings.c = bindings.z;
    }

    while (iteration < iterations) {
      if (bindings.z.norm > escapeSquared) {
        break;
      }

      bindings.z = iterate(bindings) as typeof bindings.z;
      ++iteration;
    }

    if (iteration < iterations) {
      const seed = 2 * Math.PI * (iteration - potential(bindings).real) / iterations;

      data[index * 4] = 0x80 * (1 + Math.sin(seed));
      data[index * 4 + 1] = 0x80 * (1 + Math.sin(seed + Math.PI * 2 / 3));
      data[index * 4 + 2] = 0x80 * (1 + Math.sin(seed + Math.PI * 4 / 3));
    }

    data[index * 4 + 3] = 0xFF;
  }

  return new ImageData(data, length, 1);
};

export { setup, render };
