import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
import { Body, Controller, Delete, Param, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { COMMENT_CONTROLLER_ROUTE, COMMENT_DELETE_ENDPOINT, COMMENT_UPDATE_ENDPOINT } from "@server/constants/controllers";
import { MongooseClassSerializerInterceptor } from "@server/interceptors/MongooseClassSerializerInterceptor";
import { Comment } from "@server/comment/schemas/CommentSchema";
import { CommentService } from "@server/comment/CommentService";
import { JwtAuthGuard } from "@server/auth/guards/JwtAuthGuard";
import { User } from "@server/decorators/UserDecorator";
import { User as UserType } from "@server/user/schemas/UserSchema";
import { UpdateCommentDto } from "@server/comment/dto/UpdateCommentDto";
export var CommentController = /*#__PURE__*/ function() {
    "use strict";
    function CommentController(commentService) {
        _class_call_check(this, CommentController);
        this.commentService = commentService;
    }
    var _proto = CommentController.prototype;
    _proto.updateComment = function updateComment(id, updateCommentDto, user) {
        return this.commentService.update(id, updateCommentDto, user.id);
    };
    _proto.deleteComment = function deleteComment(id, user) {
        return this.commentService.delete(id, user.id);
    };
    return CommentController;
}();
_ts_decorate([
    UseGuards(JwtAuthGuard),
    Put(COMMENT_UPDATE_ENDPOINT),
    _ts_param(0, Param("id")),
    _ts_param(1, Body()),
    _ts_param(2, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UpdateCommentDto === "undefined" ? Object : UpdateCommentDto,
        typeof UserType === "undefined" ? Object : UserType
    ])
], CommentController.prototype, "updateComment", null);
_ts_decorate([
    UseGuards(JwtAuthGuard),
    Delete(COMMENT_DELETE_ENDPOINT),
    _ts_param(0, Param("id")),
    _ts_param(1, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UserType === "undefined" ? Object : UserType
    ])
], CommentController.prototype, "deleteComment", null);
CommentController = _ts_decorate([
    Controller(COMMENT_CONTROLLER_ROUTE),
    UseInterceptors(MongooseClassSerializerInterceptor(Comment)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CommentService === "undefined" ? Object : CommentService
    ])
], CommentController);
