for (let __proto__ = 0, read = () => __proto__;;) {
    __proto__ = class { static value = this.name };
    console.log(__proto__.name, __proto__.value, read());
    break;
}
