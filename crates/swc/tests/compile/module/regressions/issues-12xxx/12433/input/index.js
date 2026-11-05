async function nestedLabels(arr) {
    first:
    second:
    third:
    for (const item of arr) {
        if (true) continue first;
        if (true) break first;
        if (true) continue second;
        if (true) break second;
        if (true) continue third;
        if (true) break third;
    }
}

function nestedLoops(arr) {
    block: {
        outer: middle: inner: for (const item of arr) {
            nested: last: for (const value of arr) {
                if (value === 1) continue outer;
                if (value === 2) break middle;
                if (value === 3) break block;
                continue nested;
            }
        }
    }
}
