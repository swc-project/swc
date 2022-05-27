export function f() {
    let [{ x: a , y: b , z: c  }] = [
        {
            x: 1,
            y: 2
        }
    ];
    return a;
}
