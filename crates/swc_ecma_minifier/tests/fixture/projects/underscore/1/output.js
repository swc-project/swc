_.contains = _.include = function(obj, target) {
    return null != obj && (nativeIndexOf && obj.indexOf === nativeIndexOf ? obj.indexOf(target) != -1 : any(obj, function(value) {
        return value === target;
    }));
};
