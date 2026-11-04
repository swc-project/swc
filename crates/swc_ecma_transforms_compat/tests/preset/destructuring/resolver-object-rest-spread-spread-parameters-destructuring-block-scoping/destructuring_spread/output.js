function isSorted(param) {
    var _param = _to_array(param), x = _param[0], y = _param[1], wow = _param.slice(2);
    if (!zs.length) return true;
    if (y > x) return isSorted(zs);
    return false;
}
