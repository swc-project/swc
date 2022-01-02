export function test(list) {
    let cur = list.findIndex(p => p == 1);
    if (!~cur) {
        cur = list.findIndex(p => p !== 0);
    }
    for (const val of list) cur += val.value;
    return cur;
}