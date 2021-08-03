_.contains = _.include = function(obj, target) {
    return null != obj && (nativeIndexOf && obj.indexOf === nativeIndexOf ? -1 != obj.indexOf(target) : any(obj, function(value) {
        return value === target;
    }));
};
