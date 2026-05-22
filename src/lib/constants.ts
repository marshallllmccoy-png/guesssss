export const TOTAL_ROUNDS = 5;
export const MAX_SCORE_PER_ROUND = 5000;
export const DECAY_FACTOR = 800; // km
export const TOTAL_MAX_SCORE = TOTAL_ROUNDS * MAX_SCORE_PER_ROUND;

export const SPRING_GENTLE = { type: 'spring' as const, stiffness: 100, damping: 20 };
export const SPRING_BOUNCY = { type: 'spring' as const, stiffness: 300, damping: 15 };
export const SPRING_SLOW = { type: 'spring' as const, stiffness: 50, damping: 20 };
export const EASE_OUT = [0.25, 0.1, 0.25, 1] as const;
