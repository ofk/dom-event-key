import type { KeyState } from './keyState';
import { createKeyState } from './keyState';

export type KeyStrings = [string, ...string[]];

interface ToCtrlMetaStringsOptions {
  modifierKey?: boolean;
  metaModifierKey?: boolean;
}

function toCtrlMetaStrings(
  { ctrlKey, metaKey }: KeyState,
  { modifierKey, metaModifierKey = false }: ToCtrlMetaStringsOptions,
): KeyStrings {
  const ctrlMeta = `${ctrlKey ? '+Control' : ''}${metaKey ? '+Meta' : ''}`;
  // eslint-disable-next-line no-nested-ternary
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
  { altKey, shiftKey, key, code }: KeyState,
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
      if (shiftKey && /^\+[\x21-\x7e]$/.test(pressKey)) {
        return [`${alt}${shift}+${layoutKey}`, `${alt}${pressKey}`];
      }
      if (altKey && !/^\+[\x21-\x7e]$/.test(pressKey)) {
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
  extends ToCtrlMetaStringsOptions,
    ToAltShitKeyStringsOptions {}

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
  { modifierKey, metaModifierKey, keyboardLayoutMap }: CreateKeyStringsOptions = {},
): KeyStrings {
  const state = createKeyState(rawState);
  const ctrlMetaStrings = toCtrlMetaStrings(state, { modifierKey, metaModifierKey });
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
