import type { FC } from "react";
import { Count } from "./Count";
import styles from "./index.css";

const App: FC = () => (
  <main className={styles.App}>
    <Count />
  </main>
);

export { App };
