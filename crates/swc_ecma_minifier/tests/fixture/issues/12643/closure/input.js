let transform;
globalThis.process = value =>
    transform ? transform(value) + ":UNREACHABLE_FEATURE_BRANCH" : value;
