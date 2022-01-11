import type { Bindings, Complex } from 'complex-js';
import { cartesian, compile } from 'complex-js';

import type SetupOptions from './types/SetupOptions';
import { assert, v1, v2 } from './types/SetupOptions';

export interface RenderOptions {
  length: number;
  x: number;
  y: number;
}

let width: number;
let height: number;
let zoom: number;
let center: Complex;
let julia: Complex | undefined;
let iterate: (variables: Bindings) => Complex;
let iterations: number;
let escapeSquared: number;
let seed: (variables: Bindings) => Complex;
let red: (variables: Bindings) => Complex;
let green: (variables: Bindings) => Complex;
let blue: (variables: Bindings) => Complex;

const setup = (options: SetupOptions) => {
  if (!v2.validate(options, [])) {
    if (!v1.validate(options, [])) {
      assert(options);
    }

    options = {
      width: options.width,
      height: options.height,
      zoom: options.zoom,
      center: options.center,
      julia: options.c,
      iterate: options.iterate,
      iterations: options.iterations,
      escape: options.escape,
      seed: `2*pi*(n-(${options.potential}))/N`,
      red: '255/2*(sin(seed)+1)',
      green: '255/2*(sin(seed+2*pi/3)+1)',
      blue: '255/2*(sin(seed+4*pi/3)+1)',
    }
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
  seed = compile(options.seed, constants) as typeof seed;
  red = compile(options.red, constants) as typeof red;
  green = compile(options.green, constants) as typeof red;
  blue = compile(options.blue, constants) as typeof red;

  if (options.julia === undefined) {
    julia = options.julia;
  } else {
    julia = compile(options.julia)() as typeof julia;
  }
}

const render = (options: RenderOptions) => {
  const { length, x, y } = options;
  const cx = width / 2;
  const cy = height / 2;
  const imageData = new ImageData(length, 1);
  const { data } = imageData;
  const { real, imag } = center;
  const iterateBindings: Bindings = { c: julia! };
  const seedBindings: Bindings = {};
  const colorBindings: Bindings = {};

  for (let index = 0; index < length; ++index) {
    let iteration = 0;

    iterateBindings.z = cartesian(
      real + ((x + index) - cx) / zoom,
      imag + (y - cy) / zoom,
    );

    if (!julia) {
      iterateBindings.c = iterateBindings.z;
    }

    while (iteration < iterations) {
      if (iterateBindings.z.norm > escapeSquared) {
        break;
      }

      iterateBindings.z = iterate(iterateBindings) as typeof iterateBindings.z;
      ++iteration;
    }

    if (iteration < iterations) {
      seedBindings.z = iterateBindings.z;
      seedBindings.n = cartesian(iteration, 0);
      colorBindings.seed = seed(seedBindings);

      data[index * 4] = red(colorBindings).real;
      data[index * 4 + 1] = green(colorBindings).real;
      data[index * 4 + 2] = blue(colorBindings).real;
    }

    data[index * 4 + 3] = 0xFF;
  }

  return imageData;
};

export { setup, render };
