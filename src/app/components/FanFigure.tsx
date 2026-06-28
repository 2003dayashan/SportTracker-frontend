import { useEffect, useRef } from "react";
import figureBase from "../../imports/fan-figure-base.png";

interface FanFigureProps {
  primaryColor: string;   // jersey + socks
  secondaryColor: string; // shorts
  name?: string;
}

export default function FanFigure({ primaryColor, secondaryColor, name }: FanFigureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.src = figureBase;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, -3, -35);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Seed points as % of width/height — adjust if your image proportions differ
      floodFill(imageData, Math.round(canvas.width * 0.64), Math.round(canvas.height * 0.38), primaryColor); // jersey
      floodFill(imageData, Math.round(canvas.width * 0.64), Math.round(canvas.height * 0.60), secondaryColor); // shorts
      

      ctx.putImageData(imageData, 0, 0);

      // Draw name on jersey
      if (name) {
        ctx.font = "bold 52px 'Space Grotesk', sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = isColorDark(primaryColor) ? "#ffffff" : "#2b2b2b";
        ctx.fillText(
          name.length > 12 ? name.slice(0, 12).toUpperCase() : name.toUpperCase(),
          canvas.width * 0.64,
          canvas.height * 0.45
        );
      }
    };
  }, [primaryColor, secondaryColor, name]);

  return <canvas ref={canvasRef} className="w-full max-w-sm h-auto" />;
}

// Flood fill — replaces connected same-ish-color pixels starting from (x,y)
function floodFill(imageData: ImageData, x: number, y: number, hexColor: string) {
  const { width, height, data } = imageData;
  const startIdx = (y * width + x) * 4;
  const startR = data[startIdx];
  const startG = data[startIdx + 1];
  const startB = data[startIdx + 2];

  // Don't fill if we landed on a dark outline pixel
  if (startR < 60 && startG < 60 && startB < 60) return;

  const { r, g, b } = hexToRgb(hexColor);
  const tolerance = 40;
  const visited = new Uint8Array(width * height);
  const stack: [number, number][] = [[x, y]];

  while (stack.length) {
    const [cx, cy] = stack.pop()!;
    if (cx < 0 || cy < 0 || cx >= width || cy >= height) continue;
    const pIdx = cy * width + cx;
    if (visited[pIdx]) continue;
    visited[pIdx] = 1;

    const idx = pIdx * 4;
    const pr = data[idx], pg = data[idx + 1], pb = data[idx + 2];

    if (
      Math.abs(pr - startR) > tolerance ||
      Math.abs(pg - startG) > tolerance ||
      Math.abs(pb - startB) > tolerance
    ) continue;

    data[idx] = r;
    data[idx + 1] = g;
    data[idx + 2] = b;

    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
  }
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  return {
    r: parseInt(c.substring(0, 2), 16),
    g: parseInt(c.substring(2, 4), 16),
    b: parseInt(c.substring(4, 6), 16),
  };
}

function isColorDark(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 < 140;
}