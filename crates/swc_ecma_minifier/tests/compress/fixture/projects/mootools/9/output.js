var newClass = (function() {
    if (reset(this), newClass.$prototyping) return this;
    this.$caller = null;
    var value = this.initialize ? this.initialize.apply(this, arguments) : this;
    return this.$caller = this.caller = null, value;
}).extend(this).implement(params);
