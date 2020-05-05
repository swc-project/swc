class Unbounded<T> {
    foo(x: T[keyof T]) {
        let y: {} | undefined | null = x;
    }
}
