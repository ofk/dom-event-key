import { describe, expect, test } from 'vitest';

import { createKeyState, equalKeyState } from '../src/keyState';

const testPressing = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: (actual: KeyboardEvent) => void,
): void => {
  // eslint-disable-next-line vitest/expect-expect
  test(`returns the result of pressing ${label}`, () => {
    fn(new KeyboardEvent('keydown', eventInit));
  });
};

const testModifierPressing = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: (actual: KeyboardEvent) => void,
): void => {
  // eslint-disable-next-line vitest/expect-expect
  test(`returns the result of pressing ${label}`, () => {
    fn(new KeyboardEvent('keydown', eventInit));
    (['ctrlKey', 'metaKey', 'altKey', 'shiftKey'] as const).forEach((key) => {
      eventInit[key] &&= !eventInit[key];
    });
    fn(new KeyboardEvent('keydown', eventInit));
  });
};

describe('createKeyState', () => {
  const baseState = {
    altKey: false,
    ctrlKey: false,
    key: '',
    metaKey: false,
    shiftKey: false,
  };

  const aState = {
    ...baseState,
    code: 'KeyA',
    key: 'a',
  };

  testPressing('a', { code: 'KeyA', key: 'a' }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual(aState);
  });

  testPressing('Control+a', { code: 'KeyA', ctrlKey: true, key: 'a' }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...aState, ctrlKey: true });
  });

  testPressing('Meta+a', { code: 'KeyA', key: 'a', metaKey: true }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...aState, metaKey: true });
  });

  testPressing('Alt+a', { altKey: true, code: 'KeyA', key: 'å' }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...aState, altKey: true, key: 'å' });
  });

  testPressing('Shift+a', { code: 'KeyA', key: 'A', shiftKey: true }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...aState, key: 'A', shiftKey: true });
  });

  testPressing('Space', { code: 'Space', key: ' ' }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...baseState, code: 'Space', key: 'Space' });
  });

  testModifierPressing(
    'Control',
    { code: 'ControlLeft', ctrlKey: true, key: 'Control' },
    (actual) => {
      expect(createKeyState(actual)).toStrictEqual({
        ...baseState,
        code: 'ControlLeft',
        ctrlKey: true,
      });
    },
  );

  testModifierPressing('Meta', { code: 'MetaLeft', key: 'Meta', metaKey: true }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...baseState, code: 'MetaLeft', metaKey: true });
  });

  testModifierPressing('Alt', { altKey: true, code: 'AltLeft', key: 'Alt' }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({ ...baseState, altKey: true, code: 'AltLeft' });
  });

  testModifierPressing('Shift', { code: 'ShiftLeft', key: 'Shift', shiftKey: true }, (actual) => {
    expect(createKeyState(actual)).toStrictEqual({
      ...baseState,
      code: 'ShiftLeft',
      shiftKey: true,
    });
  });
});

describe('equalKeyState', () => {
  const aState = {
    altKey: false,
    ctrlKey: false,
    key: 'a',
    metaKey: false,
    shiftKey: false,
  };

  testPressing('a', { code: 'KeyA', key: 'a' }, (actual) => {
    expect(equalKeyState(actual, aState)).toBeTruthy();
  });

  testPressing('x', { code: 'KeyX', key: 'x' }, (actual) => {
    expect(equalKeyState(actual, aState)).toBeFalsy();
  });

  testPressing('Control+a', { code: 'KeyA', ctrlKey: true, key: 'a' }, (actual) => {
    expect(equalKeyState(actual, aState)).toBeFalsy();
  });
});
