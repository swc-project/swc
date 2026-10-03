// A default parameter captures the receiver where the arrow is created.
const receiver = {
    value: 1
};
(function() {
    let f = async (value = this)=>value;
    return function() {
        return f();
    };
}).call(receiver)().then((value)=>console.log(value === receiver), (error)=>console.log(error.name));
