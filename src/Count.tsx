import { FC, useCallback, useState } from "react";
import styles from "./index.css";

const initialCount = 0;

const Count: FC = () => {
  const [count, setCount] = useState(initialCount);
  const increment = useCallback(() => setCount((current) => current + 1), [
    setCount,
  ]);
  const decrement = useCallback(() => setCount((current) => current - 1), [
    setCount,
  ]);
  const resetCount = useCallback(() => setCount(initialCount), [setCount]);

  return (
    <div className={styles["Cont-container"]}>
      <p className={styles["Count-count"]}>Count: {count}</p>
      <div className={styles["Count-button-group"]}>
        <button onClick={increment} className={styles["Count-button"]}>
          +1
        </button>
        <button onClick={decrement} className={styles["Count-button"]}>
          -1
        </button>
        <button onClick={resetCount} className={styles["Count-button"]}>
          Reset
        </button>
      </div>
    </div>
  );
};

export { Count };
