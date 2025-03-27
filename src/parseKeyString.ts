import type { KeyState } from './keyState';

export interface ParseKeyStringsOptions {
  metaModifierKey?: boolean;
}

export interface KeyStringParseWarning {
  invalidKeys?: boolean;
  looseKey?: boolean;
  looseModifierKeys?: boolean;
  looseOrder?: boolean;
  unnecessarySpaces?: boolean;
}

export interface KeyStateWithWarning extends KeyState {
  warning: KeyStringParseWarning | null;
}

export function parseKeyString(
  keyString: string,
  { metaModifierKey }: ParseKeyStringsOptions = {},
): KeyStateWithWarning {
  const state: KeyState = {
    altKey: false,
    ctrlKey: false,
    key: '',
    metaKey: false,
    shiftKey: false,
  };
  const warning: Required<KeyStringParseWarning> = {
    invalidKeys: false,
    looseKey: false,
    looseModifierKeys: false,
    looseOrder: false,
    unnecessarySpaces: false,
  };

  let orderCount = 0;

  // eslint-disable-next-line no-useless-assignment
  let m: RegExpExecArray | null = null;
  const reg = /(.[^+]*)(?:\+|$)/g;

  while ((m = reg.exec(keyString))) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rawKey = m[1]!;
    const key = rawKey.replaceAll(/\s+/g, '');
    warning.unnecessarySpaces ||= rawKey !== ' ' && rawKey !== key;
    if (/^c.*?tr/i.test(key)) {
      warning.looseModifierKeys ||= key !== 'Control';
      warning.looseOrder ||= orderCount >= 1;
      state.ctrlKey = true;
      orderCount = 1;
    } else if (/^(?:meta|sup|win)/i.test(key)) {
      warning.looseModifierKeys ||= key !== 'Meta';
      warning.looseOrder ||= orderCount >= 2;
      orderCount = 2;
      state.metaKey = true;
    } else if (/^(?:mod|co?m.*?d)/i.test(key)) {
      warning.looseModifierKeys ||= key !== 'Modifier';
      warning.looseOrder ||= orderCount !== 0;
      orderCount = 3;
      state[metaModifierKey ? 'metaKey' : 'ctrlKey'] = true;
    } else if (/^shift/i.test(key)) {
      warning.looseModifierKeys ||= key !== 'Shift';
      warning.looseOrder ||= orderCount >= 4;
      orderCount = 4;
      state.shiftKey = true;
    } else if (/^alt/i.test(key)) {
      warning.looseModifierKeys ||= key !== 'Alt';
      warning.looseOrder ||= orderCount >= 5;
      orderCount = 5;
      state.altKey = true;
    } else {
      const validKey =
        key.length === 0
          ? 'Space'
          : key.length === 1
            ? key
            : key.charAt(0).toUpperCase() + key.slice(1);
      warning.looseKey ||= key !== validKey;
      orderCount = 9;
      state.key ||= validKey;
      warning.invalidKeys ||= state.key !== validKey;
    }
  }

  if (/^[A-Z]$/.test(state.key)) {
    if (state.shiftKey) {
      warning.looseModifierKeys = true;
    } else {
      warning.looseModifierKeys ||= state.ctrlKey || state.metaKey || state.altKey;
      state.shiftKey = true;
    }
  } else if (/^[a-z]$/.test(state.key) && state.shiftKey) {
    warning.looseKey = true;
    state.key = state.key.toUpperCase();
  }

  const warningEntries = Object.entries(warning).filter(([_k, v]) => v);

  return {
    ...state,
    warning: warningEntries.length > 0 ? Object.fromEntries(warningEntries) : null,
  };
}
