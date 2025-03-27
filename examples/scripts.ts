import { createEventKeys, equalEventKey, parseEventKey } from '../src';

function h<T extends keyof HTMLElementTagNameMap>(
  tag: T,
  attrs: Partial<Omit<HTMLElementTagNameMap[T], 'style'>> & {
    style?: Partial<CSSStyleDeclaration>;
  } = {},
  ...children: (HTMLElement | string)[]
): HTMLElementTagNameMap[T] {
  const elem = document.createElement(tag);
  Object.entries(attrs).forEach(([name, value]) => {
    if (name === 'style') {
      Object.assign(elem.style, value);
    } else {
      (elem as unknown as Record<string, unknown>)[name] = value;
    }
  });
  children.forEach((child) => {
    elem.append(typeof child === 'object' ? child : document.createTextNode(child));
  });
  return elem;
}

const allowedKeystrokeInput = h('input', { value: 'Mod + k' });
const allowedKeystrokeResult = h('pre');

const updateAllowKeyInput = (value: string): void => {
  allowedKeystrokeResult.textContent = JSON.stringify(parseEventKey(value), null, '  ');
};
allowedKeystrokeInput.addEventListener('input', (e) => {
  updateAllowKeyInput((e.target as HTMLInputElement).value);
});
updateAllowKeyInput(allowedKeystrokeInput.value);

const allowedKeystrokeSection = h(
  'section',
  {},
  h('h2', {}, 'Allowed keystroke'),
  h('p', {}, allowedKeystrokeInput),
  allowedKeystrokeResult,
);

document.body.append(allowedKeystrokeSection);

const keyEventsTrHeader = h('tr');
const keyEventsTrResult = h('tr');

['keydown', 'keyup'].forEach((type) => {
  const result = h('pre');
  keyEventsTrHeader.append(h('th', {}, type));
  keyEventsTrResult.append(h('td', {}, result));

  window.addEventListener(type, (e) => {
    const evt = e as KeyboardEvent;
    const keys = createEventKeys(evt);
    result.textContent = JSON.stringify(
      {
        ...Object.fromEntries(
          (['timeStamp', 'ctrlKey', 'metaKey', 'altKey', 'shiftKey', 'key', 'repeat'] as const).map(
            (k) => [k, evt[k]],
          ),
        ),
        keys,
        match: equalEventKey(allowedKeystrokeInput.value, evt),
      },
      null,
      '  ',
    );
  });
});

const keyEventsSection = h(
  'section',
  {},
  h('h2', {}, 'Key events'),
  h(
    'table',
    { border: '1', style: { tableLayout: 'fixed', width: '100%' } },
    h('tbody', {}, keyEventsTrHeader, keyEventsTrResult),
  ),
);

document.body.append(keyEventsSection);
