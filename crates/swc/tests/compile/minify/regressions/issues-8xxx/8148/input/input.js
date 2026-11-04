function _toBeMocked() {
    return "I am the original function";
}

export let toBeMocked = _toBeMocked

export const mock = {
    get toBeMocked() { return toBeMocked; },
    set toBeMocked(mock) { toBeMocked = mock; }
}