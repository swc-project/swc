use swc_ecma_ast::{Module, ModuleItem, Program, Script};
use swc_estree_ast::{File, Program as BabelProgram, SrcType};

use crate::swcify::{Context, Swcify};

impl Swcify for File {
    type Output = Program;

    fn swcify(self, ctx: &Context) -> Self::Output {
        self.program.swcify(ctx)
    }
}

impl Swcify for BabelProgram {
    type Output = Program;

    fn swcify(self, ctx: &Context) -> Self::Output {
        let span = ctx.span(&self.base);
        let shebang = self.interpreter.map(|i| i.value);
        let body: Vec<ModuleItem> = self.body.swcify(ctx);
        let has_module_decl = body
            .iter()
            .any(|item| matches!(item, ModuleItem::ModuleDecl(_)));
        match self.source_type {
            SrcType::Module => Program::Module(Module {
                span,
                body,
                shebang,
            }),
            SrcType::Script if has_module_decl => Program::Module(Module {
                span,
                body,
                shebang,
            }),
            SrcType::Script => Program::Script(Script {
                span,
                body: body
                    .into_iter()
                    .filter_map(|item| match item {
                        ModuleItem::Stmt(stmt) => Some(stmt),
                        ModuleItem::ModuleDecl(_) => None,
                    })
                    .collect(),
                shebang,
            }),
        }
    }
}
