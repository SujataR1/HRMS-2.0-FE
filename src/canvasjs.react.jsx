import React, { useEffect, useRef } from 'react';
import CanvasJS from './canvasjs.min'; // must be a direct `.js` file, not npm

export const CanvasJSChart = ({ options, containerProps = {} }) => {
  const chartContainerRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const chart = new CanvasJS.Chart(chartContainerRef.current, options);
    chart.render();
  }, [options]);

  return <div ref={chartContainerRef} style={{ width: '100%', ...containerProps }} />;
};
