const obj = {
    flatten: function() {
        for(var array = [], i = 0, l = this.length; i < l; i++){
            var type = typeOf(this[i]);
            "null" != type && (array = array.concat("array" == type || "collection" == type || "arguments" == type || instanceOf(this[i], Array) ? Array.flatten(this[i]) : this[i]));
        }
        return array;
    }
};
