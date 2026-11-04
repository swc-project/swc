export default class Demo {
    static encode(value) {
        const ranges = [];
        let range = [];
        let retrString = A.encode(value);
        let bitField = '';
        value.forEach((curValue, i) => {
            bitField += B.encode(curValue);
            range.push(i);
            ranges.push(range);
        });
        retrString += '.';
        retrString += C.encode(ranges);
        return retrString;
    }
}

console.log(Deno.encode())