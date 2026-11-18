function isString(x: mixed): boolean %checks {
  return typeof x === "string";
}

function hasValue(x: mixed): boolean %checks(x != null) {
  return x != null;
}
