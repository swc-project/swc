function labels(arr, target) {
    const visited = [];
    first: second: third: for (const item of arr) {
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
        visited.push(() => item);
    }
    return visited.map(fn => fn());
}

console.log(JSON.stringify([0, 1, 2].map(target => labels([0, 1, 2, 3, 4], target))));

const visited = [];
first: second: third: for (const item of [0, 1, 2]) {
    if (item === 1) continue first;
    visited.push(item);
}
first: second: third: for (const item of [3, 4, 5]) {
    if (item === 4) break second;
    visited.push(item);
}
console.log(JSON.stringify(visited));
