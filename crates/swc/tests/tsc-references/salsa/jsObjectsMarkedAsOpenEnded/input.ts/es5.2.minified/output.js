var variable = {
};
variable.a = 0;
var C = function() {
    "use strict";
    !function(instance, Constructor) {
        if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
    }(this, C), this.initializedMember = {
    }, this.member = {
    }, this.member.a = 0;
}, obj = {
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
