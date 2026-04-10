import { useId } from "react";

const COLORS = {
  red: { top: "#FF6B6B", left: "#E53935", right: "#B71C1C" },
  yellow: { top: "#FFF176", left: "#FDD835", right: "#F9A825" },
  green: { top: "#81C784", left: "#43A047", right: "#1B5E20" },
  black: { top: "#757575", left: "#424242", right: "#212121" },
  blue: { top: "#64B5F6", left: "#1E88E5", right: "#0D47A1" },
};

function IsoCube({ color, size = 22, marked = false }) {
  const id = useId();
  const clipId = `cube-clip-${id}`.replace(/:/g, "-");
  const { top, left, right } = COLORS[color];

  return (
    <svg
      viewBox="-1 -1 14 16"
      width={size}
      height={size * (14 / 12)}
      overflow="visible"
      style={{
        display: "block",
        stroke: marked ? "#fff" : "",
        filter: marked
          ? "drop-shadow(0 0 8px #fff)"
          : "drop-shadow(2px 4px 4px rgba(0,0,0,0.8))",
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="-0.5" y="-0.5" width="13" height="15" rx="4" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {/* top face — lightest */}
        <polygon points="6,0 12,4 6,7 0,4" fill={top} />
        {/* left face — mid */}
        <polygon points="0,4 6,7 6,14 0,10" fill={left} />
        {/* right face — darkest */}
        <polygon points="12,4 12,10 6,14 6,7" fill={right} />
      </g>
    </svg>
  );
}

export const CUBE_COLORS = ["red", "yellow", "green", "black", "blue"];

export default IsoCube;
