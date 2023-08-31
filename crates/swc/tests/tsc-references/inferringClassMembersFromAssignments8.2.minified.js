//// [inferringClassMembersFromAssignments8.ts]
// no inference in TS files, even for `this` aliases:
new function() {
    this.swap = function() {};
}();
