import React from "react";
import { Tag } from "@carbon/react";
import type { TagBaseProps } from "@carbon/react/es/components/Tag/Tag";

interface ConfidenceBadgeProps {
  level: "high" | "medium" | "low";
}

const tagMap: Record<
  ConfidenceBadgeProps["level"],
  { type: NonNullable<TagBaseProps["type"]>; label: string }
> = {
  high: { type: "green", label: "High" },
  medium: { type: "warm-gray", label: "Medium" },
  low: { type: "magenta", label: "Low" },
};

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level }) => {
  const { type, label } = tagMap[level];
  return (
    <Tag type={type} size="sm">
      {label}
    </Tag>
  );
};

export default ConfidenceBadge;
