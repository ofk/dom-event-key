import { describe, expect, it } from 'vitest';
import { createKeyStrings } from '../src/createKeyStrings';

const testPressing = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: (actual: KeyboardEvent) => void,
): void => {
  it(`returns the result of pressing ${label}`, () => {
    fn(new KeyboardEvent('keydown', eventInit));
  });
};

const testPressingKeyStrings = (
  label: string,
  eventInit: KeyboardEventInit,
  fn: ReturnType<typeof createKeyStrings> | ((actual: ReturnType<typeof createKeyStrings>) => void),
  options?: Parameters<typeof createKeyStrings>[1],
): void => {
  testPressing(label, eventInit, (event) => {
    const actual = createKeyStrings(event, options);
    if (typeof fn === 'function') {
      fn(actual);
    } else {
      expect(actual).toEqual(fn);
    }
  });
};

const testKeyStrings = (
  label: string,
  eventInitDict: KeyboardEventInit,
  fn:
    | Parameters<typeof testPressingKeyStrings>[2]
    | Partial<Record<'defaults' | 'win' | 'mac', Parameters<typeof testPressingKeyStrings>[2]>>,
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
        modifierKey: true,
        metaModifierKey: true,
        ...options,
      });
  }
};

const testsKeyStrings = (key: string, eventInit?: KeyboardEventInit): void => {
  testPressingKeyStrings(key, { key, ...eventInit }, [key]);

  testKeyStrings(
    `Control+${key}`,
    { key, ctrlKey: true, ...eventInit },
    {
      defaults: [`Control+${key}`],
      win: [`Modifier+${key}`, `Control+${key}`],
      mac: [`Control+${key}`],
    },
  );

  testKeyStrings(
    `Meta+${key}`,
    { key, metaKey: true, ...eventInit },
    {
      defaults: [`Meta+${key}`],
      win: [`Meta+${key}`],
      mac: [`Modifier+${key}`, `Meta+${key}`],
    },
  );

  testKeyStrings(`Alt+${key}`, { key, altKey: true, ...eventInit }, [`Alt+${key}`]);

  testKeyStrings(`Shift+${key}`, { key, shiftKey: true, ...eventInit }, [`Shift+${key}`]);

  testKeyStrings(
    `Control+Shift+${key}`,
    { key, ctrlKey: true, shiftKey: true, ...eventInit },
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
    { key, ctrlKey: true, metaKey: true, altKey: true, shiftKey: true, ...eventInit },
    {
      defaults: [`Control+Meta+Alt+Shift+${key}`],
      win: [`Control+Meta+Alt+Shift+${key}`],
      mac: [`Control+Meta+Alt+Shift+${key}`],
    },
  );
};

describe('createKeyStrings', () => {
  const keyboardLayoutMap = new Map([
    ['KeyA', 'a'],
    ['Digit1', '1'],
    ['Slash', '/'],
  ]);

  testsKeyStrings('a');

  testKeyStrings('Shift+a with upper A', { key: 'A', shiftKey: true }, ['Shift+a', 'A']);

  testKeyStrings(
    'Alt+a with keyboard layout',
    { key: 'å', code: 'KeyA', altKey: true },
    ['Alt+a', 'å'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Shift+a with upper A',
    { key: 'A', ctrlKey: true, shiftKey: true },
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
    { key: 'A', ctrlKey: true, metaKey: true, altKey: true, shiftKey: true },
    {
      defaults: ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A'],
      win: ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A'],
      mac: ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A'],
    },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+a with keyboard layout',
    { key: 'Å', code: 'KeyA', ctrlKey: true, metaKey: true, altKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+a', 'Control+Meta+Alt+A', 'Control+Meta+Å'],
    { keyboardLayoutMap },
  );

  testsKeyStrings('1');

  testKeyStrings(
    'Shift+1 with keyboard layout',
    { key: '!', code: 'Digit1', shiftKey: true },
    ['Shift+1', '!'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Alt+1 with keyboard layout',
    { key: '¡', code: 'Digit1', altKey: true },
    ['Alt+1', '¡'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Shift+1 with keyboard layout',
    { key: '!', code: 'Digit1', ctrlKey: true, shiftKey: true },
    {
      defaults: ['Control+Shift+1', 'Control+!'],
      win: ['Modifier+Shift+1', 'Control+Shift+1', 'Modifier+!', 'Control+!'],
    },
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+1 with Windows keyboard layout',
    { key: '!', code: 'Digit1', ctrlKey: true, metaKey: true, altKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+1', 'Control+Meta+Alt+!'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+1 with Mac keyboard layout',
    { key: '⁄', code: 'Digit1', ctrlKey: true, metaKey: true, altKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+1', 'Control+Meta+⁄'],
    { keyboardLayoutMap },
  );

  testsKeyStrings('/');

  testKeyStrings(
    'Shift+/ with keyboard layout',
    { key: '?', code: 'Slash', shiftKey: true },
    ['Shift+/', '?'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Alt+/ with keyboard layout',
    { key: '÷', code: 'Slash', altKey: true },
    ['Alt+/', '÷'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Shift+/ with keyboard layout',
    { key: '?', code: 'Slash', ctrlKey: true, shiftKey: true },
    {
      defaults: ['Control+Shift+/', 'Control+?'],
      win: ['Modifier+Shift+/', 'Control+Shift+/', 'Modifier+?', 'Control+?'],
    },
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+/ with Windows keyboard layout',
    { key: '?', code: 'Slash', ctrlKey: true, metaKey: true, altKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+/', 'Control+Meta+Alt+?'],
    { keyboardLayoutMap },
  );

  testKeyStrings(
    'Control+Meta+Alt+Shift+/ with Mac keyboard layout',
    { key: '¿', code: 'Slash', ctrlKey: true, metaKey: true, altKey: true, shiftKey: true },
    ['Control+Meta+Alt+Shift+/', 'Control+Meta+¿'],
    { keyboardLayoutMap },
  );

  testsKeyStrings('Space', { key: ' ' });
  testsKeyStrings('F1');

  testKeyStrings(
    'Control',
    { key: 'Control', ctrlKey: true },
    { defaults: ['Control'], win: ['Modifier', 'Control'] },
  );

  testKeyStrings(
    'Meta',
    { key: 'Meta', metaKey: true },
    { defaults: ['Meta'], mac: ['Modifier', 'Meta'] },
  );

  testKeyStrings('Alt', { key: 'Alt', altKey: true }, ['Alt']);

  testKeyStrings('Shift', { key: 'Shift', shiftKey: true }, ['Shift']);

  testKeyStrings(
    'Control+Shift',
    { key: 'Control', ctrlKey: true, shiftKey: true },
    { defaults: ['Control+Shift'], win: ['Modifier+Shift', 'Control+Shift'] },
  );

  it('returns the result of pressing Control+Meta+Alt+Shift', () => {
    ['Control', 'Meta', 'Alt', 'Shift'].forEach((key) => {
      expect(
        createKeyStrings(
          new KeyboardEvent('keydown', {
            key,
            ctrlKey: true,
            metaKey: true,
            altKey: true,
            shiftKey: true,
          }),
        ),
      ).toEqual(['Control+Meta+Alt+Shift']);
    });
  });
});
