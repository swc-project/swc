const value = 100;
(function(First) {
    First.value = 1;
    class Box {
        get() {
            return First.value;
        }
    }
    First.Box = Box;
    function read(value) {
        return value + First.value;
    }
    First.read = read;
    First.object = {
        value: First.value
    };
    (function(Child) {
        Child.value = 3;
        Child.total = Child.value + First.value;
        function read(value) {
            return value + First.value;
        }
        Child.read = read;
    })(First.Child || (First.Child = {}));
})(First || (First = {}));
(function(Second) {
    Second.value = 2;
    class Box {
        get() {
            return Second.value;
        }
    }
    Second.Box = Box;
    Second.object = {
        value: Second.value
    };
})(Second || (Second = {}));
(function(First) {
    First.previous = First.value + new First.Box().get();
    First.fromChild = First.Child.total;
})(First || (First = {}));
function read(value) {
    return value + First.value + Second.value;
}
const object = {
    value
};
console.log(value, read(4), First.read(5), First.previous, First.fromChild, First.object.value, Second.object.value, new Second.Box().get(), First.Child.read(5), object.value);
var First, Second;
