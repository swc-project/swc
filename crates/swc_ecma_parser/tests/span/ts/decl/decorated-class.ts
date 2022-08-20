
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
