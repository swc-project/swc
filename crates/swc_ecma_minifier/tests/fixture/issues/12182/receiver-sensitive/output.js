function readExplicit() {
    return this.value;
}
console.log(({
    value: "variable receiver",
    read: function() {
        return this.value;
    }
}).read()), console.log(({
    value: "direct receiver",
    read: function() {
        return this.value;
    }
}).read()), console.log(({
    value: "shorthand receiver",
    read: function() {
        return this.value;
    }
}).read()), console.log(({
    value: "explicit receiver",
    read: readExplicit
}).read()), console.log(({
    value: "direct identifier receiver",
    read: readExplicit
}).read()), console.log(({
    value: "parameter receiver",
    read: function(value = this.value) {
        return value;
    }
}).read()), console.log(({
    value: "direct parameter receiver",
    read: function(value = this.value) {
        return value;
    }
}).read()), console.log(({
    value: "captured receiver",
    read: function() {
        return this.value;
    }
}).read());
