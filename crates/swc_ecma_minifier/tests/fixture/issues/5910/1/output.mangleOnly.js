export function fn1() {
    let n = 0;
    function o() {
        const o = n;
        n += 1;
        console.log(o, n);
    }
    return o;
}
