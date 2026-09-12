for (let i = 0, read = () => i; (i = function () {}).name === "i"; i = () => i) {
    i = class {};
    [i = function () {}] = [];
    ({ i = () => i } = {});
    i ||= function () {};
    i = function explicit() {};
    break;
}
