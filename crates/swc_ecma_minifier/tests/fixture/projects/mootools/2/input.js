var Hash = (this.Hash = new Type("Hash", function (object) {
    if (typeOf(object) == "hash") object = Object.clone(object.getClean());
    for (var key in object) this[key] = object[key];
    return this;
}));
