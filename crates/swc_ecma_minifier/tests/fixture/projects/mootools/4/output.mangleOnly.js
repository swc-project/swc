const a = {
    flatten: function() {
        var a = [];
        for(var b = 0, c = this.length; b < c; b++){
            var d = typeOf(this[b]);
            if (d == "null") continue;
            a = a.concat(d == "array" || d == "collection" || d == "arguments" || instanceOf(this[b], Array) ? Array.flatten(this[b]) : this[b]);
        }
        return a;
    }
};
