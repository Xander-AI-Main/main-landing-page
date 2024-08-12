import React, { useState } from "react";

export default function ProgressBarr({ progress }) {
  const containerStyle = {
    height: "11px",
    width: "100%",
    backgroundColor: "#C0B7E8",
    borderRadius: "23px",
    overflow: "hidden",
  };

  const fillerStyle = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: "rgba(93, 84, 132, 0.35)",
    transition: "width 0.2s ease-in-out",
  };

  return (
    <div style={containerStyle}>
      <div style={fillerStyle}></div>
    </div>
  );
};