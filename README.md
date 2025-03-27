# dom-event-key

[![npm](https://img.shields.io/npm/v/dom-event-key)](https://npmjs.com/package/dom-event-key)
![ci](https://github.com/ofk/dom-event-key/actions/workflows/ci.yml/badge.svg)

dom-event-key simplifies handling browser keyboard events by providing a convenient way to check if a given key event matches a specified shortcut key.

## Install

```sh
npm install dom-event-key
```

## Usage

```js
import { equalEventKey } from 'dom-event-key';

// Detect shortcut key from keyboard events
window.addEventListener('keydown', (e) => {
  if (equalEventKey('Ctrl+k', e)) {
    alert('Ctrl+k pressed');
  }
});
```

## API

### `createEventKeys(state[, options]) => string[]`

Generates an array of string representations of keyboard event keys based on the provided state object.

```js
window.addEventListener('keydown', (e) => {
  console.log(createEventKeys(e)); // => ex. ['Modifier+k', 'Control+k']
});
```

### `parseEventKey(key[, options]) => state`

Parses the given string representation of a keyboard event key and returns the corresponding state object.

```js
console.log(parseEventKey('Ctrl+k')); // => { ctrlKey: true, key: 'k', ... }
```

### `equalEventKey(keyOrState, otherKeyOrState) => boolean`

Compares two keyboard event keys or state objects and returns true if they are equal, false otherwise.

```js
window.addEventListener('keydown', (e) => {
  console.log(equalEventKey('Ctrl+k', e)); // => true OR false
});
```
