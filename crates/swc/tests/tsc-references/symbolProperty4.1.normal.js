//// [symbolProperty4.ts]
var x = {
    [Symbol()]: 0,
    [Symbol()] () {},
    get [Symbol()] () {
        return 0;
    }
};
