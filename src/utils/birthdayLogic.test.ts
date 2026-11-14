import test from 'node:test';
import assert from 'node:assert/strict';
import {
  TARGET_PIN,
  PIN_ERROR_MESSAGE,
  PIN_CONFIRM_SMS,
  evaluatePinDigits,
  validatePinSubmission,
  calculateScratchRatio,
  getNextStage,
  parseInitialStageFromSearch,
} from './birthdayLogic';

test('evaluatePinDigits marks even a single matching digit as correct (green)', () => {
  const states = evaluatePinDigits(['1', '', '', '']);
  assert.deepEqual(states, ['correct', 'empty', 'empty', 'empty']);
});

test('evaluatePinDigits marks non-matching digit as incorrect while keeping matching ones correct', () => {
  const states = evaluatePinDigits(['1', '9', '0', '']);
  assert.deepEqual(states, ['correct', 'incorrect', 'correct', 'empty']);
});

test('validatePinSubmission returns Bengali error message when any wrong digit is entered', () => {
  const res = validatePinSubmission(['1', '9', '', '']);
  assert.equal(res.isValid, false);
  assert.equal(res.hasError, true);
  assert.equal(res.message, PIN_ERROR_MESSAGE);
});

test('validatePinSubmission returns Bengali confirmation SMS when 1407 is entered', () => {
  const res = validatePinSubmission(TARGET_PIN.split(''));
  assert.equal(res.isValid, true);
  assert.equal(res.hasError, false);
  assert.equal(res.message, PIN_CONFIRM_SMS);
  assert.deepEqual(res.digitStates, ['correct', 'correct', 'correct', 'correct']);
});

test('calculateScratchRatio computes cleared fraction accurately', () => {
  const pixels = [0, 0, 255, 255];
  assert.equal(calculateScratchRatio(pixels), 0.5);
  assert.equal(calculateScratchRatio([]), 0);
});

test('stage transitions follow requested sequence', () => {
  assert.equal(getNextStage('lock'), 'balloons-cake');
  assert.equal(getNextStage('balloons-cake'), 'scratch-cards');
  assert.equal(getNextStage('scratch-cards'), 'happy-birthday');
  assert.equal(getNextStage('happy-birthday'), 'final-wish');
  assert.equal(getNextStage('final-wish'), 'final-wish');
});

test('parseInitialStageFromSearch supports autostart and explicit stage', () => {
  assert.equal(parseInitialStageFromSearch(''), 'lock');
  assert.equal(parseInitialStageFromSearch('?autostart=1'), 'balloons-cake');
  assert.equal(parseInitialStageFromSearch('?stage=scratch-cards'), 'scratch-cards');
  assert.equal(parseInitialStageFromSearch('?stage=invalid'), 'lock');
});
