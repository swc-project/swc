let feature;
globalThis.a = (value) => {
  if (feature && value.enabled) value.result = feature.run(value);
  return value;
};
globalThis.b = (value) => feature?.run(value);