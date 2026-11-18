declare hook foo(): void;
declare export hook bar(): void;
declare export default hook baz(): void;
export hook bing() {
    return 42;
}
export default hook bong() {
    return 42;
}
