const t = {
    flatten: function() {
        var t = [];
        for(var n = 0, r = this.length; n < r; n++){
            var a = typeOf(this[n]);
            if (a == "null") continue;
            t = t.concat(a == "array" || a == "collection" || a == "arguments" || instanceOf(this[n], Array) ? Array.flatten(this[n]) : this[n]);
        }
        return t;
    }
};
