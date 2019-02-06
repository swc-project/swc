use super::*;
use swc_common::SyntaxContext;

impl<'a> Emitter<'a> {
    pub(super) fn emit_trailing_comments_of_pos(
        &mut self,
        pos: BytePos,
        prefix_space: bool,
    ) -> Result {
        if !self.cfg.enable_comments {
            return Ok(());
        }

        // debug_assert!(self.file.contains(pos));
        let span = Span::new(pos, pos, SyntaxContext::empty());
        let ext_sp = self.cm.span_through_char(span, '/');

        let src = self
            .cm
            .span_to_snippet(ext_sp)
            .expect("failed to get snippet for span");
        if src == "" {
            return Ok(());
        }

        // println!("A.Snippet: {:?}", src);
        // println!("A.Extended: {:?}", ext_sp);

        Ok(())
    }

    pub(super) fn emit_leading_comments_of_pos(&mut self, pos: BytePos) -> Result {
        if !self.cfg.enable_comments {
            return Ok(());
        }
        // debug_assert!(self.file.contains(pos));
        if self.pos_of_leading_comments.contains(&pos) {
            return Ok(());
        }
        self.pos_of_leading_comments.insert(pos);

        let file = self.cm.lookup_char_pos(pos).file;

        let span = Span::new(pos, pos, SyntaxContext::empty());

        // Extend span until we meet /* or first //
        let mut ext_sp = span;
        loop {
            ext_sp = self.cm.span_extend_to_prev_str(ext_sp, "//", true);

            let (line, s) = file
                .lookup_line(ext_sp.lo())
                .and_then(|line| {
                    let ln = file.get_line(line);
                    Some((line, ln.expect("failed to get text of the line")))
                })
                // safe
                .unwrap();

            if s.trim().starts_with("//") && line > 0 {
                let (llo, lhi) = file.line_bounds(line - 1);
                // println!("L{}: {:?}~{:?}", line - 1, llo, lhi);
                ext_sp = ext_sp.with_lo(lhi);
                continue;
            }

            break;
        }
        if ext_sp.lo() < BytePos(3) {
            return Ok(());
        }

        // include `//`
        ext_sp = ext_sp.with_lo(ext_sp.lo() - BytePos(3));

        let src = match self.cm.span_to_snippet(ext_sp) {
            Ok(src) => src,
            // TODO: Handle error
            Err(e) => return Ok(()),
        };
        // if src == "" {
        //    return Ok(());
        // }

        // println!("B: {:?}", src);
        self.wr.write_comment(ext_sp, &src)?;
        Ok(())
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
