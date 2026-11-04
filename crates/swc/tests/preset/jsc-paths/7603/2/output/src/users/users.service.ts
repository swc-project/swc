import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { Injectable } from "@nestjs/common";
export var UsersService = /*#__PURE__*/ function() {
    "use strict";
    function UsersService() {
        _class_call_check(this, UsersService);
    }
    _create_class(UsersService, [
        {
            key: "create",
            value: function create(createUserDto) {
                return 'This action adds a new user';
            }
        },
        {
            key: "findAll",
            value: function findAll() {
                return "This action returns all users";
            }
        },
        {
            key: "findOne",
            value: function findOne(id) {
                return "This action returns a #".concat(id, " user");
            }
        },
        {
            key: "update",
            value: function update(id, updateUserDto) {
                return "This action updates a #".concat(id, " user");
            }
        },
        {
            key: "remove",
            value: function remove(id) {
                return "This action removes a #".concat(id, " user");
            }
        }
    ]);
    return UsersService;
}();
UsersService = _ts_decorate([
    Injectable()
], UsersService);
