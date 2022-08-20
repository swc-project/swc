import { Model, Connection as MongooseConnection } from 'mongoose';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';

import { Comment, CommentDocument } from '@server/comment/schemas/CommentSchema';
import { CreateCommentDto } from '@server/comment/dto/CreateCommentDto';
import { UpdateCommentDto } from '@server/comment/dto/UpdateCommentDto';
import { Post, PostDocument } from '@server/post/schemas/PostSchema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectConnection() private readonly connection: MongooseConnection,
  ) {}

  async getById(commentId: string): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException();
    }

    return comment.populate('author');
  }

  async create(
    comment: CreateCommentDto,
    postId: string,
    userId: string,
  ): Promise<CommentDocument> {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      const createdComment = await this.commentModel.create({
        ...comment,
        author: userId,
        postId,
      });

      if (!createdComment) {
        throw new InternalServerErrorException('Comment was not created');
      }

      const { modifiedCount } = await this.postModel.updateOne(
        { _id: createdComment.postId },
        {
          $push: { comments: createdComment.id },
        },
        { useFindAndModify: false },
      );

      if (modifiedCount === 0) {
        throw new InternalServerErrorException('Comment was not created');
      }

      await session.commitTransaction();

      return createdComment.populate('author');
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }

  async update(
    commentId: string,
    comment: UpdateCommentDto,
    userId: string,
  ): Promise<CommentDocument> {
    const { author } = await this.getById(commentId);

    if (author.id !== userId) {
      throw new ForbiddenException();
    }

    const updatedComment = await this.commentModel.findByIdAndUpdate(commentId, comment, {
      new: true,
    });

    if (!updatedComment) {
      throw new InternalServerErrorException('Comment was not updated');
    }

    return updatedComment.populate('author');
  }

  async delete(commentId: string, userId: string): Promise<void> {
    const session = await this.connection.startSession();

    session.startTransaction();

    try {
      const { author, postId } = await this.getById(commentId);

      if (author.id !== userId) {
        throw new ForbiddenException();
      }

      const { deletedCount } = await this.commentModel.deleteOne({ _id: commentId });

      const { modifiedCount } = await this.postModel.updateOne(
        { _id: postId },
        {
          $pull: { comments: commentId },
        },
        { useFindAndModify: false },
      );

      if (deletedCount === 0 || modifiedCount === 0) {
        throw new InternalServerErrorException('Comment was not deleted');
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }
}
