
export function foo() {
    eval();
    return function useSyncExternalStore$2(e, n, t) {
        let a = n(); // any variable expect `e` 
        return a;
    }
}

export function bar() {

    const shouldBeMangled = Math.random() > 0.5 ? 1 : 2;
    console.log(shouldBeMangled)
    console.log(shouldBeMangled)
    console.log(shouldBeMangled)
    console.log(shouldBeMangled)
    console.log(shouldBeMangled)
    console.log(shouldBeMangled)
}
