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
}).read());
