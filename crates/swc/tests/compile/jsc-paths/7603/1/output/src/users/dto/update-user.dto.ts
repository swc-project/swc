import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
export var UpdateUserDto = /*#__PURE__*/ function(_PartialType) {
    "use strict";
    _inherits(UpdateUserDto, _PartialType);
    function UpdateUserDto() {
        _class_call_check(this, UpdateUserDto);
        return _call_super(this, UpdateUserDto, arguments);
    }
    return UpdateUserDto;
}(PartialType(CreateUserDto));
