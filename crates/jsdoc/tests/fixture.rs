use std::path::PathBuf;

use dashmap::DashMap;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    BytePos, DUMMY_SP,
};
use swc_ecma_parser::{parse_file_as_module, EsSyntax, Syntax};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixtures/**/*.js")]
fn fixture(path: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let comments = SwcComments::default();

        let fm = cm.load_file(&path).expect("failed to load fixture file");

        let mut errors = Vec::new();

        if let Err(err) = parse_file_as_module(
            &fm,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            Default::default(),
            Some(&comments),
            &mut errors,
        ) {
            err.into_diagnostic(&handler).emit();
        }
        for err in errors {
            err.into_diagnostic(&handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }
        let mut res = Vec::new();
        let mut comments: Vec<_> = comments.leading.into_iter().collect();
        comments.sort_by_key(|v| v.0);

        for (_, comments) in comments {
            for cmt in &comments {
                if cmt.kind == CommentKind::Line {
                    continue;
                }

                if !cmt.text.starts_with('*') {
                    continue;
                }

                println!(
                    "==================== {} ====================\n{}",
                    path.display(),
                    cmt.text
                );
                let (_, parsed) = jsdoc::parse(cmt.into()).unwrap();
                res.push(parsed);
            }
        }

        let s = NormalizedOutput::from(format!("{:#?}", res));
        s.compare_to_file(path.with_extension("debug")).unwrap();
        Ok(())
    })
    .unwrap();
}

type CommentMap = DashMap<BytePos, Vec<Comment>>;

/// Multi-threaded implementation of [Comments]
#[derive(Clone, Default)]
pub struct SwcComments {
    leading: CommentMap,
    trailing: CommentMap,
}

impl Comments for SwcComments {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.leading.entry(pos).or_default().push(cmt);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.leading.entry(pos).or_default().extend(comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        self.leading.contains_key(&pos)
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.take_leading(from);

        if let Some(mut cmt) = cmt {
            if from < to && self.has_leading(to) {
                cmt.extend(self.take_leading(to).unwrap());
            }

            self.add_leading_comments(to, cmt);
        }
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.remove(&pos).map(|v| v.1)
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.get(&pos).map(|v| v.to_owned())
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.entry(pos).or_default().push(cmt)
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.trailing.entry(pos).or_default().extend(comments)
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        self.trailing.contains_key(&pos)
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.take_trailing(from);

        if let Some(mut cmt) = cmt {
            if from < to && self.has_trailing(to) {
                cmt.extend(self.take_trailing(to).unwrap());
            }

            self.add_trailing_comments(to, cmt);
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos).map(|v| v.1)
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.get(&pos).map(|v| v.to_owned())
    }

    fn add_pure_comment(&self, pos: BytePos) {
        assert_ne!(pos, BytePos(0), "cannot add pure comment to zero position");

        let mut leading = self.leading.entry(pos).or_default();
        let pure_comment = Comment {
            kind: CommentKind::Block,
            span: DUMMY_SP,
            text: "#__PURE__".into(),
        };

        if !leading.iter().any(|c| c.text == pure_comment.text) {
            leading.push(pure_comment);
        }
    }
}
