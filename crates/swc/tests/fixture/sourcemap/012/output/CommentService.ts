import _ts_decorate from "@swc/helpers/src/_ts_decorate.mjs";
import _ts_metadata from "@swc/helpers/src/_ts_metadata.mjs";
import _ts_param from "@swc/helpers/src/_ts_param.mjs";
import { Model, Connection as MongooseConnection } from 'mongoose';
import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Comment } from '@server/comment/schemas/CommentSchema';
import { Post } from '@server/post/schemas/PostSchema';
export let CommentService = class CommentService {
    constructor(commentModel, postModel, connection){
        this.commentModel = commentModel;
        this.postModel = postModel;
        this.connection = connection;
    }
    async getById(commentId) {
        const comment = await this.commentModel.findById(commentId);
        if (!comment) {
            throw new NotFoundException();
        }
        return comment.populate('author');
    }
    async create(comment, postId, userId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const createdComment = await this.commentModel.create({
                ...comment,
                author: userId,
                postId
            });
            if (!createdComment) {
                throw new InternalServerErrorException('Comment was not created');
            }
            const { modifiedCount  } = await this.postModel.updateOne({
                _id: createdComment.postId
            }, {
                $push: {
                    comments: createdComment.id
                }
            }, {
                useFindAndModify: false
            });
            if (modifiedCount === 0) {
                throw new InternalServerErrorException('Comment was not created');
            }
            await session.commitTransaction();
            return createdComment.populate('author');
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally{
            session.endSession();
        }
    }
    async update(commentId, comment, userId) {
        const { author  } = await this.getById(commentId);
        if (author.id !== userId) {
            throw new ForbiddenException();
        }
        const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, comment, {
            new: true
        });
        if (!updatedComment) {
            throw new InternalServerErrorException('Comment was not updated');
        }
        return updatedComment.populate('author');
    }
    async delete(commentId, userId) {
        const session = await this.connection.startSession();
        session.startTransaction();
        try {
            const { author , postId  } = await this.getById(commentId);
            if (author.id !== userId) {
                throw new ForbiddenException();
            }
            const { deletedCount  } = await this.commentModel.deleteOne({
                _id: commentId
            });
            const { modifiedCount  } = await this.postModel.updateOne({
                _id: postId
            }, {
                $pull: {
                    comments: commentId
                }
            }, {
                useFindAndModify: false
            });
            if (deletedCount === 0 || modifiedCount === 0) {
                throw new InternalServerErrorException('Comment was not deleted');
            }
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally{
            session.endSession();
        }
    }
};
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
