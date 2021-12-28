declare module "workerize-loader!*" {
  type Workerized<T> = Worker & {
    [K in keyof T]:
      T[K] extends (...args: infer U) => infer R
      ? (...args: U) => (R extends Promise<any> ? R : Promise<R>)
      : never;
  };

  function worker<T> (): Workerized<T>;
  export = worker;
}
