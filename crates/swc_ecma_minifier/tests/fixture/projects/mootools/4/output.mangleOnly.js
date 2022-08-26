const t = {
    flatten: function() {
        var t = [];
        for(var n = 0, a = this.length; n < a; n++){
            var i = typeOf(this[n]);
            if (i == "null") continue;
            t = t.concat(i == "array" || i == "collection" || i == "arguments" || instanceOf(this[n], Array) ? Array.flatten(this[n]) : this[n]);
        }
        return t;
    }
};
