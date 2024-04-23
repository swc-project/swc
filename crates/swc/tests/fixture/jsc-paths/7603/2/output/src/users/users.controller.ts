import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _ts_decorate } from "@swc/helpers/_/_ts_decorate";
import { _ as _ts_param } from "@swc/helpers/_/_ts_param";
import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
export var UsersController = /*#__PURE__*/ function() {
    "use strict";
    function UsersController(usersService) {
        _class_call_check(this, UsersController);
        _define_property(this, "usersService", void 0);
        this.usersService = usersService;
    }
    _create_class(UsersController, [
        {
            key: "create",
            value: function create(createUserDto) {
                return this.usersService.create(createUserDto);
            }
        },
        {
            key: "findAll",
            value: function findAll() {
                return this.usersService.findAll();
            }
        },
        {
            key: "findOne",
            value: function findOne(id) {
                return this.usersService.findOne(+id);
            }
        },
        {
            key: "update",
            value: function update(id, updateUserDto) {
                return this.usersService.update(+id, updateUserDto);
            }
        },
        {
            key: "remove",
            value: function remove(id) {
                return this.usersService.remove(+id);
            }
        }
    ]);
    return UsersController;
}();
_ts_decorate([
    Post(),
    _ts_param(0, Body())
], UsersController.prototype, "create", null);
_ts_decorate([
    Get()
], UsersController.prototype, "findAll", null);
_ts_decorate([
    Get(':id'),
    _ts_param(0, Param('id'))
], UsersController.prototype, "findOne", null);
_ts_decorate([
    Patch(':id'),
    _ts_param(0, Param('id')),
    _ts_param(1, Body())
], UsersController.prototype, "update", null);
_ts_decorate([
    Delete(':id'),
    _ts_param(0, Param('id'))
], UsersController.prototype, "remove", null);
UsersController = _ts_decorate([
    Controller('users')
], UsersController);
