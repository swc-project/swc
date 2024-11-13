use swc_ecma_ast::TsEnumDecl;

use super::FastDts;

impl FastDts {
    pub(crate) fn transform_enum(&mut self, decl: &mut TsEnumDecl) {
        for member in &mut decl.members {
            if let Some(init) = &member.init {
                // Support for expressions is limited in enums,
                // see https://www.typescriptlang.org/docs/handbook/enums.html
                member.init = if self.valid_enum_init_expr(init) {
                    Some(init.clone())
                } else {
                    None
                };
            }
        }
    }
}
