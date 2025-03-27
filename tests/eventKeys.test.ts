import { describe, expect, it } from 'vitest';

import { equalEventKey } from '../src';

describe('equalEventKey', () => {
  const keyboardLayoutMap = new Map([
    ['Digit1', '1'],
    ['KeyA', 'a'],
  ]);

  it('returns the result of pressing a', () => {
    const init = { key: 'a' };

    expect(equalEventKey('a', new KeyboardEvent('keydown', init))).toBeTruthy();
  });

  it('returns the result of pressing A', () => {
    const init = { key: 'A', shiftKey: true };

    expect(equalEventKey('A', new KeyboardEvent('keydown', init))).toBeTruthy();
    expect(equalEventKey('Shift+a', new KeyboardEvent('keydown', init))).toBeTruthy();
    expect(equalEventKey('Shift+A', new KeyboardEvent('keydown', init))).toBeTruthy();
  });

  it('returns the result of pressing !', () => {
    const init = { code: 'Digit1', key: '!', shiftKey: true };

    expect(
      equalEventKey('!', new KeyboardEvent('keydown', init), { keyboardLayoutMap }),
    ).toBeTruthy();
    expect(
      equalEventKey('Shift+1', new KeyboardEvent('keydown', init), { keyboardLayoutMap }),
    ).toBeTruthy();
  });

  it('returns the result of pressing Alt+a', () => {
    expect(
      equalEventKey('Alt+a', new KeyboardEvent('keydown', { altKey: true, key: 'a' })),
    ).toBeTruthy();

    const init = { altKey: true, code: 'KeyA', key: 'å' };

    expect(
      equalEventKey('Alt+a', new KeyboardEvent('keydown', init), { keyboardLayoutMap }),
    ).toBeTruthy();
    expect(
      equalEventKey('å', new KeyboardEvent('keydown', init), { keyboardLayoutMap }),
    ).toBeTruthy();
  });
});
