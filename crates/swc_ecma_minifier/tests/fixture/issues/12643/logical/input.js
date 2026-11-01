let transform;
globalThis.and = value => transform && transform(value);
globalThis.or = value => transform || value;
