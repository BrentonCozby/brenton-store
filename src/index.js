const cloneDeep = require('lodash.clonedeep')

const isArray = (arg) => Object.prototype.toString.call(arg) === '[object Array]'

const createStore = function (initialState) {
    let state = initialState || {}

    const eventHandlers = {}

    const getState = () => cloneDeep(state)

    const getStateAt = (path) => {
        if (typeof path !== 'object' ||
            !isArray(path) ||
            path.length === 0 ||
            path.some(key => typeof key !== 'string')
        ) {
            throw new TypeError(`"path" must be a non-empty array of strings. "path" received: ${String(path)}`)
        }

        return path.reduce((node, key) => node[key], getState())
    }

    const emit = (type) => {
        if (typeof type !== 'string') {
            throw new TypeError(`"type" must be a string. "type" received: ${String(type)}`)
        }

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler(getState(), getState()))
        }
    }

    const update = (type, payload) => {
        if (typeof type !== 'string') {
            throw new TypeError(`"type" must be a string. "type" received: ${String(type)}`)
        }

        const prevState = getState()
        const nextState = cloneDeep(payload)

        state = nextState

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler(nextState, prevState))
        }
    }

    const updateAt = (path, type, payload) => {
        if (typeof path !== 'object' ||
            !isArray(path) ||
            path.length === 0 ||
            path.some(key => typeof key !== 'string')
        ) {
            throw new TypeError(`"path" must be a non-empty array of strings. "path" received: ${String(path)}`)
        }

        if (typeof type !== 'string') {
            throw new TypeError(`"type" must be a string. "type" received: ${String(type)}`)
        }

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
        if (typeof type !== 'string') {
            throw new TypeError(`"type" must be a string. "type" received: ${String(type)}`)
        }

        if (typeof handler !== 'function') {
            throw new TypeError(`"handler" must be a function. "handler" received: ${String(handler)}`)
        }

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
