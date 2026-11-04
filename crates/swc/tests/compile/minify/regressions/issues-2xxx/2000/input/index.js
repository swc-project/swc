export function testme(...list) {
    if (/^toto.+/.test(list.join(""))) global.other(true);
}
