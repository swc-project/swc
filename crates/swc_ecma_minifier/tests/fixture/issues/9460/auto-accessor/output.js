const { value = class {
    static accessor stored = record();
} } = {}, { privateAutoAccessorEnvironmentValue = class {
    accessor #privateAutoAccessor;
    static value = keep((value)=>value.#privateAutoAccessor);
} } = {}, { instanceAutoAccessorValue = new class {
    accessor value = record();
}() } = {};
