import { motion } from "framer-motion";
import { clsx } from "clsx";

interface ScoreRingProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreRing({ score, label, size = "md", className }: ScoreRingProps) {
  const radius = size === "lg" ? 60 : size === "md" ? 40 : 24;
  const stroke = size === "lg" ? 8 : size === "md" ? 6 : 4;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-amber-500";
    return "text-red-500";
  };

  const dimensions = size === "lg" ? 160 : size === "md" ? 120 : 80;

  return (
    <div className={clsx("flex flex-col items-center justify-center", className)}>
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: dimensions, height: dimensions }}
      >
        <svg
          height={dimensions}
          width={dimensions}
          className="transform -rotate-90"
        >
          {/* Background Ring */}
          <circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={dimensions / 2}
            cy={dimensions / 2}
            className="text-slate-100"
          />
          {/* Progress Ring */}
          <motion.circle
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + " " + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={dimensions / 2}
            cy={dimensions / 2}
            className={getColor(score)}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={clsx(
            "font-bold text-slate-900 tracking-tight",
            size === "lg" ? "text-4xl" : size === "md" ? "text-2xl" : "text-base"
          )}>
            {score}
          </span>
          {size === "lg" && <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Score</span>}
        </div>
      </div>
      <span className={clsx(
        "mt-2 font-medium text-slate-600",
        size === "lg" ? "text-base" : "text-sm"
      )}>
        {label}
      </span>
    </div>
  );
}
