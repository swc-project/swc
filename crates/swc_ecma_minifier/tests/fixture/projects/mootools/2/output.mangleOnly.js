var h = (this.Hash = new Type("Hash", function(h) {
    if (typeOf(h) == "hash") h = Object.clone(h.getClean());
    for(var n in h)this[n] = h[n];
    return this;
}));
