import { useEffect, useState } from "react";

// This hook listens for particular key pressses, returns a boolean (true or false)
export const useKeyPress = function (targetKey: any) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }: any) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }: any) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  });

  return keyPressed;
};
