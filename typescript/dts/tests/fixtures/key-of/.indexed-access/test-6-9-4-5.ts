function f74(func: <T, U, K extends keyof (T | U) >(x: T, y: U, k: K) => (T | U)[K]) {
    let a = func({ a: 1, b: "hello" }, { a: 2, b: true }, 'a');  // number
    let b = func({ a: 1, b: "hello" }, { a: 2, b: true }, 'b');  // string | boolean

    return { a, b }
}
