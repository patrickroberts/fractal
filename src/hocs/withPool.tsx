import type { ComponentType, RefObject, RefAttributes } from 'react';
import { useMemo, useState, useImperativeHandle, forwardRef } from 'react';
import type { Remote, WorkerModule } from '../rpc';

interface WorkerPoolProps {
  concurrency?: number;
}

const withPool = <T extends WorkerModule>(
  Component: ComponentType<RefAttributes<Remote<T>>>,
) => {
  const PoolComponent = forwardRef<Remote<T>[], WorkerPoolProps>(({
    concurrency = navigator.hardwareConcurrency,
  }, ref) => {
    const [workerRefs] = useState<RefObject<Remote<T>>[]>(() => Array.from(
      { length: concurrency },
      () => ({ current: null }),
    ));
    const workers = useMemo(() => workerRefs.map((ref, index) => (
      <Component key={index} ref={ref} />
    )), [workerRefs]);
  
    useImperativeHandle(ref, () => workerRefs.map(
      ({ current }) => current!
    ), [workerRefs]);
  
    return <>{workers}</>;
  });

  return PoolComponent;
};

export default withPool;
