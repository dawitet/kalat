import {useState, useCallback} from 'react';

interface ConfettiPieceConfig {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  color: string;
  size: number;
}

interface UseConfettiParams {
  count?: number;
  origin?: {x: number; y: number};
  colors?: string[];
  pieceSize?: number;
  duration?: number;
}

export const useConfetti = (params: UseConfettiParams = {}) => {
  const {
    count = 50,
    origin = {x: 0.5, y: 0.5},
    colors = ['#FFC107', '#FF5722', '#4CAF50', '#2196F3', '#9C27B0'],
    pieceSize = 10,
    duration = 3000,
  } = params;

  const [pieces, setPieces] = useState<ConfettiPieceConfig[]>([]);
  const [isFiring, setIsFiring] = useState(false);

  const fireConfetti = useCallback(() => {
    if (isFiring) {
      return;
    }
    setIsFiring(true);

    const newPieces: ConfettiPieceConfig[] = Array.from({length: count}).map(
      (_, i) => {
        return {
          id: `confetti-${Date.now()}-${i}`,
          x: origin.x * 100,
          y: origin.y * 100,
          rotation: Math.random() * 360,
          scale: 1,
          opacity: 1,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: pieceSize * (0.75 + Math.random() * 0.5),
        };
      },
    );

    setPieces(newPieces);

    setTimeout(() => {
      setIsFiring(false);
      setPieces([]);
    }, duration);
  }, [isFiring, count, colors, pieceSize, duration, origin]);

  return {pieces, isFiring, fireConfetti};
};
