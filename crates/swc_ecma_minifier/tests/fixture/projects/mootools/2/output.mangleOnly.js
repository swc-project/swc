var n = (this.Hash = new Type("Hash", function(n) {
    if (typeOf(n) == "hash") n = Object.clone(n.getClean());
    for(var i in n)this[i] = n[i];
    return this;
}));
