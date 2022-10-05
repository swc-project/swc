export function source() {
    let c = 0, a = 1;
    c += a, a += 5;
    let b = c;
    console.log(a, b, c);
}
