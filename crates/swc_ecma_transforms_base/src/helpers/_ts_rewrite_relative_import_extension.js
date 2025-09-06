function _ts_rewrite_relative_import_extension(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}
