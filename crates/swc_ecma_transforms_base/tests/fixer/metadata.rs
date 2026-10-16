use std::{cell::RefCell, fmt::Write, path::PathBuf, rc::Rc};

use swc_common::{
    comments::{Comment, Comments, SingleThreadedComments},
    BytePos, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::{EsVersion, Module, ModuleItem, ParenExpr, Program, Script};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};
use swc_ecma_transforms_base::fixer::{fixer, paren_remover};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};
use testing::{fixture, NormalizedOutput};

/// Exercise source spans and the overlapping spans produced by transforms.
#[derive(Clone, Copy, Debug)]
enum SpanMode {
    Source,
    Duplicated,
    Dummy,
    Shared,
    Pure,
    Mixed,
}

impl SpanMode {
    fn apply(self, module: &mut Module) {
        match self {
            Self::Source => {}
            Self::Duplicated => module.body.extend(module.body.clone()),
            Self::Dummy => module.visit_mut_with(&mut ReplaceSpans(DUMMY_SP)),
            Self::Shared => {
                module.visit_mut_with(&mut ReplaceSpans(Span::new(BytePos(1), BytePos(2))))
            }
            Self::Pure => {
                module.visit_mut_with(&mut ReplaceSpans(Span::new(BytePos::PURE, BytePos::PURE)))
            }
            Self::Mixed => module.visit_mut_with(&mut MixedSpans(1)),
        }
    }
}

struct ReplaceSpans(Span);

impl VisitMut for ReplaceSpans {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, span: &mut Span) {
        *span = self.0;
    }
}

/// A fixed sequence mixes real, dummy, PURE, and colliding source spans.
struct MixedSpans(u64);

impl VisitMut for MixedSpans {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, span: &mut Span) {
        self.0 = self.0.wrapping_mul(6364136223846793005).wrapping_add(1);
        match (self.0 >> 32) % 6 {
            0 => *span = DUMMY_SP,
            1 => *span = Span::new(BytePos::PURE, BytePos::PURE),
            2 => *span = Span::new(BytePos(1), BytePos(2)),
            3 => *span = Span::new(BytePos(3), BytePos(4)),
            _ => {}
        }
    }
}

#[derive(Default)]
struct ParenSnapshot(String);

impl Visit for ParenSnapshot {
    noop_visit_type!();

    fn visit_paren_expr(&mut self, paren: &ParenExpr) {
        writeln!(
            self.0,
            "paren {:?}, operand {:?}",
            paren.span,
            paren.expr.span()
        )
        .unwrap();
        paren.visit_children_with(self);
    }
}

/// Record migration calls as well as their effects on attached comments.
/// A changed order can otherwise be invisible when a source anchor is empty.
struct RecordingComments {
    inner: SingleThreadedComments,
    moves: RefCell<String>,
}

impl RecordingComments {
    fn copy_from(comments: &SingleThreadedComments) -> Self {
        let (leading, trailing) = comments.borrow_all();
        Self {
            inner: SingleThreadedComments::from_leading_and_trailing(
                Rc::new(RefCell::new(leading.clone())),
                Rc::new(RefCell::new(trailing.clone())),
            ),
            moves: Default::default(),
        }
    }

    fn snapshot(&self) -> String {
        let mut output = self.moves.borrow().clone();
        let (leading, trailing) = self.inner.borrow_all();
        for (kind, comments) in [("leading", &*leading), ("trailing", &*trailing)] {
            let mut comments = comments.iter().collect::<Vec<_>>();
            comments.sort_by_key(|(pos, _)| **pos);
            for (pos, attached) in comments {
                writeln!(output, "{kind} at {pos:?}: {attached:?}").unwrap();
            }
        }
        output
    }
}

impl Comments for RecordingComments {
    fn add_leading(&self, pos: BytePos, comment: Comment) {
        self.inner.add_leading(pos, comment);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.inner.add_leading_comments(pos, comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        self.inner.has_leading(pos)
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        writeln!(self.moves.borrow_mut(), "leading {from:?} -> {to:?}").unwrap();
        self.inner.move_leading(from, to);
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.inner.take_leading(pos)
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.inner.get_leading(pos)
    }

    fn add_trailing(&self, pos: BytePos, comment: Comment) {
        self.inner.add_trailing(pos, comment);
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.inner.add_trailing_comments(pos, comments);
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        self.inner.has_trailing(pos)
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        writeln!(self.moves.borrow_mut(), "trailing {from:?} -> {to:?}").unwrap();
        self.inner.move_trailing(from, to);
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.inner.take_trailing(pos)
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.inner.get_trailing(pos)
    }

    fn add_pure_comment(&self, pos: BytePos) {
        self.inner.add_pure_comment(pos);
    }

    fn has_flag(&self, pos: BytePos, flag: &str) -> bool {
        self.inner.has_flag(pos, flag)
    }
}

fn fix(program: &mut Program, comments: &dyn Comments, remove_only: bool) {
    if remove_only {
        program.visit_mut_with(&mut paren_remover(Some(comments)));
    } else {
        program.visit_mut_with(&mut fixer(Some(comments)));
    }
}

#[fixture("tests/ts-resolver/fixer/paren-metadata/**/input.ts")]
fn ts_fixer_metadata(input: PathBuf) {
    testing::run_test2(false, |cm, _| {
        let file = cm.load_file(&input).unwrap();
        let comments = SingleThreadedComments::default();
        let mut errors = Vec::new();
        let original = parse_file_as_module(
            &file,
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::latest(),
            Some(&comments),
            &mut errors,
        )
        .unwrap();
        assert!(errors.is_empty(), "{errors:?}");

        let mut spans = String::new();
        let mut attached_comments = String::new();
        for mode in [
            SpanMode::Source,
            SpanMode::Duplicated,
            SpanMode::Dummy,
            SpanMode::Shared,
            SpanMode::Pure,
            SpanMode::Mixed,
        ] {
            for remove_only in [false, true] {
                let mut module = original.clone();
                mode.apply(&mut module);
                let mut script = Program::Script(Script {
                    span: module.span,
                    body: module
                        .body
                        .iter()
                        .map(|item| match item {
                            ModuleItem::Stmt(stmt) => stmt.clone(),
                            _ => panic!("metadata fixture should also parse as a script"),
                        })
                        .collect(),
                    shebang: module.shebang.clone(),
                });
                let script_comments = RecordingComments::copy_from(&comments);
                fix(&mut script, &script_comments, remove_only);
                let mut module = Program::Module(module);
                let comments = RecordingComments::copy_from(&comments);
                fix(&mut module, &comments, remove_only);

                let mut snapshot = ParenSnapshot::default();
                module.visit_with(&mut snapshot);
                let mut script_snapshot = ParenSnapshot::default();
                script.visit_with(&mut script_snapshot);
                assert_eq!(snapshot.0, script_snapshot.0);
                assert_eq!(comments.snapshot(), script_comments.snapshot());
                writeln!(
                    spans,
                    "{mode:?}, remove_only={remove_only}:\n{}",
                    snapshot.0
                )
                .unwrap();
                writeln!(
                    attached_comments,
                    "{mode:?}, remove_only={remove_only}:\n{}",
                    comments.snapshot()
                )
                .unwrap();

                if matches!(mode, SpanMode::Source) && !remove_only {
                    for minify in [false, true] {
                        // Printing consumes comments; each format starts with
                        // the same independently owned store.
                        let comments = RecordingComments::copy_from(&comments.inner);
                        let mut output = Vec::new();
                        let mut mappings = Vec::new();
                        let mut emitter = Emitter {
                            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
                            cm: cm.clone(),
                            comments: Some(&comments),
                            wr: JsWriter::new(cm.clone(), "\n", &mut output, Some(&mut mappings)),
                        };
                        emitter.emit_program(&module).unwrap();
                        let mode = if minify { "compact" } else { "pretty" };
                        NormalizedOutput::from(String::from_utf8(output).unwrap())
                            .compare_to_file(input.with_file_name(format!("output.{mode}.ts")))
                            .unwrap();
                        let mappings = mappings
                            .iter()
                            .map(|(pos, loc)| format!("{}:{} -> {}\n", loc.line, loc.col, pos.0))
                            .collect::<String>();
                        NormalizedOutput::from(mappings)
                            .compare_to_file(input.with_file_name(format!("output.{mode}.map")))
                            .unwrap();
                    }
                }
            }
        }
        NormalizedOutput::from(spans)
            .compare_to_file(input.with_file_name("output.spans"))
            .unwrap();
        NormalizedOutput::from(attached_comments)
            .compare_to_file(input.with_file_name("output.comments"))
            .unwrap();
        Ok(())
    })
    .unwrap();
}
