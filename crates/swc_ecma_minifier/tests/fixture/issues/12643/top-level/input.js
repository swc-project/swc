var transform;
globalThis.process = value => transform ? transform(value) : value;
