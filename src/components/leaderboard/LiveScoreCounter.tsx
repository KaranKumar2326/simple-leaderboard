import React, { useEffect, useState } from 'react';

interface LiveScoreCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export const LiveScoreCounter: React.FC<LiveScoreCounterProps> = ({
  value,
  decimals = 1,
  suffix = '%',
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const targetValue = value;
    const duration = 650;

    if (startValue === targetValue) return;

    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = startValue + (targetValue - startValue) * ease;
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(targetValue);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return (
    <span className={`tabular-nums font-mono ${className}`}>
      {displayValue.toFixed(decimals)}{suffix}
    </span>
  );
};
