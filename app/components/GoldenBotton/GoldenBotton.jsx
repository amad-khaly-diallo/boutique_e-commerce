"use client";
import styles from "./golden.module.css";

export default function Golden({ children, onClick }) {
  return (
    <span className={styles.gold} onClick={onClick}>
      {children}
    </span>
  );
}
