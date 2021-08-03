export var _path = function(dir, file, type, nomin) {
    var path = dir + "/" + file;
    return nomin || (path += "-min"), path += "." + (type || CSS);
};
