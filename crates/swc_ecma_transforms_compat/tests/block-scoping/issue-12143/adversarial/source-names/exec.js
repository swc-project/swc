for (let i = () => 0, read = () => i;;) {
    console.log(i.name, read().name);
    i = function () {};
    console.log(i.name, read()());
    break;
}
for (let __proto__ = () => 1, read = () => __proto__;;) {
    __proto__ = function () {};
    console.log(__proto__.name, read()());
    break;
}
