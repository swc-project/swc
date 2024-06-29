function f() {
    let [{ x: x }] = [
        {
            x: 1,
            y: 2
        }
    ];
    return x;
}
"module evaluation";
export { f };
