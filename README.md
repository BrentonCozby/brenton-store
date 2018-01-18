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
const initalState = {
    foo: {
        bar: 'baz'
    }
}

const store = createStore(initialState)
```
```js
store.getState().foo.bar // === 'baz'
```
```js
store.getStateAt(['foo']) // === { bar: 'baz' }
```
```js
store.emit('EVENT_TYPE') // calls all eventHandlers subscribed to 'EVENT_TYPE'
```
```js
store.update('EVENT_TYPE', { foo: 'foo' }) // calls all eventHandlers subscribed to 'EVENT_TYPE'
store.getState() // === { foo: 'foo' }
```
```js
store.updateAt(['foo'], 'EVENT_TYPE', ['sandwich']) // calls all eventHandlers subscribed to 'EVENT_TYPE'
store.getState() // === { foo: ['sandwich'] }
```
```js
store.subscribe('EVENT_TYPE', function eventHandler(nextState, prevState) {})
```
```js
const ref1 = store.subscribe('EVENT_TYPE', function eventHandler(nextState, prevState) {})
const ref2 = store.subscribe('EVENT_TYPE', function eventHandler(nextState, prevState) {})
const ref3 = store.subscribe('EVENT_TYPE', function eventHandler(nextState, prevState) {})

ref2.unsubscribe() // deletes the eventHandler for ref2
```
