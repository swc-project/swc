const { value = class {
    static accessor stored = record();
} } = {};

const { privateAutoAccessorEnvironmentValue = class {
    accessor #privateAutoAccessor;
    static value = keep((value) => value.#privateAutoAccessor);
} } = {};

const { instanceAutoAccessorValue = class {
    static value = new (class {
        accessor value = record();
    })();
} } = {};
