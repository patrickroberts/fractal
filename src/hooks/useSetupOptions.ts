import { deflateRaw, inflateRaw } from 'pako';
import { useEffect, useState } from 'react';

import type SetupOptions from '../types/SetupOptions';
import { assert } from '../types/SetupOptions';

const initialState = {
  width: 768,
  height: 432,
  zoom: 224,
  center: '0',
  julia: '-0.8+0.156*i',
  iterate: 'z**2+c',
  iterations: 512,
  escape: 2,
  seed: '2*pi*(n/N+1/2)',
  red: '255/2*(sin(seed)+1)',
  green: '255/2*(sin(seed+2*pi/3)+1)',
  blue: '255/2*(sin(seed+4*pi/3)+1)',
};

const fromUint8Array = (uint8Array: Uint8Array) => String.fromCharCode(
  ...Array.from(uint8Array)
);

const toHash = (state: SetupOptions) => `#${
  btoa(fromUint8Array(deflateRaw(JSON.stringify(state))))
}`;

const fromHash = (hash: string) => assert(JSON.parse(
  fromUint8Array(inflateRaw(atob(hash.slice(1))))
));

const useSetupOptions = () => {
  const [state, setState] = useState<SetupOptions>(() => {
    try {
      return fromHash(window.location.hash);
    } catch (_) {
      return initialState;
    }
  });

  useEffect(() => {
    const hash = toHash(state);

    switch (window.location.hash) {
      case hash:
        break;
      case '':
        window.history.replaceState(state, document.title, `${window.location.pathname}${hash}`);
        break;
      default:
        window.history.pushState(state, document.title, `${window.location.pathname}${hash}`);
    }
  }, [state]);

  useEffect(() => {
    const listener = () => {
      setState(fromHash(window.location.hash));
    };

    window.addEventListener('popstate', listener);

    return () => {
      window.removeEventListener('popstate', listener);
    };
  }, []);

  return [state, setState] as const;
};

export default useSetupOptions;
