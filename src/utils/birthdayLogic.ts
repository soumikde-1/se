export type BirthdayStage =
  | 'lock'
  | 'balloons-cake'
  | 'scratch-cards'
  | 'happy-birthday'
  | 'final-wish';

export type DigitState = 'empty' | 'correct' | 'incorrect';

export const TARGET_PIN = '1407';
export const PIN_HINT = 'Restart date';
export const PIN_ERROR_MESSAGE = 'সব ই ভুলে যা তুই।';
export const PIN_CONFIRM_SMS =
  'দিন টা মনে রাখার জন্য অনেক অনেক ধন্যবাদ । এটা ই সেই দিন যখন থেকে আমাদের সম্পর্কের শুরুর বীজ রোপণ হয়েছিল 🥹\nআর তুই ১৩ই নভেম্বর , এই তারিখটাই ভুলে গিয়েছিলি। Recapitulation করিয়ে দিয়েছি, এবার থেকে যেন তারিখটা মনে থাকে।';

export const STAGE_ORDER: BirthdayStage[] = [
  'lock',
  'balloons-cake',
  'scratch-cards',
  'happy-birthday',
  'final-wish',
];

export function evaluatePinDigits(
  digits: string[],
  targetPin: string = TARGET_PIN
): DigitState[] {
  return Array.from({ length: targetPin.length }, (_, index) => {
    const char = digits[index] ?? '';
    if (!char) return 'empty';
    return char === targetPin[index] ? 'correct' : 'incorrect';
  });
}

export function validatePinSubmission(
  digits: string[],
  targetPin: string = TARGET_PIN
): {
  isValid: boolean;
  digitStates: DigitState[];
  hasError: boolean;
  message: string | null;
} {
  const digitStates = evaluatePinDigits(digits, targetPin);
  const entered = digits.slice(0, targetPin.length).join('');
  const hasIncorrectDigit = digitStates.some((state) => state === 'incorrect');
  const isComplete = entered.length === targetPin.length && digits.slice(0, targetPin.length).every(Boolean);

  if (isComplete && !hasIncorrectDigit) {
    return {
      isValid: true,
      digitStates,
      hasError: false,
      message: PIN_CONFIRM_SMS,
    };
  }

  if (hasIncorrectDigit || isComplete) {
    return {
      isValid: false,
      digitStates,
      hasError: true,
      message: PIN_ERROR_MESSAGE,
    };
  }

  return {
    isValid: false,
    digitStates,
    hasError: false,
    message: null,
  };
}

export function calculateScratchRatio(
  alphaChannelValues: ArrayLike<number>
): number {
  if (alphaChannelValues.length === 0) return 0;
  let cleared = 0;
  for (let i = 0; i < alphaChannelValues.length; i += 1) {
    if (alphaChannelValues[i] < 128) {
      cleared += 1;
    }
  }
  return cleared / alphaChannelValues.length;
}

export function getNextStage(current: BirthdayStage): BirthdayStage {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) {
    return current;
  }
  return STAGE_ORDER[idx + 1];
}

export function parseInitialStageFromSearch(search: string): BirthdayStage {
  const params = new URLSearchParams(search);
  const stageParam = params.get('stage');
  if (stageParam && STAGE_ORDER.includes(stageParam as BirthdayStage)) {
    return stageParam as BirthdayStage;
  }
  if (params.get('autostart') === '1') {
    return 'balloons-cake';
  }
  return 'lock';
}
