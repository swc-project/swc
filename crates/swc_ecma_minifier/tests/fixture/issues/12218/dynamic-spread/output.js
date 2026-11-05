function run(values) {
    return function(a, b, c) {
        return [
            a,
            c
        ];
    }(...values, 3);
}
const events = [];
const values = {
    [Symbol.iterator] () {
        events.push("iterator");
        let index = 0;
        return {
            next () {
                events.push(`next:${index}`);
                if (index < 2) return {
                    value: ++index,
                    done: false
                };
                return {
                    done: true
                };
            }
        };
    }
};
const result = run(values);
console.log(events.join(","), JSON.stringify(result));
