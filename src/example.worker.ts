/* eslint-disable no-restricted-globals */

self.addEventListener('message', (event: MessageEvent<number>) => {
  const then = Date.now() + event.data;
  let iterations = 0;

  while (then > Date.now()) {
    ++iterations;
  }

  self.postMessage(iterations);
});

export {};
