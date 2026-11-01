var transform;
globalThis.processor = new class {
    process(value) {
        if (transform) {
            return transform(value);
        }
        return value;
    }
};
