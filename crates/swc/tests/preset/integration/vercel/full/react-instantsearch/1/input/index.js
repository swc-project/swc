export default function createStore(initialState) {
    let state = initialState;
    const listeners = [];
    return {
        getState() {
            return state;
        },
        setState(nextState) {
            state = nextState;
            listeners.forEach((listener) => listener());
        },
        subscribe(listener) {
            listeners.push(listener);
            return function unsubscribe() {
                listeners.splice(listeners.indexOf(listener), 1);
            };
        },
    };
}
