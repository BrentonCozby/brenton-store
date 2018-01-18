import createStore from '../src/index'

const initalState = {
    foo: {
        a: {
            b: 'b',
        },
        bar() { },
    },
    baz: [1, 2, 3],
}

describe('createStore', () => {
    test('creates an empty state object if no initialState is received', () => {
        const store = createStore()

        expect(store.getState()).toEqual({})
    })

    test('creates a state object from the initalState argument', () => {
        const store = createStore(initalState)

        expect(store.getState()).toEqual(initalState)
        expect(store.getState()).not.toBe(initalState)
    })
})

describe('getState', () => {
    test('returns a deeply-cloned copy of the internal state object', () => {
        const store = createStore(initalState)

        const state1 = store.getState()
        const state2 = store.getState()

        expect(state1).toEqual(state2)
        expect(state1).not.toBe(state2)
    })
})

describe('getStateAt', () => {
    let store

    beforeEach(() => {
        store = createStore(initalState)
    })

    test('returns a copy of the value from the state at the end of the path argument', () => {
        const a = store.getStateAt(['foo', 'a'])

        expect(a).toEqual({ b: 'b' })
        expect(a).not.toBe(initalState.foo.a)
    })

    test('throws a TypeError if path is not an array of strings ()', () => {
        [undefined, null, true, 2, 'two', () => {}, {}, [], [1, 2], [{}], Symbol('symbol'), new Map(), new Set()].forEach(path => {
            const errorMessage = `"path" must be a non-empty array of strings. "path" received: ${String(path)}`

            expect(() => store.getStateAt(path)).toThrow(new TypeError(errorMessage))
        })
    })
})

describe('emit', () => {
    let store
    let someEventHandler

    beforeEach(() => {
        store = createStore(initalState)

        someEventHandler = jest.fn()

        store.subscribe('SOME_EVENT', someEventHandler)
    })

    test('calls the event handler(s) associated the the emitted event', () => {
        store.emit('SOME_EVENT')

        expect(someEventHandler).toHaveBeenCalledWith(store.getState(), store.getState())
    })

    test('throws a TypeError if the type argument is not a string', () => {
        [undefined, true, () => {}, {}, 2, Symbol('symbol')].forEach((type) => {
            const errorMessage = `"type" must be a string. "type" received: ${String(type)}`

            expect(() => store.emit(type)).toThrow(new TypeError(errorMessage))
        })
    })

    test('does not call any event handlers if there are none for the type argument', () => {
        store.emit('FOO_EVENT')

        expect(someEventHandler).not.toHaveBeenCalled()
    })
})

describe('update', () => {
    let store
    let someEventHandler

    beforeEach(() => {
        store = createStore(initalState)

        someEventHandler = jest.fn()

        store.subscribe('SOME_EVENT', someEventHandler)
    })

    test('throws a TypeError if the type argument is not a string', () => {
        [undefined, true, () => {}, {}, 2, Symbol('symbol')].forEach((type) => {
            const errorMessage = `"type" must be a string. "type" received: ${String(type)}`

            expect(() => store.update(type, {})).toThrow(new TypeError(errorMessage))
        })
    })

    test('reassigns the interal state object to be a copy of the payload argument', () => {
        expect(store.getState()).toEqual(initalState)

        store.update('UPDATE_STATE', {
            ...store.getState(),
            baz: [1, 2, 3, 4],
        })

        expect(store.getState()).toEqual({
            ...initalState,
            baz: [1, 2, 3, 4],
        })
    })

    test('calls any event handlers subscribed to the type argument', () => {
        store.update('SOME_EVENT', {})

        expect(someEventHandler).toHaveBeenCalledWith(store.getState(), initalState)
    })

    test('does not call any event handlers if there are none for the type argument', () => {
        store.update('FOO_EVENT', {})

        expect(someEventHandler).not.toHaveBeenCalled()
    })
})

describe('updateAt', () => {
    let store
    let someEventHandler

    beforeEach(() => {
        store = createStore(initalState)

        someEventHandler = jest.fn()

        store.subscribe('UPDATE_B', someEventHandler)
    })

    test('throws a TypeError if path is not an array of strings ()', () => {
        [undefined, null, true, 2, 'two', () => {}, {}, [], [1, 2], [{}], Symbol('symbol'), new Map(), new Set()].forEach(path => {
            const errorMessage = `"path" must be a non-empty array of strings. "path" received: ${String(path)}`

            expect(() => store.updateAt(path, 'UPDATE_B', ['sandwich'])).toThrow(new TypeError(errorMessage))
        })
    })

    test('throws a TypeError if the type argument is not a string', () => {
        [undefined, true, () => {}, {}, 2, Symbol('symbol')].forEach((type) => {
            const errorMessage = `"type" must be a string. "type" received: ${String(type)}`

            expect(() => store.updateAt(['foo', 'a', 'b'], type, ['sandwich'])).toThrow(new TypeError(errorMessage))
        })
    })

    test('updates the value at the end of the path with a copy of the payload', () => {
        expect(store.getState()).toEqual(initalState)

        const payload = ['sandwich']

        store.updateAt(['foo', 'a', 'b'], 'UPDATE_B', payload)

        expect(store.getState().foo.a.b).toEqual(payload)
        expect(store.getState().foo.a.b).not.toBe(payload)
    })

    test('updates the value and the end of the path and creates objects for any missing keys in the path', () => {
        store = createStore({ bar: { c: 'c' } })

        expect(store.getState()).toEqual({ bar: { c: 'c' } })

        const payload = ['sandwich']

        store.updateAt(['bar', 'a', 'b'], 'UPDATE_B', payload)

        expect(store.getState().bar.a).toEqual({ b: payload })
    })

    test('calls any event handlers subscribed to the type argument', () => {
        store.updateAt(['foo', 'a', 'b'], 'UPDATE_B', ['sandwich'])

        expect(someEventHandler).toHaveBeenCalledWith(store.getState(), initalState)
    })

    test('does not call any event handlers if there are none for the type argument', () => {
        store.updateAt(['foo', 'a', 'b'], 'FOO_EVENT', ['sandwich'])

        expect(someEventHandler).not.toHaveBeenCalled()
    })
})

describe('subscribe', () => {
    let store

    beforeEach(() => {
        store = createStore(initalState)
    })

    test('throws a TypeError if the type argument is not a string', () => {
        [undefined, true, () => {}, {}, 2, Symbol('symbol')].forEach((type) => {
            const errorMessage = `"type" must be a string. "type" received: ${String(type)}`

            expect(() => store.subscribe(type, () => {})).toThrow(new TypeError(errorMessage))
        })
    })

    test('throws a TypeError if the handler argument is not a function', () => {
        [undefined, true, 'foo', {}, 2, Symbol('symbol')].forEach((handler) => {
            const errorMessage = `"handler" must be a function. "handler" received: ${String(handler)}`

            expect(() => store.subscribe('SOME_EVENT', handler)).toThrow(new TypeError(errorMessage))
        })
    })

    test('creates new event handlers for an event type', () => {
        const handler1 = jest.fn()
        const handler2 = jest.fn()

        store.subscribe('SOME_EVENT', handler1)
        store.subscribe('SOME_EVENT', handler2)

        store.emit('SOME_EVENT')

        expect(handler1).toHaveBeenCalled()
        expect(handler2).toHaveBeenCalled()
    })

    test('returns a reference to the subscriber function with an unsubsribe method', () => {
        const handler1 = jest.fn()

        const subscribeRef = store.subscribe('SOME_EVENT', handler1)

        subscribeRef.unsubscribe()

        store.emit('SOME_EVENT')

        expect(handler1).not.toHaveBeenCalled()
    })
})
