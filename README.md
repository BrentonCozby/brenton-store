# brenton-store
[![CircleCI](https://circleci.com/gh/BrentonCozby/brenton-store.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/BrentonCozby/brenton-store)
[![Coverage Status](https://coveralls.io/repos/github/BrentonCozby/brenton-store/badge.svg?branch=master)](https://coveralls.io/github/BrentonCozby/brenton-store?branch=master)

Lean, predictable state management. Based on [Flux](https://facebook.github.io/flux/docs/in-depth-overview.html#content), specifically the [Redux](https://redux.js.org/) implementation.

```bash
npm install brenton-store
```

## API:
```js
import createStore from 'brenton-store'
```
```js
const initialState = {
    foo: {
        bar: 'baz'
    }
}

const store = createStore(initialState)
```
```js
store.getState().foo // === { bar: 'baz' }
```

```js
store.getStateAt(['foo', 'bar']) // === 'baz'
```

```js
store.subscribe('EVENT_TYPE', (nextState, prevState) => {
    console.log(nextState, prevState)
})
```

```js
const ref1 = store.subscribe('EVENT_TYPE', (nextState, prevState) => {
    console.log(nextState, prevState)
})
const ref2 = store.subscribe('EVENT_TYPE', (nextState, prevState) => {
    console.log(nextState, prevState)
})
const ref3 = store.subscribe('EVENT_TYPE', (nextState, prevState) => {
    console.log(nextState, prevState)
})

// deletes the eventHandler for ref2
ref2.unsubscribe()
```

```js
// calls all eventHandlers subscribed to 'EVENT_TYPE'
store.emit('EVENT_TYPE')
```

```js
const payloadToReplaceState = { foo: 'foo' }

// calls all eventHandlers subscribed to 'EVENT_TYPE'
// and replaces state with payload
store.update('EVENT_TYPE', payloadToReplaceState)

store.getState() // === { foo: 'foo' }
```

```js
const payloadToReplaceValueAtEndOfPath = ['sandwich']

// calls all eventHandlers subscribed to 'EVENT_TYPE'
// and replaces state.foo with payload
store.updateAt(['foo'], 'EVENT_TYPE', payloadToReplaceValueAtEndOfPath)

store.getState() // === { foo: ['sandwich'] }
```
