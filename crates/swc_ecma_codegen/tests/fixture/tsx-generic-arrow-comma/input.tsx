const identity = <T,>(x: T) => x;
const untyped = <T,>(x) => x;
const returning = <T,>(x: T): T => x;
const constant = <const T,>(x: T) => x;
const asyncIdentity = async <T,>(x: T) => x;
const asyncUntyped = async <T,>(x) => x;
const commented = <T /* parameter */,>(x: T) => x;
const constrained = <T extends unknown>(x: T) => x;
const defaulted = <T = unknown>(x: T) => x;
const multiple = <T, U>(x: T, y: U) => [x, y];
function regular<T>(x: T): T {
    return x;
}
interface Box<T> { value: T }
