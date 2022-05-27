var a = (this.Hash = new Type("Hash", function(a) {
    if (typeOf(a) == "hash") a = Object.clone(a.getClean());
    for(var b in a)this[b] = a[b];
    return this;
}));
