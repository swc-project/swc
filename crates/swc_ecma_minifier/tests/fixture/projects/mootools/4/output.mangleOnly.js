const a = {
    flatten: function() {
        var c = [];
        for(var a = 0, d = this.length; a < d; a++){
            var b = typeOf(this[a]);
            if (b == "null") continue;
            c = c.concat(b == "array" || b == "collection" || b == "arguments" || instanceOf(this[a], Array) ? Array.flatten(this[a]) : this[a]);
        }
        return c;
    }
};
