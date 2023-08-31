import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
export var UpdateUserDto = /*#__PURE__*/ function(_PartialType) {
    "use strict";
    _inherits(UpdateUserDto, _PartialType);
    var _super = _create_super(UpdateUserDto);
    function UpdateUserDto() {
        _class_call_check(this, UpdateUserDto);
        return _super.apply(this, arguments);
    }
    return UpdateUserDto;
}(PartialType(CreateUserDto));
