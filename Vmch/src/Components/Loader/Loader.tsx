import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  size: number;
  className?: string;
  color: [number, number, number];
}

function Loader({ size, className, color }: LoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = 0.5;
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},.75)`;
    let count = size / 4;
    let rotation = 270 * (Math.PI / 180);
    const speed = 3;

    const updateLoader = () => {
      rotation += speed / 100;
    };

    const renderLoader = () => {
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.translate(size / 2, size / 2);
      ctx.rotate(rotation);
      let i = count;
      while (i--) {
        ctx.beginPath();
        ctx.arc(
          0,
          0,
          i + Math.random() * (size / 7.14), // Adjusted to depend on size
          Math.random(),
          Math.PI / 3 + Math.random() / 12,
          false
        );
        ctx.stroke();
      }
      ctx.restore();
    };

    const canvasLoop = () => {
      requestAnimationFrame(canvasLoop);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},.03)`;
      ctx.fillRect(0, 0, size, size); // Adjusted to depend on size
      updateLoader();
      renderLoader();
    };

    canvasLoop();
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("", className)}
      width={size}
      height={size}
    ></canvas>
  );
}

export default Loader;
