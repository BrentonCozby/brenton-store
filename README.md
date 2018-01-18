# brenton-store
[![CircleCI](https://circleci.com/gh/BrentonCozby/brenton-store.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/BrentonCozby/brenton-store)
[![Coverage Status](https://coveralls.io/repos/github/BrentonCozby/brenton-store/badge.svg?branch=master)](https://coveralls.io/github/BrentonCozby/brenton-store?branch=master)

Lean, immutable state management.

### INSTALL:
```npm install brenton-store```

### API:
```js
import createStore from 'brenton-store'
```
```js
const store = createStore()
```
```js
store.getState()
```
```js
store.getStateAt(['path', 'in', 'your', 'state'])
```
```js
store.emit('EVENT_TYPE')
```
```js
store.update('EVENT_TYPE', payloadToReplaceState)
```
```js
store.updateAt(['path', 'in', 'your', 'state'], 'EVENT_TYPE', payloadForEndOfPath)
```
```js
store.subscribe('EVENT_TYPE', function eventHandler() {})
```
```js
const ref1 = store.subscribe('EVENT_TYPE', function eventHandler() {})
const ref2 = store.subscribe('EVENT_TYPE', function eventHandler() {})
const ref3 = store.subscribe('EVENT_TYPE', function eventHandler() {})

ref2.subscribe()
```
