for (var i = 0, read = () => i; i < 1; i++) {
    console.log(read());
}
for (const object = {}, read = () => object; ;) {
    console.log(read());
    break;
}
for (let i = 0, read = (i) => i; i < 1; i++) {
    console.log(read(i));
}
