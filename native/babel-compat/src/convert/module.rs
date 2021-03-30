use super::Context;
use crate::ast::{
    stmt::Statement,
    module::{Program as BabelProgram, SrcType, ModuleDeclaration, InterpreterDirective},
};
use crate::convert::Babelify;
use swc_ecma_ast::{Program, ModuleItem};
use swc_common::Span;
// use swc_common::Spanned;
use serde::{Serialize, Deserialize};

impl Babelify for Program {
    type Output = BabelProgram;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Program::Module(module) => {
                let span = module.span;
                BabelProgram {
                    base: ctx.base(span.clone()),
                    source_type: SrcType::Module,
                    body: module.body.iter().map(|stmt| stmt.clone().babelify(ctx).into()).collect(),
                    interpreter: module.shebang.map(|s| InterpreterDirective {
                        base: ctx.base(extract_shebang_span(span, ctx)),
                        value: s.to_string(),
                    }),
                    directives: Default::default(),
                    source_file: Default::default(),
                }
            },
            Program::Script(script) => {
                let span = script.span;
                BabelProgram {
                    base: ctx.base(span.clone()),
                    source_type: SrcType::Script,
                    body: script.body.iter().map(|stmt| stmt.clone().babelify(ctx)).collect(),
                    interpreter: script.shebang.map(|s| InterpreterDirective {
                        base: ctx.base(extract_shebang_span(span, ctx)),
                        value: s.to_string(),
                    }),
                    directives: Default::default(),
                    source_file: Default::default(),
                }
            },
        }
    }
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
            ModuleItemOutput::Stmt(s) => s,
            _ => panic!("illegal conversion"),
        }
    }
}

fn extract_shebang_span(span: Span, ctx: &Context) -> Span {
    ctx.cm.span_take_while(span, |ch| *ch != '\n')
}

