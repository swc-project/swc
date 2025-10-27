use swc_common::comments::Comments;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, FoldWith, VisitMut};

use crate::{amd::Amd, common_js::Cjs, system_js::SystemJs, umd::Umd};

/// Unified module transform visitor that encompasses all module formats.
///
/// This enum wraps all the different module format visitors (AMD, CommonJS,
/// SystemJS, UMD) into a single type, allowing for easier composition and
/// consistent handling.
///
/// Note: AMD requires a Comments type parameter, while other formats don't.
/// SystemJS uses the Fold trait internally, but we bridge it to VisitMut here.
pub enum ModuleTransform<C>
where
    C: Comments,
{
    /// AMD (Asynchronous Module Definition) format transformer
    Amd(Amd<C>),
    /// CommonJS format transformer
    Cjs(Cjs),
    /// SystemJS format transformer (uses Fold instead of VisitMut internally)
    SystemJs(SystemJs),
    /// UMD (Universal Module Definition) format transformer
    Umd(Umd),
}

impl<C> VisitMut for ModuleTransform<C>
where
    C: Comments,
{
    noop_visit_mut_type!(fail);

    fn visit_mut_module(&mut self, module: &mut Module) {
        match self {
            ModuleTransform::Amd(v) => v.visit_mut_module(module),
            ModuleTransform::Cjs(v) => v.visit_mut_module(module),
            ModuleTransform::SystemJs(v) => {
                // SystemJs uses Fold, so we need to convert
                *module = module.clone().fold_with(v);
            }
            ModuleTransform::Umd(v) => v.visit_mut_module(module),
        }
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        match self {
            ModuleTransform::Amd(v) => v.visit_mut_script(script),
            ModuleTransform::Cjs(v) => v.visit_mut_script(script),
            ModuleTransform::SystemJs(v) => {
                // SystemJs uses Fold, so we need to convert
                *script = script.clone().fold_with(v);
            }
            ModuleTransform::Umd(v) => v.visit_mut_script(script),
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match self {
            ModuleTransform::Amd(v) => v.visit_mut_expr(expr),
            ModuleTransform::Cjs(v) => v.visit_mut_expr(expr),
            ModuleTransform::SystemJs(v) => {
                // SystemJs uses Fold, so we need to convert
                *expr = expr.clone().fold_with(v);
            }
            ModuleTransform::Umd(v) => v.visit_mut_expr(expr),
        }
    }
}

// Helper methods to create each variant
impl<C> ModuleTransform<C>
where
    C: swc_common::comments::Comments,
{
    /// Creates an AMD module transformer
    pub fn new_amd(visitor: Amd<C>) -> Self {
        ModuleTransform::Amd(visitor)
    }

    /// Creates a CommonJS module transformer
    pub fn new_cjs(visitor: Cjs) -> Self {
        ModuleTransform::Cjs(visitor)
    }

    /// Creates a SystemJS module transformer
    pub fn new_systemjs(visitor: SystemJs) -> Self {
        ModuleTransform::SystemJs(visitor)
    }

    /// Creates a UMD module transformer
    pub fn new_umd(visitor: Umd) -> Self {
        ModuleTransform::Umd(visitor)
    }
}
