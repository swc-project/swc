var a = function() {
    reset(this);
    if (a.$prototyping) return this;
    this.$caller = null;
    var b = this.initialize ? this.initialize.apply(this, arguments) : this;
    this.$caller = this.caller = null;
    return b;
}.extend(this).implement(params);
