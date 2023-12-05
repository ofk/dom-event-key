import type { KeyState } from './keyState';

export interface ParseKeyStringsOptions {
  metaModifierKey?: boolean;
}

export interface KeyStringParseWarning {
  unnecessarySpaces?: boolean;
  looseModifierKeys?: boolean;
  looseOrder?: boolean;
  looseKey?: boolean;
  invalidKeys?: boolean;
}

export interface KeyStateWithWarning extends KeyState {
  modKey: boolean;
  warning: KeyStringParseWarning | null;
}

export function parseKeyString(
  keyString: string,
  { metaModifierKey }: ParseKeyStringsOptions = {},
): KeyStateWithWarning {
  const state: KeyStateWithWarning = {
    ctrlKey: false,
    metaKey: false,
    altKey: false,
    shiftKey: false,
    key: '',
    modKey: false,
    warning: null,
  };
  const warning: KeyStringParseWarning = {};

  let orderCount = 0;

  let m: RegExpExecArray | null = null;
  const reg = /(.[^+]*)(?:\+|$)/g;
  // eslint-disable-next-line no-cond-assign
  while ((m = reg.exec(keyString))) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const rawKey = m[1]!;
    const key = rawKey.replace(/\s+/g, '');
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
      state.modKey = true;
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
        // eslint-disable-next-line no-nested-ternary
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
  } else if (/^[a-z]$/.test(state.key)) {
    if (state.shiftKey) {
      warning.looseKey = true;
      state.key = state.key.toUpperCase();
    }
  }

  const warningEntries = Object.entries(warning).filter(([_k, v]) => v);

  return warningEntries.length
    ? {
        ...state,
        warning: warningEntries.length ? Object.fromEntries(warningEntries) : null,
      }
    : state;
}
