for (let i = 0, read = () => i;;) {
    let _i = function () { return i; };
    console.log(_i.name, _i(), read());
    break;
}
for (let j = 0, read = () => j;;) {
    let _j = () => j;
    console.log(_j.name, _j(), read());
    break;
}
