// @noEmit: true
// @allowJs: true
// @checkJs: true
// @noImplicitAny: true
// @strictNullChecks: true
// @Filename: inferringClassMembersFromAssignments7.js
class C {
    mreal() {
        var self = this;
        self.y = 2;
    }
    constructor(){
        var self = this;
        self.x = 1;
        self.m = function() {
            console.log(self.x);
        };
    }
}
const c = new C();
c.x;
c.y;
c.m();
