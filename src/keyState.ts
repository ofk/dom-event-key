export interface KeyState {
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  key: string;
  code?: string;
}

const regModifierKeys = /^(?:Control|Meta|Alt|Shift)$/;

export function createKeyState(state: KeyState): KeyState {
  return {
    ctrlKey: state.key === 'Control' || state.ctrlKey,
    metaKey: state.key === 'Meta' || state.metaKey,
    altKey: state.key === 'Alt' || state.altKey,
    shiftKey: state.key === 'Shift' || state.shiftKey,
    // eslint-disable-next-line no-nested-ternary
    key: regModifierKeys.test(state.key) ? '' : state.key === ' ' ? 'Space' : state.key,
    code: state.code,
  };
}

export function equalKeyState(a: Omit<KeyState, 'code'>, b: Omit<KeyState, 'code'>): boolean {
  return (
    a.ctrlKey === b.ctrlKey &&
    a.metaKey === b.metaKey &&
    a.altKey === b.altKey &&
    a.shiftKey === b.shiftKey &&
    a.key === b.key
  );
}
