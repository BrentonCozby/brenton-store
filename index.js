const cloneDeep = require('lodash.clonedeep')

const createStore = function (initialState) {
    let store = initialState || {}

    const eventHandlers = {}

    const getState = () => cloneDeep(store)

    const getStateAt = (path) => path.reduce((node, key) => node[key], getState())

    const trigger = (type) => {
        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler({ state: getState() }))
        }
    }

    const update = (type, payload) => {
        const prevState = getState()
        const nextState = cloneDeep(payload)

        store = nextState

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler({
                nextState,
                prevState,
            }))
        }
    }

    const updateAt = (path, type, payload) => {
        if (!Array.isArray(path) && path.some(key => typeof key !== 'string')) {
            throw new TypeError(`"path" must be an array of strings. "path" received: ${path}`)
        }

        const prevState = getState()
        const newStore = getState()

        const lastPathKey = path[path.length - 1]
        const targetNode = path.reduce((nodePointer, pathKey, i) => {
            if (!hasOwnProperty.call(nodePointer, pathKey)) {
                nodePointer[pathKey] = {} // eslint-disable-line no-param-reassign
            }

            if (i === path.length - 2) {
                return nodePointer
            }

            return nodePointer[pathKey]
        }, newStore)

        targetNode[lastPathKey] = cloneDeep(payload)

        store = newStore

        if (eventHandlers[type]) {
            Object.values(eventHandlers[type]).forEach(handler => handler({
                nextState: getState(),
                prevState,
            }))
        }
    }

    const subscribe = function (type, handler) {
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
        trigger,
        update,
        updateAt,
        subscribe,
    }
}

export default createStore
