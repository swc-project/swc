async function nestedLabels(stream) {
    const visited = [];
    outer: second: for await (const item of stream) {
        if (item === 1) continue outer;
        if (item === 2) break second;
        visited.push(item);
    }
    return visited;
}

async function singleLabel(stream) {
    loop: for await (const item of stream) {
        if (item === 1) continue loop;
        if (item === 2) break loop;
    }
}

async function* generatorLabels(stream) {
    first: second: third: for await (const item of stream) {
        if (item === 1) continue first;
        if (item === 2) continue second;
        if (item === 3) continue third;
        if (item === 4) break first;
        if (item === 5) break second;
        if (item === 6) break third;
        yield item;
    }
}
