import { Bindings, Complex, cartesian, compile } from 'complex-js';

export interface SetupOptions {
  expression: string;
  potential: string;
  center: string;
}

export interface RenderOptions {
  dx: number;
  dy: number;
  width: number;
  height: number;
  length: number;
  iterations: number;
  density: number;
  escape: number;
}

let expression: (variables: Bindings) => Complex;
let potential: (variables: Bindings) => Complex;
let center: Complex;

const setup = (options: SetupOptions) => {
  const re = (z: Complex) => cartesian(z.real, 0);
  const im = (z: Complex) => cartesian(z.imag, 0);
  const abs = (z: Complex) => cartesian(z.abs, 0);
  const arg = (z: Complex) => cartesian(z.arg, 0);
  const constants = { re, im, abs, arg };

  expression = compile(options.expression, constants) as typeof expression;
  potential = compile(options.potential, constants) as typeof potential;
  center = compile(options.center)({}) as typeof center;
}

const render = (options: RenderOptions) => {
  const { length, dx, dy, width, height, iterations: N, density, escape } = options;
  const cx = width / 2;
  const cy = height / 2;
  const pixels = new Uint32Array(length);
  const { real, imag } = center;
  const iterate = expression;

  for (let index = 0; index < pixels.length; ++index) {
    const x = (((dx + index) % width) - cx) / density;
    const y = ((dy + Math.floor((dx + index) / width)) - cy) / density;
    let z = cartesian(x + real, y - imag);
    const bindings = { c: z, z };
    let n = 0;

    while (n < N) {
      if (z.norm > escape * escape) {
        break;
      }

      bindings.z = z = iterate(bindings) as typeof z;
      ++n;
    }

    let pixel = 0xFF000000;

    if (n < N) {
      const v = 2 * Math.PI * (n - (potential({ z, N: cartesian(N, 0) }) as Complex).real) / N;

      pixel |=
        (Math.floor((Math.sin(v + 0 * Math.PI / 3) + 1) * 0x80) << 0) |
        (Math.floor((Math.sin(v + 2 * Math.PI / 3) + 1) * 0x80) << 8) |
        (Math.floor((Math.sin(v + 4 * Math.PI / 3) + 1) * 0x80) << 16); 
    }

    pixels[index] = pixel;
  }

  return pixels;
};

export { setup, render };
