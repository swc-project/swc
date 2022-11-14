export default class Demo {
    static encode(value) {
        const ranges = [];
        let range = [], retrString = A.encode(value), bitField = '';
        return value.forEach((curValue, i)=>{
            bitField += B.encode(curValue);
            range.push(i);
            ranges.push(range);
        }), retrString += '.' + C.encode(ranges);
    }
}
console.log(Deno.encode());
