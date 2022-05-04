Object.prototype.getTypeof = function () {
    return typeof this;
};

console.log(Symbol().getTypeof());
console.log(typeof Symbol());
