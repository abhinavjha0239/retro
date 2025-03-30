import { useEffect, useState } from 'react';

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

const useKonamiCode = () => {
  const [count, setCount] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const keyHandler = (event) => {
      // Get the key that was pressed
      const key = event.key.toLowerCase();
      
      // Get the expected key from the konami code
      const expectedKey = KONAMI_CODE[count].toLowerCase();
      
      // Reset if the key isn't correct
      if (key !== expectedKey) {
        setCount(0);
        return;
      }

      // Move to the next key
      setCount(count + 1);
      
      // If the konami code is completed
      if (count + 1 === KONAMI_CODE.length) {
        setSuccess(true);
        setCount(0);
      }
    };

    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [count]);

  return success;
};

export default useKonamiCode;