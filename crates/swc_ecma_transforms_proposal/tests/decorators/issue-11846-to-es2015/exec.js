let effectRuns = 0;
let propertyRuns = 0;

function effect(_, context) {
    context.addInitializer(function() {
        const fn = context.access.get(this);
        expect(typeof fn).toBe("function");
        fn.call(this);
        effectRuns++;
    });
}

function property(_, context) {
    context.addInitializer(function() {
        propertyRuns++;
    });
    return function(initValue) {
        return initValue;
    };
}

class A {
    @property
    toolset = 1;

    @effect
    #effect = function() {
        expect(this.toolset).toBe(1);
    };

    @effect
    effect = function() {
        expect(this.toolset).toBe(1);
    };
}

new A();

expect(propertyRuns).toBe(1);
expect(effectRuns).toBe(2);
