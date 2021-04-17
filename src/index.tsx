import ReactDOM from "react-dom";
import styles from "./index.css";

ReactDOM.hydrate(
  <main className={styles.main}>Hello, World!</main>,
  document.getElementById("root")
);
