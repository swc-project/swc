use super::Bundler;
use crate::{
    bundler::{
        export::{Exports, RawExports},
        helpers::Helpers,
        import::RawImports,
    },
    debug::assert_clean,
    Id, ModuleId,
};
use anyhow::{Context, Error};
use is_macro::Is;
use rayon::prelude::*;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_atoms::js_word;
use swc_common::{FileName, Mark, SourceFile, DUMMY_SP};
use swc_ecma_ast::{
    Expr, ExprOrSuper, ImportDecl, ImportSpecifier, Invalid, MemberExpr, Module, ModuleDecl,
    Program, Str,
};
use swc_ecma_transforms::{
    optimization::{simplify::dead_branch_remover, InlineGlobals},
    resolver::resolver_with_mark,
};
use swc_ecma_visit::{FoldWith, Node, Visit, VisitWith};
