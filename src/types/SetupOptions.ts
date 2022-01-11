import { createDetailedValidator, IR, registerType } from 'typecheck.macro'

export namespace v1 {
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

  export const validate = createDetailedValidator<SetupOptions>();
}

export namespace v2 {
  export interface SetupOptions {
    width: number;
    height: number;
    zoom: number;
    center: string;
    julia?: string;
    iterate: string;
    iterations: number;
    escape: number;
    seed: string;
    red: string;
    green: string;
    blue: string;
  }

  registerType('SetupOptions');

  export const validate = createDetailedValidator<SetupOptions>();
}

type SetupOptions = v1.SetupOptions | v2.SetupOptions;

export const validate = (value: unknown, errors: [string, unknown, string | IR.IR][]): value is SetupOptions => (
  v2.validate(value, errors) || v1.validate(value, errors)
);

export const assert = (value: unknown): SetupOptions => {
  const errors: any[] = [];

  if (!validate(value, errors)) {
    const [[name, actual, expected]] = errors;

    throw new TypeError(`Expected ${name} to be ${expected}; got ${actual}`);
  }

  return value;
};

export default SetupOptions;
