import { describe, expect, it } from 'vitest';
import { parseKeyString } from '../src/parseKeyString';

const testParsing = (input: string, state: Partial<ReturnType<typeof parseKeyString>>): void => {
  it(`returns the result of pressing ${JSON.stringify(input)}`, () => {
    expect(parseKeyString(input)).toEqual({
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false,
      key: '',
      warning: null,
      ...state,
    });
  });
};

describe('parseKeyString', () => {
  testParsing('a', { key: 'a' });
  testParsing('Control', { ctrlKey: true });
  testParsing('Control+a', { key: 'a', ctrlKey: true });
  testParsing('Control+Meta', { ctrlKey: true, metaKey: true });
  testParsing('Meta+a', { key: 'a', metaKey: true });
  testParsing('Modifier+a', { key: 'a', ctrlKey: true });
  it('returns the result of pressing "Modifier+a for Mac"', () => {
    expect(parseKeyString('Modifier+a', { metaModifierKey: true })).toEqual({
      ctrlKey: false,
      metaKey: true,
      altKey: false,
      shiftKey: false,
      key: 'a',
      warning: null,
    });
  });
  testParsing('Alt+a', { key: 'a', altKey: true });
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
  testParsing('a+Control', { key: 'a', ctrlKey: true, warning: { looseOrder: true } });
  testParsing('Meta+Control', { ctrlKey: true, metaKey: true, warning: { looseOrder: true } });
  testParsing('Shift+Meta', { metaKey: true, shiftKey: true, warning: { looseOrder: true } });
  testParsing('Alt+Shift', { shiftKey: true, altKey: true, warning: { looseOrder: true } });
  testParsing('Shift+a', { key: 'A', shiftKey: true, warning: { looseKey: true } });
  testParsing('Shift+A', { key: 'A', shiftKey: true, warning: { looseModifierKeys: true } });
  testParsing('Control+A', {
    key: 'A',
    ctrlKey: true,
    shiftKey: true,
    warning: { looseModifierKeys: true },
  });
});
