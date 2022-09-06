var e = (this.Hash = new Type("Hash", function(e) {
    if (typeOf(e) == "hash") e = Object.clone(e.getClean());
    for(var t in e)this[t] = e[t];
    return this;
}));
