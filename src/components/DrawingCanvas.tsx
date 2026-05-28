import { useRef, useEffect, useState } from "react";
import { Pencil, Eraser, Trash2, Download, Upload } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DrawingCanvasProps {
  initialData?: string;
  onChange?: (dataUrl: string) => void;
}

const COLORS = [
  "#000000",
  "#FF6B35",
  "#F7C59F",
  "#2EC4B6",
  "#9B5DE5",
  "#00BBF9",
  "#FFD166",
  "#06D6A0",
  "#EF476F",
  "#FFFFFF",
];

const BRUSH_SIZES = [2, 4, 8, 12, 20];

export default function DrawingCanvas({ initialData, onChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"brush" | "eraser">("brush");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(4);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveToHistory();
      };
      img.src = initialData;
    } else {
      saveToHistory();
    }
  }, [initialData]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    
    if (onChange) {
      onChange(dataUrl);
    }
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      if (onChange) {
        onChange(history[newIndex]);
      }
    };
    img.src = history[newIndex];
  };

  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      
      if (onChange) {
        onChange(history[newIndex]);
      }
    };
    img.src = history[newIndex];
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = tool === "eraser" ? brushSize * 3 : brushSize;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between bg-gray-50 p-3 rounded-xl">
        <div className="flex gap-2">
          <button
            onClick={() => setTool("brush")}
            className={cn(
              "p-2 rounded-lg transition-all",
              tool === "brush"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            )}
            title="画笔"
          >
            <Pencil size={20} />
          </button>
          
          <button
            onClick={() => setTool("eraser")}
            className={cn(
              "p-2 rounded-lg transition-all",
              tool === "eraser"
                ? "bg-orange-500 text-white shadow-md"
                : "bg-white text-gray-600 hover:bg-gray-100"
            )}
            title="橡皮擦"
          >
            <Eraser size={20} />
          </button>
          
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="撤销"
          >
            <span className="text-lg">↩</span>
          </button>
          
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="重做"
          >
            <span className="text-lg">↪</span>
          </button>
          
          <button
            onClick={clearCanvas}
            className="p-2 rounded-lg bg-white text-red-600 hover:bg-red-50 transition-all"
            title="清空画布"
          >
            <Trash2 size={20} />
          </button>
        </div>
        
        <div className="flex gap-3 items-center">
          <div className="flex gap-1">
            {BRUSH_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setBrushSize(size)}
                className={cn(
                  "rounded-full bg-gray-200 transition-all hover:scale-110",
                  brushSize === size && "ring-2 ring-orange-500 ring-offset-1"
                )}
                style={{
                  width: Math.max(size * 1.5, 12),
                  height: Math.max(size * 1.5, 12),
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-xl">
        <span className="text-sm text-gray-600 mr-2">颜色:</span>
        {COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={cn(
              "w-8 h-8 rounded-full transition-transform hover:scale-110",
              color === c && "ring-2 ring-offset-2 ring-gray-400"
            )}
            style={{ backgroundColor: c, border: c === "#FFFFFF" ? "1px solid #ddd" : "none" }}
          />
        ))}
      </div>

      <div
        ref={containerRef}
        className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-white"
        style={{ height: "400px" }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
    </div>
  );
}
