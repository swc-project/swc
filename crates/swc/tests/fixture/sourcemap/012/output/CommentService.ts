import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
import regeneratorRuntime from "regenerator-runtime";
import { Model, Connection as MongooseConnection } from "mongoose";
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel, InjectConnection } from "@nestjs/mongoose";
import { Comment } from "@server/comment/schemas/CommentSchema";
import { Post } from "@server/post/schemas/PostSchema";
export var CommentService = /*#__PURE__*/ function() {
    "use strict";
    function CommentService(commentModel, postModel, connection) {
        _class_call_check(this, CommentService);
        this.commentModel = commentModel;
        this.postModel = postModel;
        this.connection = connection;
    }
    var _proto = CommentService.prototype;
    _proto.getById = function getById(commentId) {
        var _this = this;
        return _async_to_generator(/*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var comment;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _this.commentModel.findById(commentId);
                    case 2:
                        comment = _ctx.sent;
                        if (comment) {
                            _ctx.next = 5;
                            break;
                        }
                        throw new NotFoundException();
                    case 5:
                        return _ctx.abrupt("return", comment.populate("author"));
                    case 6:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    _proto.create = function create(comment, postId, userId) {
        var _this = this;
        return _async_to_generator(/*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var session, createdComment, modifiedCount;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _this.connection.startSession();
                    case 2:
                        session = _ctx.sent;
                        session.startTransaction();
                        _ctx.prev = 4;
                        _ctx.next = 7;
                        return _this.commentModel.create(_object_spread_props(_object_spread({}, comment), {
                            author: userId,
                            postId: postId
                        }));
                    case 7:
                        createdComment = _ctx.sent;
                        if (createdComment) {
                            _ctx.next = 10;
                            break;
                        }
                        throw new InternalServerErrorException("Comment was not created");
                    case 10:
                        _ctx.next = 12;
                        return _this.postModel.updateOne({
                            _id: createdComment.postId
                        }, {
                            $push: {
                                comments: createdComment.id
                            }
                        }, {
                            useFindAndModify: false
                        });
                    case 12:
                        modifiedCount = _ctx.sent.modifiedCount;
                        if (!(modifiedCount === 0)) {
                            _ctx.next = 15;
                            break;
                        }
                        throw new InternalServerErrorException("Comment was not created");
                    case 15:
                        _ctx.next = 17;
                        return session.commitTransaction();
                    case 17:
                        return _ctx.abrupt("return", createdComment.populate("author"));
                    case 20:
                        _ctx.prev = 20;
                        _ctx.t0 = _ctx["catch"](4);
                        _ctx.next = 24;
                        return session.abortTransaction();
                    case 24:
                        throw _ctx.t0;
                    case 25:
                        _ctx.prev = 25;
                        session.endSession();
                        return _ctx.finish(25);
                    case 28:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee, null, [
                [
                    4,
                    20,
                    25,
                    28
                ]
            ]);
        }))();
    };
    _proto.update = function update(commentId, comment, userId) {
        var _this = this;
        return _async_to_generator(/*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var author, updatedComment;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _this.getById(commentId);
                    case 2:
                        author = _ctx.sent.author;
                        if (!(author.id !== userId)) {
                            _ctx.next = 5;
                            break;
                        }
                        throw new ForbiddenException();
                    case 5:
                        _ctx.next = 7;
                        return _this.commentModel.findByIdAndUpdate(commentId, comment, {
                            new: true
                        });
                    case 7:
                        updatedComment = _ctx.sent;
                        if (updatedComment) {
                            _ctx.next = 10;
                            break;
                        }
                        throw new InternalServerErrorException("Comment was not updated");
                    case 10:
                        return _ctx.abrupt("return", updatedComment.populate("author"));
                    case 11:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee);
        }))();
    };
    _proto.delete = function _delete(commentId, userId) {
        var _this = this;
        return _async_to_generator(/*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var session, ref, author, postId, deletedCount, modifiedCount;
            return regeneratorRuntime.wrap(function _callee$(_ctx) {
                while(1)switch(_ctx.prev = _ctx.next){
                    case 0:
                        _ctx.next = 2;
                        return _this.connection.startSession();
                    case 2:
                        session = _ctx.sent;
                        session.startTransaction();
                        _ctx.prev = 4;
                        _ctx.next = 7;
                        return _this.getById(commentId);
                    case 7:
                        ref = _ctx.sent;
                        author = ref.author;
                        postId = ref.postId;
                        if (!(author.id !== userId)) {
                            _ctx.next = 12;
                            break;
                        }
                        throw new ForbiddenException();
                    case 12:
                        _ctx.next = 14;
                        return _this.commentModel.deleteOne({
                            _id: commentId
                        });
                    case 14:
                        deletedCount = _ctx.sent.deletedCount;
                        _ctx.next = 17;
                        return _this.postModel.updateOne({
                            _id: postId
                        }, {
                            $pull: {
                                comments: commentId
                            }
                        }, {
                            useFindAndModify: false
                        });
                    case 17:
                        modifiedCount = _ctx.sent.modifiedCount;
                        if (!(deletedCount === 0 || modifiedCount === 0)) {
                            _ctx.next = 20;
                            break;
                        }
                        throw new InternalServerErrorException("Comment was not deleted");
                    case 20:
                        _ctx.next = 22;
                        return session.commitTransaction();
                    case 22:
                        _ctx.next = 29;
                        break;
                    case 24:
                        _ctx.prev = 24;
                        _ctx.t0 = _ctx["catch"](4);
                        _ctx.next = 28;
                        return session.abortTransaction();
                    case 28:
                        throw _ctx.t0;
                    case 29:
                        _ctx.prev = 29;
                        session.endSession();
                        return _ctx.finish(29);
                    case 32:
                    case "end":
                        return _ctx.stop();
                }
            }, _callee, null, [
                [
                    4,
                    24,
                    29,
                    32
                ]
            ]);
        }))();
    };
    return CommentService;
}();
CommentService = _ts_decorate([
    Injectable(),
    _ts_param(0, InjectModel(Comment.name)),
    _ts_param(1, InjectModel(Post.name)),
    _ts_param(2, InjectConnection()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof Model === "undefined" ? Object : Model,
        typeof Model === "undefined" ? Object : Model,
        typeof MongooseConnection === "undefined" ? Object : MongooseConnection
    ])
], CommentService);
