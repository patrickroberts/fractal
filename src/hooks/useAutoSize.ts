import { useEffect, useRef } from 'react';

const useAutoSize = () => {
  const textarea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const element = textarea.current!;
    
    element.style.width = 'auto';
    element.style.height = 'auto';

    element.style.width = `${element.scrollWidth}px`;
    element.style.height = `${element.scrollHeight}px`;
  });

  return textarea;
};

export default useAutoSize;
