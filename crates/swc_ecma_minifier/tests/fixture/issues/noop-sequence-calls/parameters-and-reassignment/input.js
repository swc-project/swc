(() => {
    const events = [];

    function defaulted(value = events.push("default")) {}
    function destructured({ value }) {}
    function reassigned() {}

    function defaults() {
        return defaulted(), defaulted(), events.slice();
    }

    function destructuring() {
        try {
            return destructured(), "missed exception";
        } catch (error) {
            return error.name;
        }
    }

    function replace() {
        reassigned = () => events.push("reassigned");
    }

    function invoke() {
        return reassigned(), reassigned(), events.slice();
    }

    globalThis.sequenceParameters = { defaults, destructuring, replace, invoke };
})();

console.log(JSON.stringify(globalThis.sequenceParameters.defaults()));
console.log(globalThis.sequenceParameters.destructuring());
globalThis.sequenceParameters.replace();
console.log(JSON.stringify(globalThis.sequenceParameters.invoke()));
