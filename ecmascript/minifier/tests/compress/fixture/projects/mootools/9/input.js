var newClass = function () {
    reset(this);
    if (newClass.$prototyping) return this;
    this.$caller = null;
    var value = (this.initialize) ? this.initialize.apply(this, arguments) : this;
    this.$caller = this.caller = null;
    return value;
}.extend(this).implement(params);