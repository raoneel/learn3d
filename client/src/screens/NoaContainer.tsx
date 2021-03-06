import React, { useRef } from 'react';
import { initNoa } from '../noa/noaSetup';
import ReactResizeDetector from 'react-resize-detector';
import "./NoaContainer.scss";

export function NoaContainer () {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    initNoa();
  }, []);

  let onResize = (width: number, height: number) => {
    if (!canvasRef || !canvasRef.current) {
      return;
    }

    let canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    // Triggers an engine resize
    canvas.width = width;
    canvas.height = height;
  };

  return (
    <div id="NoaContainer">
      <ReactResizeDetector refreshMode="debounce" refreshRate={100} handleWidth handleHeight onResize={onResize} />
      <canvas ref={canvasRef} className="NoaCanvas"></canvas>
      <div className="NoaContainer-Crosshair"></div>
    </div>
  );
}
