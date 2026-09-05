"use strict";
const receiver = {
    read: function() {
        return this === receiver ? "bound call" : "unbound call";
    },
    tag: function() {
        return this === receiver ? "bound tag" : "unbound tag";
    }
};
console.log(({
    get: ()=>receiver.read
}).get()()), console.log(({
    get: ()=>receiver.read
}).get()?.()), console.log(({
    get: ()=>receiver.tag
}).get()`template`);
