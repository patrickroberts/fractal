import { forwardRef, useLayoutEffect, useImperativeHandle, useRef } from 'react';
import type { LocalTransferableFactoryMap, Remote, WorkerModule } from '../rpc';
import { wrap } from '../rpc';

const withWorker = <T extends WorkerModule>(
  workerFactory: () => Worker,
  factoryMap: LocalTransferableFactoryMap<T> = {},
) => {
  const WorkerComponent = forwardRef<Remote<T>>(({ children }, ref) => {
    const worker = useRef<Worker>();
    const revocable = useRef<{ proxy: Remote<T>, revoke: () => void }>();

    useLayoutEffect(() => {
      worker.current = workerFactory();
      revocable.current = wrap<T>(worker.current, factoryMap);

      return () => {
        revocable.current!.revoke();
        worker.current!.terminate();
      };
    }, []);

    useImperativeHandle(ref, () => revocable.current!.proxy, []);

    return <>{children}</>;
  });

  return WorkerComponent;
};

export default withWorker;
