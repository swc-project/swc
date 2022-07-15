use serde::{Deserialize, Serialize};
use swc_common::{comments::Comment, Span};
use swc_ecma_ast::{Module, ModuleItem, Program, Script};
use swc_ecma_visit::{Visit, VisitWith};
use swc_estree_ast::{
    flavor::Flavor, BaseNode, File, InterpreterDirective, LineCol, Loc, ModuleDeclaration,
    Program as BabelProgram, SrcType, Statement,
};
use swc_node_comments::SwcComments;

use crate::babelify::{Babelify, Context};

impl Babelify for Program {
    type Output = File;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let comments = extract_all_comments(&self, ctx);
        let program = match self {
            Program::Module(module) => module.babelify(ctx),
            Program::Script(script) => script.babelify(ctx),
            _ => unreachable!(),
        };

        File {
            base: BaseNode {
                leading_comments: Default::default(),
                inner_comments: Default::default(),
                trailing_comments: Default::default(),
                start: program.base.start,
                end: program.base.end,
                loc: program.base.loc,
                range: if matches!(Flavor::current(), Flavor::Acorn { .. }) {
                    match (program.base.start, program.base.end) {
                        (Some(start), Some(end)) => Some([start, end]),
                        _ => None,
                    }
                } else {
                    None
                },
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
            base: base_with_trailing_newline(span, ctx),
            source_type: SrcType::Module,
            body: self
                .body
                .into_iter()
                .map(|stmt| stmt.babelify(ctx).into())
                .collect(),
            interpreter: self.shebang.map(|s| InterpreterDirective {
                base: ctx.base(extract_shebang_span(span, ctx)),
                value: s,
            }),
            directives: Default::default(),
            source_file: Default::default(),
            comments: Default::default(),
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
            base: base_with_trailing_newline(span, ctx),
            source_type: SrcType::Script,
            body: self.body.babelify(ctx),
            interpreter: self.shebang.map(|s| InterpreterDirective {
                base: ctx.base(extract_shebang_span(span, ctx)),
                value: s,
            }),
            directives: Default::default(),
            source_file: Default::default(),
            comments: Default::default(),
        }
    }
}

/// Babel adds a trailing newline to the end of files when parsing, while swc
/// truncates trailing whitespace. In order to get the converted base node to
/// locations to match babel, we imitate the trailing newline for Script and
/// Module nodes.
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
    base.range = base.range.map(|range| [range[0], range[1] + 1]);

    base
}

/// Should return true if the first line in parsed file is a comment.
/// Required because babel and swc have slightly different handlings for first
/// line comments. Swc ignores them and starts the program on the next line
/// down, while babel includes them in the file start/end.
fn has_comment_first_line(sp: Span, ctx: &Context) -> bool {
    if let Some(comments) = ctx.comments.leading.get(&sp.hi) {
        !comments
            .first()
            .map(|c| c.span.lo == ctx.fm.start_pos)
            .unwrap_or(false)
    } else {
        true
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ModuleItemOutput {
    ModuleDecl(ModuleDeclaration),
    Stmt(Statement),
}

impl Babelify for ModuleItem {
    type Output = ModuleItemOutput;

    fn parallel(cnt: usize) -> bool {
        cnt >= 32
    }

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
        comments: ctx.comments.clone(),
        collected: Vec::new(),
    };
    program.visit_with(&mut collector);
    collector.collected
}

struct CommentCollector {
    comments: SwcComments,
    collected: Vec<Comment>,
}

impl Visit for CommentCollector {
    fn visit_span(&mut self, sp: &Span) {
        let mut span_comments: Vec<Comment> = Vec::new();
        // Comments must be deduped since it's possible for a single comment to show up
        // multiple times since they are not removed from the comments map.
        // For example, this happens when the first line in a file is a comment.
        if let Some(comments) = self.comments.leading.get(&sp.lo) {
            for comment in comments.iter() {
                if !self.collected.iter().any(|c| *c == *comment) {
                    span_comments.push(comment.clone());
                }
            }
        }

        if let Some(comments) = self.comments.trailing.get(&sp.hi) {
            for comment in comments.iter() {
                if !self.collected.iter().any(|c| *c == *comment) {
                    span_comments.push(comment.clone());
                }
            }
        }
        self.collected.append(&mut span_comments);
    }
}
