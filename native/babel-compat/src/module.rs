use crate::{Context, Babelify};
use swc_babel_ast::{
    BaseNode, Loc, LineCol, Statement, Program as BabelProgram, SrcType, ModuleDeclaration,
    InterpreterDirective, File,
};

use swc_ecma_ast::{Program, Module, Script, ModuleItem};
use swc_common::Span;
use serde::{Serialize, Deserialize};
use std::any::type_name_of_val;

impl Babelify for Program {
    type Output = File;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let program = match self {
            Program::Module(module) => module.babelify(ctx),
            Program::Script(script) => script.babelify(ctx),
        };
        File {
            base: program.base.clone(),
            program: program,
            // comments: Default::default(), // TODO(dwoznicki): implement
            comments: Some(vec![]), // TODO(dwoznicki): implement
            tokens: Default::default(),
        }
    }
}

impl Babelify for Module {
    type Output = BabelProgram;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let span = self.span;
        BabelProgram {
            base: base_with_trailing_newline(span.clone(), ctx),
            source_type: SrcType::Module,
            body: self.body.iter().map(|stmt| stmt.clone().babelify(ctx).into()).collect(),
            interpreter: self.shebang.map(|s| InterpreterDirective {
                base: ctx.base(extract_shebang_span(span, ctx)),
                value: s.to_string(),
            }),
            directives: Default::default(),
            source_file: Default::default(),
        }
    }
}

impl Babelify for Script {
    type Output = BabelProgram;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let span = self.span;
        BabelProgram {
            base: base_with_trailing_newline(span.clone(), ctx),
            source_type: SrcType::Script,
            body: self.body.iter().map(|stmt| stmt.clone().babelify(ctx)).collect(),
            interpreter: self.shebang.map(|s| InterpreterDirective {
                base: ctx.base(extract_shebang_span(span, ctx)),
                value: s.to_string(),
            }),
            directives: Default::default(),
            source_file: Default::default(),
        }
    }
}

// Babel adds a trailing newline to the end of files when parsing, while swc truncates
// trailing whitespace. In order to get the converted base node to locations to match
// babel, we immitate the trailing newline for Script and Module nodes.
fn base_with_trailing_newline(span: Span, ctx: &Context) -> BaseNode {
    let mut base = ctx.base(span);
    base.end = base.end.map(|num| num + 1);
    base.loc = base.loc.map(|loc| {
        Loc {
            end: LineCol {
                line: loc.end.line + 1,
                column: 0,
            },
            ..loc
        }
    });
    base
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
            _ => panic!("illegal conversion: Cannot convert {} to Statement (in impl From<ModuleItemOutput> for Statement)", type_name_of_val(&m)),
        }
    }
}

fn extract_shebang_span(span: Span, ctx: &Context) -> Span {
    ctx.cm.span_take_while(span, |ch| *ch != '\n')
}

