function iterable(values, closed) {
    return {
        [Symbol.iterator]() {
            let index = 0;
            return {
                next() {
                    return { value: values[index++], done: index > values.length };
                },
                return() {
                    closed.push("closed");
                    return { done: true };
                }
            };
        }
    };
}

function labels(target, stop) {
    const closed = [];
    const visited = [];
    const values = iterable([0, 1, 2, 3, 4], closed);
    first: second: third: for (const item of values) {
        if (item === 1) {
            if (target === 0) continue first;
            if (target === 1) continue second;
            continue third;
        }
        if (stop && item === 3) {
            if (target === 0) break first;
            if (target === 1) break second;
            break third;
        }
        visited.push(() => item);
    }
    return [visited.map(fn => fn()), closed.length];
}

for (const target of [0, 1, 2]) {
    console.log(JSON.stringify(labels(target, false)));
    console.log(JSON.stringify(labels(target, true)));
}

function nested(stop) {
    const outerClosed = [];
    const innerClosed = [];
    const visited = [];
    const outerValues = iterable(["a", "b"], outerClosed);
    outer: middle: last: for (const item of outerValues) {
        const innerValues = iterable([0, 1, 2], innerClosed);
        inner: second: for (const value of innerValues) {
            if (value === 1) {
                if (stop) break middle;
                continue outer;
            }
            visited.push(item + value);
        }
    }
    return [visited, outerClosed.length, innerClosed.length];
}
console.log(JSON.stringify(nested(false)));
console.log(JSON.stringify(nested(true)));

const closed = [];
const values = iterable([0, 1, 2, 3], closed);
const visited = [];
block: {
    first: second: third: for (const item of values) {
        if (item === 1) break block;
        visited.push(item);
    }
    throw new Error("The block label must remain outside the loop.");
}
single: for (const item of values) {
    if (item === 1) continue single;
    if (item === 2) break single;
    visited.push(item);
}
console.log(JSON.stringify([visited, closed.length]));
