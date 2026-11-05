(()=>{
    let events = [];
    function defaulted(value = events.push("default")) {}
    function reassigned() {}
    globalThis.sequenceParameters = {
        defaults: function() {
            return defaulted(), defaulted(), events.slice();
        },
        destructuring: function() {
            try {
                return function({ value }) {}(), "missed exception";
            } catch (error) {
                return error.name;
            }
        },
        replace: function() {
            reassigned = ()=>events.push("reassigned");
        },
        invoke: function() {
            return reassigned(), reassigned(), events.slice();
        }
    };
})(), console.log(JSON.stringify(globalThis.sequenceParameters.defaults())), console.log(globalThis.sequenceParameters.destructuring()), globalThis.sequenceParameters.replace(), console.log(JSON.stringify(globalThis.sequenceParameters.invoke()));
