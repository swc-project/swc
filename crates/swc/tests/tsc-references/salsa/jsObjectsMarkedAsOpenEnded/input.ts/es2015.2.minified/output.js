var variable = {
};
variable.a = 0;
class C {
    constructor(){
        this.initializedMember = {
        }, this.member = {
        }, this.member.a = 0;
    }
}
var obj = {
    property: {
    }
};
obj.property.a = 0;
var arr = [
    {
    }
];
variable.a = 1, new C().member.a = 1, new C().initializedMember.a = 1, obj.property.a = 1, arr[0].a = 1, ({
}).a = 1;
