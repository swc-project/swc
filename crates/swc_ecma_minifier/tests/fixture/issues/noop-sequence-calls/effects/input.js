(() => {
    function noop() {}

    function run() {
        const events = [];
        let callbackCalls = 0;
        function factory(name) {
            events.push(name);
            return () => callbackCalls++;
        }
        const iterable = {
            [Symbol.iterator]() {
                events.push("iterator");
                let next = 0;
                return {
                    next() {
                        events.push("next-" + next);
                        return { value: next, done: next++ === 1 };
                    },
                };
            },
        };

        return (
            noop(() => callbackCalls++),
            noop(factory("first"), factory("second")),
            noop(factory("before-spread"), ...iterable, factory("after-spread")),
            [events, callbackCalls]
        );
    }

    function spreadFailure() {
        try {
            return noop(...null), "missed exception";
        } catch (error) {
            return error.name;
        }
    }

    globalThis.sequenceEffects = { run, spreadFailure };
})();

console.log(JSON.stringify(globalThis.sequenceEffects.run()));
console.log(globalThis.sequenceEffects.spreadFailure());
