import cloneDeep from 'lodash.cloneDeep'

const createStore = function ({ initialState }) {
    let store = initialState || {}

    const eventHandlers = {}

    const getState = () => cloneDeep(store)
    
    const getStateAt = (path) => path.reduce((node, key) => node[key], cloneDeep(store))
    
    const trigger = (type) =>
        Object.values(eventHandlers[type]).forEach(handler => handler({state: getState(), getStateAt}))
    
    const update = (type, payload) => {
        store = cloneDeep(payload)

        Object.values(eventHandlers[type]).forEach(handler => handler({state: getState(), getStateAt}))
    }

    const updateAt = (path, type, payload) => {
        if (!Array.isArray(path) && path.some(key => typeof key !== 'string')) {
            throw Error('path must be an array of strings. Path received: ' + path)
        }

        let node = cloneDeep(store)
        let i = 0

        for (i; i < path.length - 1; i += 1) {
            if (!hasOwnProperty.call(node, path[i])) {
                node[path[i]] = {}
            }

            node = node[path[i]]
        }

        node[path[i]] = cloneDeep(payload)

        Object.values(eventHandlers[type]).forEach(handler => handler({state: getState(), getStateAt}))
    }

    const subscribe = (type, handler) => {
        eventHandlers[type].push(handler)

        if (!eventHandlers[type]) {
            eventHandlers[type] = {}
        }

        let key = 0

        while (eventHandlers[type][key]) {
            key += 1
        }

        eventHandlers[type][key] = handler

        this.unsubscribe = () => delete eventHandlers[type][key]
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
