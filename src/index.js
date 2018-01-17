import cloneDeep from 'lodash.cloneDeep'

const createStore = function ({ initialStore }) {
    let store = initialStore || {}

    const eventHandlers = {}

    function getStore(path) {
        if (path) {
            return path.reduce((node, key) => node[key], cloneDeep(store))
        }

        return cloneDeep(store)
    }

    function update({ eventName, data, path }) {
        let node = cloneDeep(store)
        let i = 0

        for (i; i < path.length - 1; i += 1) {
            const key = path[i]

            if (!hasOwnProperty.call(node, key)) {
                node[key] = {}
            }

            node = node[key]
        }

        if (path) {
            node[path[i]] = cloneDeep(data)
        } else {
            store = cloneDeep(data)
        }

        Object.values(eventHandlers[eventName]).forEach(handler => handler())
    }

    function subscribe({ eventName, handler }) {
        eventHandlers[eventName].push(handler)

        if (!eventHandlers[eventName]) {
            eventHandlers[eventName] = {}
        }

        let key = 0

        while (eventHandlers[eventName][key]) {
            key += 1
        }

        eventHandlers[eventName][key] = handler

        this.unsubscribe = function () {
            delete eventHandlers[eventName][key]
        }

        return this
    }

    return {
        getStore,
        update,
        subscribe,
    }
}

export default createStore
