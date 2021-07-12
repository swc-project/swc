_.random = function(min, max) {
    return null == max && (max = min, min = 0), min + Math.floor(Math.random() * (max - min + 1));
};
