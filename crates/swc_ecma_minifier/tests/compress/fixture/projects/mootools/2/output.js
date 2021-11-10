var Hash = this.Hash = new Type("Hash", function(object) {
    for(var key in "hash" == typeOf(object) && (object = Object.clone(object.getClean())), object)this[key] = object[key];
    return this;
});
