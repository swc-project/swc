export var _path = function (dir, file, type, nomin) {
    var path = dir + '/' + file;
    if (!nomin) {
        path += '-min';
    }
    path += '.' + (type || CSS);

    return path;
};