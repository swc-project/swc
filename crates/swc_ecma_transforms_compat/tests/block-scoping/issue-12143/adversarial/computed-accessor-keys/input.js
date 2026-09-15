for (let i = 0, object = {
    get [i]() {},
    set [i](value) {}
}; i < 1; i++) {
    console.log(object);
}
