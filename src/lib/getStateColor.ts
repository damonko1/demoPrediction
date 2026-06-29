export type StateColor = {
  background: string;
  border: string;
  foreground: string;
  darkBackground: string;
  darkBorder: string;
  darkForeground: string;
  bucket: "tilt" | "lean" | "likely" | "safe";
};

const demScale = {
  tilt: {
    background: "rgba(171, 225, 255, 0.46)",
    border: "#7fcfff",
    foreground: "#0c527a",
    darkBackground: "rgba(94, 163, 255, 0.12)",
    darkBorder: "#8ebcff",
    darkForeground: "#cfe4ff",
  },
  lean: {
    background: "rgba(106, 198, 252, 0.58)",
    border: "#42aff2",
    foreground: "#073f68",
    darkBackground: "rgba(73, 145, 255, 0.2)",
    darkBorder: "#5b9dff",
    darkForeground: "#e6f1ff",
  },
  likely: {
    background: "rgba(38, 144, 226, 0.76)",
    border: "#147fcf",
    foreground: "#ffffff",
    darkBackground: "rgba(48, 118, 255, 0.3)",
    darkBorder: "#3f8cff",
    darkForeground: "#f5f9ff",
  },
  safe: {
    background: "rgba(22, 111, 191, 0.86)",
    border: "#0d66b8",
    foreground: "#ffffff",
    darkBackground: "rgba(38, 88, 255, 0.42)",
    darkBorder: "#2f6dff",
    darkForeground: "#ffffff",
  },
};

const repScale = {
  tilt: {
    background: "rgba(255, 200, 202, 0.5)",
    border: "#ff9ca3",
    foreground: "#8c2029",
    darkBackground: "rgba(255, 124, 132, 0.12)",
    darkBorder: "#ff9097",
    darkForeground: "#ffd7da",
  },
  lean: {
    background: "rgba(255, 139, 148, 0.62)",
    border: "#f46b76",
    foreground: "#7f1720",
    darkBackground: "rgba(255, 88, 99, 0.2)",
    darkBorder: "#ff6872",
    darkForeground: "#ffe8ea",
  },
  likely: {
    background: "rgba(226, 69, 78, 0.76)",
    border: "#d4313d",
    foreground: "#ffffff",
    darkBackground: "rgba(255, 65, 78, 0.3)",
    darkBorder: "#ff4c59",
    darkForeground: "#fff4f5",
  },
  safe: {
    background: "rgba(191, 41, 51, 0.86)",
    border: "#a91f2c",
    foreground: "#ffffff",
    darkBackground: "rgba(216, 32, 49, 0.42)",
    darkBorder: "#f02f3f",
    darkForeground: "#ffffff",
  },
};

function getBucket(margin: number): StateColor["bucket"] {
  const absoluteMargin = Math.abs(margin);

  if (absoluteMargin < 2) {
    return "tilt";
  }

  if (absoluteMargin < 6) {
    return "lean";
  }

  if (absoluteMargin < 12) {
    return "likely";
  }

  return "safe";
}

export function getStateColor(margin: number): StateColor {
  const bucket = getBucket(margin);
  const scale = margin >= 0 ? demScale : repScale;

  return {
    ...scale[bucket],
    bucket,
  };
}
