(function() {
    /**
     * @class Person
     */
    function Person(name) {}

    Person.prototype = Object.create(null, /** @lends Person.prototype */ {
        /** Speak a message. */
        say: function(message) {
            return this.name + " says: " + message;
        }
    });

    this.Person = Person;
}).call(this);
