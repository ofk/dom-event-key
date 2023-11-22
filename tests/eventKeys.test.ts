import { equalEventKey } from '../src';

describe('equalEventKey', () => {
  const keyboardLayoutMap = new Map([
    ['KeyA', 'a'],
    ['Digit1', '1'],
  ]);

  it('returns the result of pressing a', () => {
    const init = { key: 'a' };
    expect(equalEventKey('a', new KeyboardEvent('keydown', init))).toBe(true);
  });

  it('returns the result of pressing A', () => {
    const init = { key: 'A', shiftKey: true };
    expect(equalEventKey('A', new KeyboardEvent('keydown', init))).toBe(true);
    expect(equalEventKey('Shift+a', new KeyboardEvent('keydown', init))).toBe(true);
    expect(equalEventKey('Shift+A', new KeyboardEvent('keydown', init))).toBe(true);
  });

  it('returns the result of pressing !', () => {
    const init = { key: '!', code: 'Digit1', shiftKey: true };
    expect(equalEventKey('!', new KeyboardEvent('keydown', init), { keyboardLayoutMap })).toBe(
      true,
    );
    expect(
      equalEventKey('Shift+1', new KeyboardEvent('keydown', init), { keyboardLayoutMap }),
    ).toBe(true);
  });

  it('returns the result of pressing Alt+a', () => {
    expect(equalEventKey('Alt+a', new KeyboardEvent('keydown', { key: 'a', altKey: true }))).toBe(
      true,
    );
    const init = { key: 'å', code: 'KeyA', altKey: true };
    expect(equalEventKey('Alt+a', new KeyboardEvent('keydown', init), { keyboardLayoutMap })).toBe(
      true,
    );
    expect(equalEventKey('å', new KeyboardEvent('keydown', init), { keyboardLayoutMap })).toBe(
      true,
    );
  });
});
