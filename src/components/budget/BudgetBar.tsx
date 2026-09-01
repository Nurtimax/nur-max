import { FC } from "react";
import classes from "./index.module.css";

interface IProps {
  percent: number;
  isOver?: boolean;
  variant?: "default" | "inverse";
}

/** Лимиттин канчасы колдонулганын көрсөткөн тилке */
const BudgetBar: FC<IProps> = ({ percent, isOver, variant = "default" }) => (
  <span
    className={`${classes.bar} ${variant === "inverse" ? classes.barInverse : ""}`}
  >
    <span
      className={`${classes.barFill} ${isOver ? classes.barFillOver : ""}`}
      style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
    />
  </span>
);

export default BudgetBar;
