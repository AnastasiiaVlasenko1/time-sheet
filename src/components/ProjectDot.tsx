import React from "react";

interface ProjectDotProps {
  color: string;
}

const ProjectDot: React.FC<ProjectDotProps> = ({ color }) => (
  <span
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
);

export default ProjectDot;
