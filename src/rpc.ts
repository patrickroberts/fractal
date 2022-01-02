/* eslint-disable no-restricted-globals */

export type WorkerModule = Record<string, (...args: any) => any>;

export type Remote<T extends WorkerModule> = {
  [K in keyof T]: (
    T[K] extends (...args: infer Args) => infer R
    ? (...args: Args) => (R extends Promise<any> ? R : Promise<R>)
    : never
  );
};

type TransferableFactory<T extends any[]> = (...args: T) => Transferable[];

export type LocalTransferableFactoryMap<T extends WorkerModule> = Partial<{
  [K in keyof T]: TransferableFactory<Parameters<T[K]>>;
}>;

const enum Completion {
  resolve,
  reject,
};

const wrap = <T extends WorkerModule>(worker: Worker, factoryMap: LocalTransferableFactoryMap<T> = {}) => {
  let id = 0;
  const completions: Map<number, Parameters<ConstructorParameters<PromiseConstructor>[0]>> = new Map();

  worker.addEventListener('message', <K extends keyof T>(event: MessageEvent<[id: number, type: Completion, result: ReturnType<T[K]>]>) => {
    const { 0: id, 1: type, 2: result } = event.data;
    const completion = completions.get(id)!;

    completions.delete(id);
    completion[type](result);
  });

  return Proxy.revocable<Remote<T>>(Object.create(null), {
    get(target, key) {
      if (typeof key === 'string' && !(key in target)) {
        (target[key as keyof T] as any) = (...args: Parameters<T[keyof T]>) => new Promise((resolve, reject) => {
          const { [key as keyof T]: factory = () => [] } = factoryMap;

          completions.set(id, [resolve, reject]);
          worker.postMessage([key, id, args], factory.apply(undefined, args));
          id = (id + 1) % Number.MAX_SAFE_INTEGER;
        });
      }

      return target[key as keyof T];
    } 
  });
};

export type RemoteTransferableFactoryMap<T extends WorkerModule> = Partial<{
  [K in keyof T]: TransferableFactory<[ReturnType<T[K]>]>;
}>;

const expose = <T extends WorkerModule>(workerModule: T, factoryMap: RemoteTransferableFactoryMap<T> = {}) => {
  addEventListener('message', async <K extends keyof T>(event: MessageEvent<[key: K, id: number, args: Parameters<T[K]>]>) => {
    const { 0: key, 1: id, 2: args } = event.data;
    const method = workerModule[key];
    const { [key]: factory = () => [] } = factoryMap;

    try {
      const value = await method.apply(undefined, args);

      postMessage([id, Completion.resolve, value], factory(value));
    } catch (reason) {
      postMessage([id, Completion.reject, reason]);
    }
  });
};

export { wrap, expose };
