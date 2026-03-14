import React from "react";

interface ProjectDotProps {
  color: string;
  label?: string;
}

const ProjectDot: React.FC<ProjectDotProps> = ({ color, label }) => (
  <>
    <span
      aria-hidden="true"
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 8,
        flexShrink: 0,
      }}
    />
    {label && (
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: 0,
        }}
      >
        {label}
      </span>
    )}
  </>
);

export default ProjectDot;
