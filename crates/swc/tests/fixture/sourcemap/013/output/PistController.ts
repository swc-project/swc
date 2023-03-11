import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { POST_CONTROLLER_ROUTE, POST_DELETE_ENDPOINT, POST_GET_ALL_ENDPOINT, POST_GET_ENDPOINT, POST_CREATE_COMMENT_ENDPOINT, POST_CREATE_ENDPOINT, POST_UPDATE_ENDPOINT } from '@server/constants/controllers';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { Post as PostType } from '@server/post/schemas/PostSchema';
import { PostService } from '@server/post/PostService';
import { CreatePostDto } from '@server/post/dto/CreatePostDto';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';
import { CreateCommentDto } from '@server/comment/dto/CreateCommentDto';
import { CommentService } from '@server/comment/CommentService';
import { Comment } from '@server/comment/schemas/CommentSchema';
export let PostController = class PostController {
    constructor(postService, commentService){
        this.postService = postService;
        this.commentService = commentService;
    }
    getPosts() {
        return this.postService.getAll();
    }
    getPost(id) {
        return this.postService.getById(id);
    }
    createPost(createPostDto, user) {
        return this.postService.create(createPostDto, user.id);
    }
    updatePost(id, updatePostDto, user) {
        return this.postService.update(id, updatePostDto, user.id);
    }
    deletePost(id, user) {
        return this.postService.delete(id, user.id);
    }
    createPostComment(id, createCommentDto, user) {
        return this.commentService.create(createCommentDto, id, user.id);
    }
};
_ts_decorate([
    Get(POST_GET_ALL_ENDPOINT),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [])
], PostController.prototype, "getPosts", null);
_ts_decorate([
    Get(POST_GET_ENDPOINT),
    _ts_param(0, Param('id')),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String
    ])
], PostController.prototype, "getPost", null);
_ts_decorate([
    UseGuards(JwtAuthGuard),
    Post(POST_CREATE_ENDPOINT),
    _ts_param(0, Body()),
    _ts_param(1, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof CreatePostDto === "undefined" ? Object : CreatePostDto,
        typeof UserType === "undefined" ? Object : UserType
    ])
], PostController.prototype, "createPost", null);
_ts_decorate([
    UseGuards(JwtAuthGuard),
    Put(POST_UPDATE_ENDPOINT),
    _ts_param(0, Param('id')),
    _ts_param(1, Body()),
    _ts_param(2, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreatePostDto === "undefined" ? Object : CreatePostDto,
        typeof UserType === "undefined" ? Object : UserType
    ])
], PostController.prototype, "updatePost", null);
_ts_decorate([
    UseGuards(JwtAuthGuard),
    Delete(POST_DELETE_ENDPOINT),
    _ts_param(0, Param('id')),
    _ts_param(1, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof UserType === "undefined" ? Object : UserType
    ])
], PostController.prototype, "deletePost", null);
_ts_decorate([
    UseInterceptors(MongooseClassSerializerInterceptor(Comment)),
    UseGuards(JwtAuthGuard),
    Post(POST_CREATE_COMMENT_ENDPOINT),
    _ts_param(0, Param('id')),
    _ts_param(1, Body()),
    _ts_param(2, User()),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        String,
        typeof CreateCommentDto === "undefined" ? Object : CreateCommentDto,
        typeof UserType === "undefined" ? Object : UserType
    ])
], PostController.prototype, "createPostComment", null);
PostController = _ts_decorate([
    Controller(POST_CONTROLLER_ROUTE),
    UseInterceptors(MongooseClassSerializerInterceptor(PostType)),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof PostService === "undefined" ? Object : PostService,
        typeof CommentService === "undefined" ? Object : CommentService
    ])
], PostController);
