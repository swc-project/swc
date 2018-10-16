use super::*;

impl<'a> Emitter<'a> {
    pub(super) fn emit_trailing_comments_of_pos(
        &mut self,
        pos: BytePos,
        prefix_space: bool,
    ) -> Result {
        if !self.enable_comments {
            return Ok(());
        }
        debug_assert!(self.file.contains(pos));

        let line = match self.file.lookup_line(pos) {
            Some(l) => l,
            None => return Ok(()),
        };

        if let Some(ref ln) = self.file.get_line(line) {
            // TODO: only comment
            // if ln.contains("//") {
            //     self.wr.write(ln.as_bytes())?;
            // }
        }
        Ok(())
    }

    pub(super) fn emit_leading_comments_of_pos(&mut self, pos: BytePos) -> Result {
        if !self.enable_comments {
            return Ok(());
        }
        unimplemented!()
    }

    // /// (commentPos: number, commentEnd: number, kind: SyntaxKind,
    // /// hasTrailingNewLine: boolean, rangePos: number)
    // fn for_each_leading_comment_to_emit<F>(&mut self, pos: BytePos, cb: F)
    // where
    //     F: FnMut(&mut Self, BytePos, BytePos, SyntaxKind, bool, BytePos),
    // {
    // // Emit the leading comments only if the container's pos doesn't match
    // because     // the container should take care of emitting these comments
    //     if containerPos == -1 || pos != containerPos {
    //         if hasDetachedComments(pos) {
    //             forEachLeadingCommentWithoutDetachedComments(cb);
    //         } else {
    // forEachLeadingCommentRange(currentText, pos, cb, /* state */
    // pos);         }
    //     }
    // }

    // ///(commentPos: number, commentEnd: number, kind: SyntaxKind,
    // /// hasTrailingNewLine: boolean)
    // fn for_each_trailing_comment_to_emit<F>(&mut self, end: BytePos, cb: F)
    // where
    //     F: FnMut(&mut Self, BytePos, BytePos, SyntaxKind, bool),
    // {
    // // Emit the trailing comments only if the container's end doesn't match
    // because     // the container should take care of emitting these comments
    // if containerEnd == -1 || (end != containerEnd && end !=
    // declarationListContainerEnd) { forEachTrailingCommentRange(currentText,
    // end, cb);     }
    // }
}
