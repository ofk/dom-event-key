import { describe, expect, it, test } from 'vitest';

import { parseKeyString } from '../src/parseKeyString';

const testParsing = (input: string, state: Partial<ReturnType<typeof parseKeyString>>): void => {
  test(`returns the result of pressing ${JSON.stringify(input)}`, () => {
    expect(parseKeyString(input)).toStrictEqual({
      altKey: false,
      ctrlKey: false,
      key: '',
      metaKey: false,
      shiftKey: false,
      warning: null,
      ...state,
    });
  });
};

describe('parseKeyString', () => {
  testParsing('a', { key: 'a' });
  testParsing('Control', { ctrlKey: true });
  testParsing('Control+a', { ctrlKey: true, key: 'a' });
  testParsing('Control+Meta', { ctrlKey: true, metaKey: true });
  testParsing('Meta+a', { key: 'a', metaKey: true });
  testParsing('Modifier+a', { ctrlKey: true, key: 'a' });

  it('returns the result of pressing "Modifier+a for Mac"', () => {
    expect(parseKeyString('Modifier+a', { metaModifierKey: true })).toStrictEqual({
      altKey: false,
      ctrlKey: false,
      key: 'a',
      metaKey: true,
      shiftKey: false,
      warning: null,
    });
  });

  testParsing('Alt+a', { altKey: true, key: 'a' });
  testParsing('A', { key: 'A', shiftKey: true });
  testParsing('Space', { key: 'Space' });
  testParsing('Shift+Space', { key: 'Space', shiftKey: true });
  testParsing('+', { key: '+' });
  testParsing('Meta++', { key: '+', metaKey: true });

  testParsing('a ', { key: 'a', warning: { unnecessarySpaces: true } });
  testParsing(' ', { key: 'Space', warning: { looseKey: true } });
  testParsing('ctrl', { ctrlKey: true, warning: { looseModifierKeys: true } });
  testParsing('win', { metaKey: true, warning: { looseModifierKeys: true } });
  testParsing('mod', { ctrlKey: true, warning: { looseModifierKeys: true } });
  testParsing('alt', { altKey: true, warning: { looseModifierKeys: true } });
  testParsing('Control+Control', { ctrlKey: true, warning: { looseOrder: true } });
  testParsing('a+Control', { ctrlKey: true, key: 'a', warning: { looseOrder: true } });
  testParsing('Meta+Control', { ctrlKey: true, metaKey: true, warning: { looseOrder: true } });
  testParsing('Shift+Meta', { metaKey: true, shiftKey: true, warning: { looseOrder: true } });
  testParsing('Alt+Shift', { altKey: true, shiftKey: true, warning: { looseOrder: true } });
  testParsing('Shift+a', { key: 'A', shiftKey: true, warning: { looseKey: true } });
  testParsing('Shift+A', { key: 'A', shiftKey: true, warning: { looseModifierKeys: true } });
  testParsing('Control+A', {
    ctrlKey: true,
    key: 'A',
    shiftKey: true,
    warning: { looseModifierKeys: true },
  });
});
