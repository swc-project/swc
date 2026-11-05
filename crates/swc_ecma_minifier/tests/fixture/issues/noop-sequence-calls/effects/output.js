globalThis.sequenceEffects = {
    run: function() {
        let events = [], callbackCalls = 0;
        function factory(name) {
            return events.push(name), ()=>callbackCalls++;
        }
        let iterable = {
            [Symbol.iterator] () {
                events.push("iterator");
                let next = 0;
                return {
                    next: ()=>(events.push("next-" + next), {
                            value: next,
                            done: 1 == next++
                        })
                };
            }
        };
        return factory("first"), factory("second"), [
            factory("before-spread"),
            ...iterable,
            factory("after-spread")
        ], [
            events,
            callbackCalls
        ];
    },
    spreadFailure: function() {
        try {
            return [
                ...null
            ], "missed exception";
        } catch (error) {
            return error.name;
        }
    }
}, console.log(JSON.stringify(globalThis.sequenceEffects.run())), console.log(globalThis.sequenceEffects.spreadFailure());
