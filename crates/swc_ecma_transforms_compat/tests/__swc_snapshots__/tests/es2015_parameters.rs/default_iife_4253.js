var Ref = function Ref() {
    "use strict";
    var id = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : ++Ref.nextID;
    _class_call_check(this, Ref);
    this.id = id;
};
Ref.nextID = 0;
