//// [inferringClassMembersFromAssignments6.js]
function Foonly() {
    var self = this;
    self.x = 1, self.m = function() {
        console.log(self.x);
    };
}
Foonly.prototype.mreal = function() {
    this.y = 2;
};
var foo = new Foonly();
foo.x, foo.y, foo.m();
