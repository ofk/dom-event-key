import { describe, expect, it } from 'vitest';
import { createKeyState, equalKeyState } from '../src/keyState';

const testPressing = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: (actual: KeyboardEvent) => void,
): void => {
  it(`returns the result of pressing ${label}`, () => {
    fn(new KeyboardEvent('keydown', eventInit));
  });
};

const testModifierPressing = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: (actual: KeyboardEvent) => void,
): void => {
  it(`returns the result of pressing ${label}`, () => {
    fn(new KeyboardEvent('keydown', eventInit));
    (['ctrlKey', 'metaKey', 'altKey', 'shiftKey'] as const).forEach((key) => {
      if (eventInit[key]) {
        eventInit[key] = !eventInit[key];
      }
    });
    fn(new KeyboardEvent('keydown', eventInit));
  });
};

describe('createKeyState', () => {
  const baseState = {
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    key: '',
  };

  const aState = {
    ...baseState,
    key: 'a',
    code: 'KeyA',
  };

  testPressing('a', { key: 'a', code: 'KeyA' }, (actual) => {
    expect(createKeyState(actual)).toEqual(aState);
  });

  testPressing('Control+a', { key: 'a', code: 'KeyA', ctrlKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...aState, ctrlKey: true });
  });

  testPressing('Meta+a', { key: 'a', code: 'KeyA', metaKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...aState, metaKey: true });
  });

  testPressing('Alt+a', { key: 'å', code: 'KeyA', altKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...aState, altKey: true, key: 'å' });
  });

  testPressing('Shift+a', { key: 'A', code: 'KeyA', shiftKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...aState, shiftKey: true, key: 'A' });
  });

  testPressing('Space', { key: ' ', code: 'Space' }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...baseState, key: 'Space', code: 'Space' });
  });

  testModifierPressing(
    'Control',
    { key: 'Control', code: 'ControlLeft', ctrlKey: true },
    (actual) => {
      expect(createKeyState(actual)).toEqual({ ...baseState, ctrlKey: true, code: 'ControlLeft' });
    },
  );

  testModifierPressing('Meta', { key: 'Meta', code: 'MetaLeft', metaKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...baseState, metaKey: true, code: 'MetaLeft' });
  });

  testModifierPressing('Alt', { key: 'Alt', code: 'AltLeft', altKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...baseState, altKey: true, code: 'AltLeft' });
  });

  testModifierPressing('Shift', { key: 'Shift', code: 'ShiftLeft', shiftKey: true }, (actual) => {
    expect(createKeyState(actual)).toEqual({ ...baseState, shiftKey: true, code: 'ShiftLeft' });
  });
});

describe('equalKeyState', () => {
  const aState = {
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    key: 'a',
  };

  testPressing('a', { key: 'a', code: 'KeyA' }, (actual) => {
    expect(equalKeyState(actual, aState)).toEqual(true);
  });

  testPressing('x', { key: 'x', code: 'KeyX' }, (actual) => {
    expect(equalKeyState(actual, aState)).toEqual(false);
  });

  testPressing('Control+a', { key: 'a', code: 'KeyA', ctrlKey: true }, (actual) => {
    expect(equalKeyState(actual, aState)).toEqual(false);
  });
});
