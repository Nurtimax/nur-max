import { FC } from "react";
import classes from "./index.module.css";

interface IProps {
  value: number;
  total: number;
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  /** "inverse" — түстүү фондун үстүндө (hero картасы) */
  variant?: "default" | "inverse";
}

const ProgressRing: FC<IProps> = ({
  value,
  total,
  size = 64,
  stroke = 6,
  label,
  sublabel,
  variant = "default",
}) => {
  const percent = total > 0 ? Math.min(1, value / total) : 0;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className={`${classes.ring} ${variant === "inverse" ? classes.ringInverse : ""}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value}/${total}`}
    >
      <svg width={size} height={size} className={classes.ringSvg}>
        <circle
          className={classes.ringTrack}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className={classes.ringValue}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - percent)}
        />
      </svg>
      <div className={classes.ringContent}>
        <span className={classes.ringLabel}>{label ?? `${value}/${total}`}</span>
        {sublabel && <span className={classes.ringSublabel}>{sublabel}</span>}
      </div>
    </div>
  );
};

export default ProgressRing;
