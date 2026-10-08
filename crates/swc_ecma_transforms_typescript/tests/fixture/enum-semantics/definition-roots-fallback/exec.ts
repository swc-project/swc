function fromFunction() {
    const enum Local { A = 11 }
    return Local.A;
}
class Holder {
    read() {
        enum Local { A = 13 }
        return Local.A;
    }
}
const result = [fromFunction(), new Holder().read()];

expect(result).toEqual([11, 13]);
