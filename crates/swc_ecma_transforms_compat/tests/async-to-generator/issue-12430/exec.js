function stream(closed, useAsync) {
    const values = [0, 1, 2, 3, 4];
    let index = 0;
    const iterator = {
        next() {
            return { value: values[index++], done: index > values.length };
        },
        return() {
            closed.push("closed");
            return { done: true };
        }
    };
    return useAsync
        ? { [Symbol.asyncIterator]() { return iterator; } }
        : { [Symbol.iterator]() { return iterator; } };
}

async function labels(values, target) {
    const visited = [];
    first: second: third: for await (const item of values) {
        if (item === 1) {
            if (target === 0) continue first;
            if (target === 1) continue second;
            continue third;
        }
        if (item === 3) {
            if (target === 0) break first;
            if (target === 1) break second;
            break third;
        }
        visited.push(item);
    }
    return visited;
}

const arrow = async values => {
    const visited = [];
    outer: inner: for await (const item of values) {
        if (item === 1) continue outer;
        if (item === 3) break inner;
        visited.push(item);
    }
    return visited;
};

async function single(values) {
    const visited = [];
    loop: for await (const item of values) {
        if (item === 1) continue loop;
        if (item === 3) break loop;
        visited.push(item);
    }
    return visited;
}

async function* generator(values, target) {
    first: second: third: for await (const item of values) {
        if (item === 1) {
            if (target === 0) continue first;
            if (target === 1) continue second;
            continue third;
        }
        if (item === 3) {
            if (target === 0) break first;
            if (target === 1) break second;
            break third;
        }
        yield item;
    }
}

async function collect(iterator) {
    const visited = [];
    while (true) {
        const step = await iterator.next();
        if (step.done) return visited;
        visited.push(step.value);
    }
}

async function nested() {
    const outerClosed = [];
    const innerClosed = [];
    const visited = [];
    outer: middle: last: for await (const item of stream(outerClosed, true)) {
        inner: second: for await (const value of stream(innerClosed, true)) {
            if (value === 1) {
                if (item === 2) break middle;
                continue outer;
            }
            visited.push(item + ":" + value);
        }
    }
    return [visited, outerClosed.length, innerClosed.length];
}

(async () => {
    for (const useAsync of [false, true]) {
        for (const target of [0, 1, 2]) {
            const closed = [];
            const visited = await labels(stream(closed, useAsync), target);
            console.log(JSON.stringify([visited, closed.length]));

            const generatorClosed = [];
            const yielded = await collect(generator(stream(generatorClosed, useAsync), target));
            console.log(JSON.stringify([yielded, generatorClosed.length]));
        }
        for (const run of [arrow, single]) {
            const closed = [];
            console.log(JSON.stringify([await run(stream(closed, useAsync)), closed.length]));
        }
    }
    console.log(JSON.stringify(await nested()));
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
