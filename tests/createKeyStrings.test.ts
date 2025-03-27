import { describe, expect, it, test } from 'vitest';

import { createKeyStrings } from '../src/createKeyStrings';

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

const testPressingKeyStrings = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: ((actual: ReturnType<typeof createKeyStrings>) => void) | ReturnType<typeof createKeyStrings>,
  options?: Parameters<typeof createKeyStrings>[1],
): void => {
  testPressing(label, eventInit, (event) => {
    const actual = createKeyStrings(event, options);
    if (typeof fn === 'function') {
      fn(actual);
    } else {
      expect(actual).toStrictEqual(fn);
    }
  });
};

const testKeyStrings = (
  label: string,
  eventInitDict: KeyboardEventInit,
  fn:
    | Parameters<typeof testPressingKeyStrings>[2]
    | Partial<Record<'defaults' | 'mac' | 'win', Parameters<typeof testPressingKeyStrings>[2]>>,
  options?: Parameters<typeof testPressingKeyStrings>[3],
): void => {
  if (typeof fn === 'function' || Array.isArray(fn)) {
    testPressingKeyStrings(label, eventInitDict, fn, options);
  } else {
    if (fn.defaults) testPressingKeyStrings(label, eventInitDict, fn.defaults, options);
    if (fn.win)
      testPressingKeyStrings(`${label} for Windows`, eventInitDict, fn.win, {
        modifierKey: true,
        ...options,
      });
    if (fn.mac)
      testPressingKeyStrings(`${label} for Mac`, eventInitDict, fn.mac, {
        metaModifierKey: true,
        modifierKey: true,
        ...options,
      });
  }
};

const testsKeyStrings = (key: string, eventInit?: KeyboardEventInit): void => {
  testPressingKeyStrings(key, { key, ...eventInit }, [key]);

  testKeyStrings(
    `Control+${key}`,
    { ctrlKey: true, key, ...eventInit },
    {
      defaults: [`Control+${key}`],
      mac: [`Control+${key}`],
      win: [`Modifier+${key}`, `Control+${key}`],
    },
  );

  testKeyStrings(
    `Meta+${key}`,
    { key, metaKey: true, ...eventInit },
    {
      defaults: [`Meta+${key}`],
      mac: [`Modifier+${key}`, `Meta+${key}`],
      win: [`Meta+${key}`],
    },
  );

  testKeyStrings(`Alt+${key}`, { altKey: true, key, ...eventInit }, [`Alt+${key}`]);

  testKeyStrings(`Shift+${key}`, { key, shiftKey: true, ...eventInit }, [`Shift+${key}`]);

  testKeyStrings(
    `Control+Shift+${key}`,
    { ctrlKey: true, key, shiftKey: true, ...eventInit },
    {
      defaults: [`Control+Shift+${key}`],
      win: [`Modifier+Shift+${key}`, `Control+Shift+${key}`],
    },
  );

  testKeyStrings(
    `Meta+Shift+${key}`,
    { key, metaKey: true, shiftKey: true, ...eventInit },
    {
      defaults: [`Meta+Shift+${key}`],
      mac: [`Modifier+Shift+${key}`, `Meta+Shift+${key}`],
    },
  );

  testKeyStrings(
    `Control+Meta+Alt+Shift+${key}`,
    { altKey: true, ctrlKey: true, key, metaKey: true, shiftKey: true, ...eventInit },
    {
      defaults: [`Control+Meta+Alt+Shift+${key}`],
      mac: [`Control+Meta+Alt+Shift+${key}`],
      win: [`Control+Meta+Alt+Shift+${key}`],
    },
  );
};

describe('createKeyStrings', () => {
  const keyboardLayoutMap = new Map([
    ['Digit1', '1'],
    ['KeyA', 'a'],
    ['Slash', '/'],
  ]);

  testsKeyStrings('a');

  testKeyStrings('Shift+a with upper A', { key: 'A', shiftKey: true }, ['Shift+a', 'A']);

  testKeyStrings(
    'Alt+a with keyboard layout',
    { altKey: true, code: 'KeyA', key: 'å' },
    ['Alt+a', 'å'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Shift+a with upper A',
    { ctrlKey: true, key: 'A', shiftKey: true },
    {
      defaults: ['Control+Shift+a', 'Control+A'],
      win: ['Modifier+Shift+a', 'Control+Shift+a', 'Modifier+A', 'Control+A'],
    },
  );

  testKeyStrings(
    'Meta+Shift+a with upper A',
    { key: 'A', metaKey: true, shiftKey: true },
    {
      defaults: ['Meta+Shift+a', 'Meta+A'],
      mac: ['Modifier+Shift+a', 'Meta+Shift+a', 'Modifier+A', 'Meta+A'],
    },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+a with upper A',
    { altKey: true, ctrlKey: true, key: 'A', metaKey: true, shiftKey: true },
    {
      defaults: ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A'],
      mac: ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A'],
      win: ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A'],
    },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+a with keyboard layout',
    { altKey: true, code: 'KeyA', ctrlKey: true, key: 'Å', metaKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A', 'Control+Meta+Å'],
    { keyboardLayoutMap },
  );

  testsKeyStrings('1');

  testKeyStrings(
    'Shift+1 with keyboard layout',
    { code: 'Digit1', key: '!', shiftKey: true },
    ['Shift+1', '!'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Alt+1 with keyboard layout',
    { altKey: true, code: 'Digit1', key: '¡' },
    ['Alt+1', '¡'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Shift+1 with keyboard layout',
    { code: 'Digit1', ctrlKey: true, key: '!', shiftKey: true },
    {
      defaults: ['Control+Shift+1', 'Control+!'],
      win: ['Modifier+Shift+1', 'Control+Shift+1', 'Modifier+!', 'Control+!'],
    },
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+1 with Windows keyboard layout',
    { altKey: true, code: 'Digit1', ctrlKey: true, key: '!', metaKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+1', 'Control+Meta+Alt+!'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+1 with Mac keyboard layout',
    { altKey: true, code: 'Digit1', ctrlKey: true, key: '⁄', metaKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+1', 'Control+Meta+⁄'],
    { keyboardLayoutMap },
  );

  testsKeyStrings('/');

  testKeyStrings(
    'Shift+/ with keyboard layout',
    { code: 'Slash', key: '?', shiftKey: true },
    ['Shift+/', '?'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Alt+/ with keyboard layout',
    { altKey: true, code: 'Slash', key: '÷' },
    ['Alt+/', '÷'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Shift+/ with keyboard layout',
    { code: 'Slash', ctrlKey: true, key: '?', shiftKey: true },
    {
      defaults: ['Control+Shift+/', 'Control+?'],
      win: ['Modifier+Shift+/', 'Control+Shift+/', 'Modifier+?', 'Control+?'],
    },
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+/ with Windows keyboard layout',
    { altKey: true, code: 'Slash', ctrlKey: true, key: '?', metaKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+/', 'Control+Meta+Alt+?'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+/ with Mac keyboard layout',
    { altKey: true, code: 'Slash', ctrlKey: true, key: '¿', metaKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+/', 'Control+Meta+¿'],
    { keyboardLayoutMap },
  );

  testsKeyStrings('Space', { key: ' ' });
  testsKeyStrings('F1');

  testKeyStrings(
    'Control',
    { ctrlKey: true, key: 'Control' },
    { defaults: ['Control'], win: ['Modifier', 'Control'] },
  );

  testKeyStrings(
    'Meta',
    { key: 'Meta', metaKey: true },
    { defaults: ['Meta'], mac: ['Modifier', 'Meta'] },
  );

  testKeyStrings('Alt', { altKey: true, key: 'Alt' }, ['Alt']);

  testKeyStrings('Shift', { key: 'Shift', shiftKey: true }, ['Shift']);

  testKeyStrings(
    'Control+Shift',
    { ctrlKey: true, key: 'Control', shiftKey: true },
    { defaults: ['Control+Shift'], win: ['Modifier+Shift', 'Control+Shift'] },
  );

  it('returns the result of pressing Control+Meta+Alt+Shift', () => {
    ['Control', 'Meta', 'Alt', 'Shift'].forEach((key) => {
      expect(
        createKeyStrings(
          new KeyboardEvent('keydown', {
            altKey: true,
            ctrlKey: true,
            key,
            metaKey: true,
            shiftKey: true,
          }),
        ),
      ).toStrictEqual(['Control+Meta+Alt+Shift']);
    });
  });
});
