var i = function() {
    reset(this);
    if (i.$prototyping) return this;
    this.$caller = null;
    var t = this.initialize ? this.initialize.apply(this, arguments) : this;
    this.$caller = this.caller = null;
    return t;
}.extend(this).implement(params);
