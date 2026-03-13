import React from "react";
import { Tag } from "@carbon/react";

interface SourceTagProps {
  source: "calendar" | "jira" | "pattern" | "manual" | "gap";
}

const labelMap: Record<SourceTagProps["source"], string> = {
  calendar: "Cal",
  jira: "Jira",
  pattern: "Pattern",
  manual: "Manual",
  gap: "Gap",
};

const SourceTag: React.FC<SourceTagProps> = ({ source }) => (
  <Tag type={"cool-gray" as "gray"} size="sm">
    {labelMap[source]}
  </Tag>
);

export default SourceTag;
