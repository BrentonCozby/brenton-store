# brenton-store
[![CircleCI](https://circleci.com/gh/BrentonCozby/brenton-store.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/BrentonCozby/brenton-store)
[![Coverage Status](https://coveralls.io/repos/github/BrentonCozby/brenton-store/badge.svg?branch=master)](https://coveralls.io/github/BrentonCozby/brenton-store?branch=master)

Lean, immutable state management.

### INSTALL:
```npm install brenton-store```

### API:
```import createStore from 'brenton-store'```
```const store = createStore()```
```store.getState()```
```store.getStateAt(['path', 'in', 'your', 'state'])```
```store.emit('EVENT_TYPE')```
```store.update('EVENT_TYPE', payloadToReplaceState)```
```store.updateAt(['path', 'in', 'your', 'state'], 'EVENT_TYPE', payloadForEndOfPath)```
```store.subscribe('EVENT_TYPE', function eventHandler() {})```
```
const ref1 = store.subscribe('EVENT_TYPE', function eventHandler() {})
const ref2 = store.subscribe('EVENT_TYPE', function eventHandler() {})
const ref3 = store.subscribe('EVENT_TYPE', function eventHandler() {})

ref2.subscribe()
```
