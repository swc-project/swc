use crate::{Babelify, Context};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use swc_babel_ast::{
    BaseNode, File, InterpreterDirective, LineCol, Loc, ModuleDeclaration, Program as BabelProgram,
    SrcType, Statement,
};
use swc_common::{
    comments::{Comment, Comments, CommentsExt},
    Span,
};
use swc_ecma_ast::{Invalid, Module, ModuleItem, Program, Script};
use swc_ecma_visit::{Node, Visit, VisitWith};

impl Babelify for Program {
    type Output = File;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let comments = extract_all_comments(&self, ctx);
        let program = match self {
            Program::Module(module) => module.babelify(ctx),
            Program::Script(script) => script.babelify(ctx),
        };

        File {
            base: BaseNode {
                leading_comments: Default::default(),
                inner_comments: Default::default(),
                trailing_comments: Default::default(),
                start: program.base.start,
                end: program.base.end,
                loc: program.base.loc,
            },
            program,
            comments: Some(ctx.convert_comments(comments)),
            tokens: Default::default(),
        }
    }
}

impl Babelify for Module {
    type Output = BabelProgram;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let span = if has_comment_first_line(self.span, ctx) {
            self.span.with_lo(ctx.fm.start_pos)
        } else {
            self.span
        };
        BabelProgram {
            base: base_with_trailing_newline(span.clone(), ctx),
            source_type: SrcType::Module,
            body: self
                .body
                .iter()
                .map(|stmt| stmt.clone().babelify(ctx).into())
                .collect(),
            interpreter: self.shebang.map(|s| InterpreterDirective {
                base: ctx.base(extract_shebang_span(span, ctx)),
                value: s,
            }),
            directives: Default::default(),
            source_file: Default::default(),
        }
    }
}

impl Babelify for Script {
    type Output = BabelProgram;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let span = if has_comment_first_line(self.span, ctx) {
            self.span.with_lo(ctx.fm.start_pos)
        } else {
            self.span
        };
        BabelProgram {
            base: base_with_trailing_newline(span.clone(), ctx),
            source_type: SrcType::Script,
            body: self
                .body
                .iter()
                .map(|stmt| stmt.clone().babelify(ctx))
                .collect(),
            interpreter: self.shebang.map(|s| InterpreterDirective {
                base: ctx.base(extract_shebang_span(span, ctx)),
                value: s,
            }),
            directives: Default::default(),
            source_file: Default::default(),
        }
    }
}

// Babel adds a trailing newline to the end of files when parsing, while swc
// truncates trailing whitespace. In order to get the converted base node to
// locations to match babel, we immitate the trailing newline for Script and
// Module nodes.
fn base_with_trailing_newline(span: Span, ctx: &Context) -> BaseNode {
    let mut base = ctx.base(span);
    base.end = base.end.map(|num| num + 1);
    base.loc = base.loc.map(|loc| Loc {
        end: LineCol {
            line: loc.end.line + 1,
            column: 0,
        },
        ..loc
    });
    base
}

// Should return true if the first line in parsed file is a comment.
// Required because babel and swc have slightly different handlings for first
// line comments. Swc ignores them and starts the program on the next line down,
// while babel includes them in the file start/end.
fn has_comment_first_line(sp: Span, ctx: &Context) -> bool {
    ctx.comments.with_leading(sp.hi, |comments| {
        !comments
            .first()
            .map(|c| c.span.lo == ctx.fm.start_pos)
            .unwrap_or(false)
    })
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleItemOutput {
    ModuleDecl(ModuleDeclaration),
    Stmt(Statement),
}

impl Babelify for ModuleItem {
    type Output = ModuleItemOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ModuleItem::ModuleDecl(d) => ModuleItemOutput::ModuleDecl(d.babelify(ctx).into()),
            ModuleItem::Stmt(s) => ModuleItemOutput::Stmt(s.babelify(ctx)),
        }
    }
}

impl From<ModuleItemOutput> for Statement {
    fn from(m: ModuleItemOutput) -> Self {
        match m {
            ModuleItemOutput::Stmt(stmt) => stmt,
            ModuleItemOutput::ModuleDecl(decl) => match decl {
                ModuleDeclaration::ExportAll(e) => Statement::ExportAllDecl(e),
                ModuleDeclaration::ExportDefault(e) => Statement::ExportDefaultDecl(e),
                ModuleDeclaration::ExportNamed(e) => Statement::ExportNamedDecl(e),
                ModuleDeclaration::Import(i) => Statement::ImportDecl(i),
            },
        }
    }
}

fn extract_shebang_span(span: Span, ctx: &Context) -> Span {
    ctx.cm.span_take_while(span, |ch| *ch != '\n')
}

fn extract_all_comments(program: &Program, ctx: &Context) -> Vec<Comment> {
    let mut collector = CommentCollector {
        comments: Arc::clone(&ctx.comments),
        collected: Vec::new(),
    };
    program.visit_with(
        &Invalid {
            span: swc_common::DUMMY_SP,
        },
        &mut collector,
    );
    collector.collected
}

struct CommentCollector {
    comments: Arc<dyn Comments>,
    collected: Vec<Comment>,
}

impl Visit for CommentCollector {
    fn visit_span(&mut self, sp: &Span, _: &dyn Node) {
        let mut span_comments: Vec<Comment> = Vec::new();
        // Comments must be deduped since it's possible for a single comment to show up
        // multiple times since they are not removed from the comments map.
        // For example, this happens when the first line in a file is a comment.
        self.comments.with_leading(sp.lo, |comments| {
            for comment in comments.iter().cloned() {
                if !self.collected.iter().any(|c| *c == comment) {
                    span_comments.push(comment);
                }
            }
        });
        self.comments.with_trailing(sp.hi, |comments| {
            for comment in comments.iter().cloned() {
                if !self.collected.iter().any(|c| *c == comment) {
                    span_comments.push(comment);
                }
            }
        });
        self.collected.append(&mut span_comments);
    }
}
