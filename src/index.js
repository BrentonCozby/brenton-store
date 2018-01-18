const cloneDeep = require('lodash.clonedeep')

const validateParamString = ({ name, value }) => {
    if (typeof value !== 'string') {
        throw new TypeError(`"${name}" must be a string. "${name}" received: ${String(value)}`)
    }
}

const validateParamFunction = ({ name, value }) => {
    if (typeof value !== 'function') {
        throw new TypeError(`"${name}" must be a function. "${name}" received: ${String(value)}`)
    }
}

const validateParamArrayOfStrings = ({ name, value }) => {
    if (typeof value !== 'object' ||
        Object.prototype.toString.call(value) !== '[object Array]' ||
        value.length === 0 ||
        value.some(key => typeof key !== 'string')
    ) {
        throw new TypeError(`"${name}" must be a non-empty array of strings. "${name}" received: ${String(value)}`)
    }
}

const createStore = function (initialState) {
    let state = initialState || {}

    const eventHandlers = {}

    const getState = (...args) => {
        if (args.length > 0) {
            throw new Error(`getState does not use any arguments you pass to it. Arguments passed: ${JSON.stringify(args)}`) // eslint-disable-line prefer-rest-params
        }

        return cloneDeep(state)
    }

    const getStateAt = (path) => {
        validateParamArrayOfStrings({ name: 'path', value: path })

        return path.reduce((node, key) => node[key], getState())
    }

    const emit = (type) => {
        validateParamString({ name: 'type', value: type })

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler(getState(), getState()))
        }
    }

    const update = (type, payload) => {
        validateParamString({ name: 'type', value: type })

        const prevState = getState()
        const nextState = cloneDeep(payload)

        state = nextState

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler(nextState, prevState))
        }
    }

    const updateAt = (path, type, payload) => {
        validateParamArrayOfStrings({ name: 'path', value: path })
        validateParamString({ name: 'type', value: type })

        const prevState = getState()
        const newState = getState()

        const lastPathKey = path[path.length - 1]
        const targetNode = path.reduce((nodePointer, pathKey, i) => {
            if (!hasOwnProperty.call(nodePointer, pathKey)) {
                nodePointer[pathKey] = {} // eslint-disable-line no-param-reassign
            }

            if (i === path.length - 1) {
                return nodePointer
            }

            return nodePointer[pathKey]
        }, newState)

        targetNode[lastPathKey] = cloneDeep(payload)

        state = newState

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler(getState(), prevState))
        }
    }

    const subscribe = function (type, handler) {
        validateParamString({ name: 'type', value: type })
        validateParamFunction({ name: 'handler', value: handler })

        if (!eventHandlers[type]) {
            eventHandlers[type] = {}
        }

        let key = 0

        while (eventHandlers[type][key]) {
            key += 1
        }

        eventHandlers[type][key] = handler

        this.unsubscribe = () => delete eventHandlers[type][key]

        return this
    }

    return {
        getState,
        getStateAt,
        emit,
        update,
        updateAt,
        subscribe,
    }
}

export default createStore
