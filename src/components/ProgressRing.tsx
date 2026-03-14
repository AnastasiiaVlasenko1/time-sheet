import React from "react";

interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  value,
  max,
  size = 80,
}) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  const ratio = value / max;
  let color: string;
  if (ratio < 0.8) {
    color = "#0f62fe"; // blue
  } else if (ratio < 1) {
    color = "#f1c21b"; // yellow
  } else {
    color = "#198038"; // green
  }

  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={`${value} of ${max} hours`}
    >
      <title>{`${value} of ${max} hours`}</title>
      {/* Background circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke="#e0e0e0"
        strokeWidth={4}
        fill="none"
      />
      {/* Foreground circle */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        stroke={color}
        strokeWidth={4}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${center} ${center})`}
      />
      {/* Center text */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={14}
        fontWeight={600}
        fill="#161616"
      >
        {value}h
      </text>
    </svg>
  );
};

export default ProgressRing;
