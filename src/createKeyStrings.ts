import type { KeyState } from './keyState';

import { createKeyState } from './keyState';

export type KeyStrings = [string, ...string[]];

interface ToCtrlMetaStringsOptions {
  metaModifierKey?: boolean;
  modifierKey?: boolean;
}

function toCtrlMetaStrings(
  { ctrlKey, metaKey }: KeyState,
  { metaModifierKey = false, modifierKey }: ToCtrlMetaStringsOptions,
): KeyStrings {
  const ctrlMeta = `${ctrlKey ? '+Control' : ''}${metaKey ? '+Meta' : ''}`;
  const isModkey = modifierKey
    ? metaModifierKey
      ? !ctrlKey && metaKey
      : ctrlKey && !metaKey
    : false;
  return isModkey ? ['+Modifier', ctrlMeta] : [ctrlMeta];
}

interface ToAltShitKeyStringsOptions {
  keyboardLayoutMap?: Map<string, string>;
}

function toAltShitKeyStrings(
  { altKey, code, key, shiftKey }: KeyState,
  { keyboardLayoutMap }: ToAltShitKeyStringsOptions,
): KeyStrings {
  const pressKey = key ? `+${key}` : '';
  if (!altKey && !shiftKey) {
    return [pressKey];
  }

  const alt = altKey ? '+Alt' : '';
  const shift = shiftKey ? '+Shift' : '';
  if (shiftKey && /^\+[A-Z]$/.test(pressKey)) {
    return [`${alt}${shift}${pressKey.toLowerCase()}`, `${alt}${pressKey}`];
  }

  if (keyboardLayoutMap && code) {
    const layoutKey = keyboardLayoutMap.get(code);
    if (layoutKey) {
      if (shiftKey && /^\+[\u0021-\u007E]$/.test(pressKey)) {
        return [`${alt}${shift}+${layoutKey}`, `${alt}${pressKey}`];
      }
      if (altKey && !/^\+[\u0021-\u007E]$/.test(pressKey)) {
        return [
          `${alt}${shift}+${layoutKey}`,
          ...(shiftKey && /^[a-z]$/.test(layoutKey) ? [`${alt}+${layoutKey.toUpperCase()}`] : []),
          pressKey,
        ];
      }
    }
  }

  return [`${alt}${shift}${pressKey}`];
}

export interface CreateKeyStringsOptions
  extends ToAltShitKeyStringsOptions,
    ToCtrlMetaStringsOptions {}

// ex.
//   a -> ['a']
//   Control+a -> ['Control+a']
//   Meta+a -> ['Modifier+a', 'Meta+a']
//   Shift+a -> ['Shift+a', 'A']
//   Shift+1 -> ['Shift+1', '!']
//   Shift+/ -> ['Shift+/', '?']
//   Shift+Enter -> ['Shift+Enter']
//   Alt+a -> ['Alt+a', 'å']
//   Alt+Shift+a -> ['Alt+Shift+a', 'Alt+A', 'Å']
//   Meta+Shift+A -> ['Modifier+Shit+a','Meta+Shift+a','Modifier+A','Meta+A']
export function createKeyStrings(
  rawState: KeyState,
  { keyboardLayoutMap, metaModifierKey, modifierKey }: CreateKeyStringsOptions = {},
): KeyStrings {
  const state = createKeyState(rawState);
  const ctrlMetaStrings = toCtrlMetaStrings(state, { metaModifierKey, modifierKey });
  const altShitKeyStrings = toAltShitKeyStrings(state, { keyboardLayoutMap });
  const hotkeys = altShitKeyStrings.reduce<string[]>(
    (result, altShiftKey) => [
      ...result,
      ...ctrlMetaStrings.map((ctrlMeta) => `${ctrlMeta}${altShiftKey}`.slice(1)),
    ],
    [],
  );
  return hotkeys as KeyStrings;
}
