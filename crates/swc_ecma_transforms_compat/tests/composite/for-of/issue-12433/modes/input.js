function labels(arr) {
    first: second: third: for (const item of arr) {
        if (item === 1) continue first;
        if (item === 2) continue second;
        if (item === 3) continue third;
        if (item === 4) break first;
        if (item === 5) break second;
        if (item === 6) break third;
    }

    first: second: third: for (const item of [1, 2, 3]) {
        if (item === 1) continue first;
        if (item === 2) continue second;
        break third;
    }
}
