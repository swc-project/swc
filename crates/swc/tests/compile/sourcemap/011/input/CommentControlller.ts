import { Body, Controller, Delete, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';

import {
    COMMENT_CONTROLLER_ROUTE,
    COMMENT_DELETE_ENDPOINT,
    COMMENT_UPDATE_ENDPOINT,
} from '@server/constants/controllers';
import { MongooseClassSerializerInterceptor } from '@server/interceptors/MongooseClassSerializerInterceptor';
import { Comment } from '@server/comment/schemas/CommentSchema';
import { CommentService } from '@server/comment/CommentService';
import { JwtAuthGuard } from '@server/auth/guards/JwtAuthGuard';
import { User } from '@server/decorators/UserDecorator';
import { User as UserType } from '@server/user/schemas/UserSchema';
import { UpdateCommentDto } from '@server/comment/dto/UpdateCommentDto';

@Controller(COMMENT_CONTROLLER_ROUTE)
@UseInterceptors(MongooseClassSerializerInterceptor(Comment))
export class CommentController {
    constructor(private commentService: CommentService) { }

    @UseGuards(JwtAuthGuard)
    @Put(COMMENT_UPDATE_ENDPOINT)
    public updateComment(
        @Param('id') id: string,
        @Body() updateCommentDto: UpdateCommentDto,
        @User() user: UserType,
    ) {
        return this.commentService.update(id, updateCommentDto, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(COMMENT_DELETE_ENDPOINT)
    public deleteComment(@Param('id') id: string, @User() user: UserType) {
        return this.commentService.delete(id, user.id);
    }
}
