#![feature(bench_black_box)]

use dashmap::DashMap;
use std::path::PathBuf;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    BytePos, DUMMY_SP,
};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};
use testing::NormalizedOutput;

#[testing::fixture("tests/fixtures/**/*.js")]
fn fixture(path: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let comments = SwcComments::default();

        let fm = cm.load_file(&path).expect("failed to load fixture file");

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            Default::default(),
            StringInput::from(&*fm),
            Some(&comments),
        );
        let mut p = Parser::new_from(lexer);

        if let Err(err) = p.parse_module() {
            err.into_diagnostic(&handler).emit();
        }
        for err in p.take_errors() {
            err.into_diagnostic(&handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }
        let mut res = vec![];
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
        let cmt = self.leading.remove(&from);

        if let Some(cmt) = cmt {
            self.leading.entry(to).or_default().extend(cmt.1);
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
        let cmt = self.trailing.remove(&from);

        if let Some(cmt) = cmt {
            self.trailing.entry(to).or_default().extend(cmt.1);
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos).map(|v| v.1)
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.get(&pos).map(|v| v.to_owned())
    }

    fn add_pure_comment(&self, pos: BytePos) {
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
