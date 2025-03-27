export interface KeyState {
  altKey: boolean;
  code?: string;
  ctrlKey: boolean;
  key: string;
  metaKey: boolean;
  shiftKey: boolean;
}

const regModifierKeys = /^(?:Control|Meta|Alt|Shift)$/;

export function createKeyState(state: KeyState): KeyState {
  return {
    altKey: state.key === 'Alt' || state.altKey,
    code: state.code,
    ctrlKey: state.key === 'Control' || state.ctrlKey,
    key: regModifierKeys.test(state.key) ? '' : state.key === ' ' ? 'Space' : state.key,
    metaKey: state.key === 'Meta' || state.metaKey,
    shiftKey: state.key === 'Shift' || state.shiftKey,
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
