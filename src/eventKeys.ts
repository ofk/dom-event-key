import type { CreateKeyStringsOptions, KeyStrings } from './createKeyStrings';
import { createKeyStrings } from './createKeyStrings';
import type { KeyState } from './keyState';
import { createKeyState } from './keyState';
import type { KeyStateWithWarning, ParseKeyStringsOptions } from './parseKeyString';
import { parseKeyString } from './parseKeyString';

export const metaModifierKey = /Mac|iPod|iPhone|iPad/.test(
  typeof navigator !== 'undefined' ? navigator.platform : '',
);

export const keyboardLayoutMap = ((): Map<string, string> => {
  // cf. https://www.w3.org/TR/uievents-code/
  const defaultKeyboardLayoutMap: [string, string][] = [
    ['Backquote', '`'],
    ['Backslash', '\\'],
    ['BracketLeft', '['],
    ['BracketRight', ']'],
    ['Comma', ','],
    ['Equal', '='],
    ['Minus', '-'],
    ['Period', '.'],
    ['Quote', "'"],
    ['Semicolon', ';'],
    ['Slash', '/'],
    ['NumpadAdd', '+'],
    ['NumpadDivide', '/'],
    ['NumpadEqual', '='],
    ['NumpadMultiply', '*'],
    ['NumpadSubtract', '-'],
  ];

  for (let i = 0; i < 10; i += 1) {
    defaultKeyboardLayoutMap.push([`Digit${i}`, `${i}`], [`Numpad${i}`, `${i}`]);
  }

  for (let i = 0; i < 26; i += 1) {
    const c = String.fromCharCode(97 + i);
    defaultKeyboardLayoutMap.push([`Key${c.toUpperCase()}`, c]);
  }

  return new Map(defaultKeyboardLayoutMap);
})();

export function createEventKeys(
  state: KeyState,
  options: CreateKeyStringsOptions = {},
): KeyStrings {
  return createKeyStrings(state, {
    modifierKey: true,
    metaModifierKey,
    keyboardLayoutMap,
    ...options,
  });
}

export function parseEventKey(
  key: KeyState | string,
  options: ParseKeyStringsOptions = {},
): KeyState | KeyStateWithWarning {
  return typeof key === 'string'
    ? parseKeyString(key, { metaModifierKey, ...options })
    : createKeyState(key);
}

export function equalEventKey(
  a: KeyState | string,
  b: KeyState | string,
  options: CreateKeyStringsOptions = {},
): boolean {
  const aKeys = createEventKeys(parseEventKey(a, options), options);
  const bKeys = createEventKeys(parseEventKey(b, options), options);
  return aKeys.some((aKey) => bKeys.includes(aKey));
}
