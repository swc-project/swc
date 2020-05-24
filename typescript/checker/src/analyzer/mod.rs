pub(crate) use self::scope::ScopeKind;
use self::{
    control_flow::{CondFacts, Facts},
    hoisting::HoistingWs,
    import::ImportFinder,
    pat::PatMode,
    props::ComputedPropMode,
    scope::Scope,
    stmt::AmbientFunctionHandler,
    util::ResultExt,
};
use crate::{
    debug::duplicate::DuplicateTracker,
    errors::{Error, Errors},
    id::Id,
    loader::Load,
    ty,
    ty::Type,
    validator::Validate,
    ImportInfo, ModuleTypeInfo, Rule, Specifier, ValidationResult,
};
use fxhash::{FxHashMap, FxHashSet};
use macros::validator;
use rayon::prelude::*;
use std::{
    fmt::Debug,
    ops::{Deref, DerefMut},
    path::PathBuf,
    sync::Arc,
};
use swc_common::{Span, Spanned, VisitMutWith, VisitWith, DUMMY_SP};
use swc_ecma_ast::{ModuleItem, *};
use swc_ts_builtin_types::Lib;

macro_rules! try_opt {
    ($e:expr) => {{
        match $e {
            Some(v) => Some(v?),
            None => None,
        }
    }};
}

mod assign;
mod class;
mod control_flow;
mod convert;
mod enums;
mod export;
mod expr;
mod finalizer;
mod function;
mod generic;
mod hoisting;
mod import;
mod pat;
mod props;
mod scope;
mod stmt;
mod util;

#[derive(Debug, Clone, Copy)]
pub(crate) struct Ctx {
    in_declare: bool,
    var_kind: VarDeclKind,
    pat_mode: PatMode,
    computed_prop_mode: ComputedPropMode,
    allow_ref_declaring: bool,
}

/// Note: All methods named `validate_*` return [Err] iff it's not recoverable.
pub struct Analyzer<'a, 'b> {
    pub info: Info,

    path: Arc<PathBuf>,
    export_equals_span: Span,
    in_declare: bool,

    resolved_import_types: FxHashMap<Id, Vec<Type>>,
    resolved_import_vars: FxHashMap<Id, Type>,
    errored_imports: FxHashSet<Id>,
    pending_exports: Vec<((Id, Span), Expr)>,

    rule: Rule,
    libs: &'b [Lib],
    scope: Scope<'a>,

    ctx: Ctx,

    loader: &'b dyn Load,

    is_builtin: bool,

    duplicated_tracker: DuplicateTracker,

    facts_buf: Option<Facts>,

    hoisting_ws: HoistingWs,
}

/// TODO
const NO_DUP: bool = false;

impl Analyzer<'_, '_> {
    /// Mark node as visited. This method panics if Analyzer had visited node.
    fn record<N>(&mut self, node: &N)
    where
        N: Debug + Spanned,
    {
        if cfg!(debug_assertions) && NO_DUP {
            self.duplicated_tracker.record(node)
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct Info {
    pub errors: Errors,
    pub exports: ModuleTypeInfo,
}

// TODO:
//#[validator] impl Validate<Program> for Analyzer<'_, '_> {
//    type Output = ValidationResult<ty::Module>;
//
//    fn validate(&mut self, node: &mut Program) -> Self::Output {
//        match node {
//            Program::Module(m) => m.validate_with(self),
//            Program::Script(s) => s.validate_with(self),
//        }
//    }
//}

fn make_module_ty(span: Span, exports: ModuleTypeInfo) -> ty::Module {
    ty::Module { span, exports }
}

// TODO:
//#[validator] impl Validate<Module> for Analyzer<'_, '_> {
//    type Output = ValidationResult<ty::Module>;
//
//    fn validate(&mut self, node: &mut Module) -> Self::Output {
//        let span = node.span;
//
//        let mut new = self.new(Scope::root());
//        node.visit_mut_children(&mut new);
//        self.info.errors.append_errors(&mut new.info.errors);
//        println!("after visit children");
//
//        Ok(self.finalize(make_module_ty(span, new.info.exports)))
//    }
//}

#[validator]
impl Validate<Script> for Analyzer<'_, '_> {
    type Output = ValidationResult<ty::Module>;

    fn validate(&mut self, node: &mut Script) -> Self::Output {
        let span = node.span;

        let mut new = self.new(Scope::root());
        node.visit_mut_children(&mut new);
        self.info.errors.append_errors(&mut new.info.errors);

        Ok(self.finalize(make_module_ty(span, new.info.exports)))
    }
}

fn _assert_types() {
    fn is_sync<T: Sync>() {}
    fn is_send<T: Send>() {}
    is_sync::<Info>();
    is_send::<Info>();
}

impl<'a, 'b> Analyzer<'a, 'b> {
    pub fn root(path: Arc<PathBuf>, libs: &'b [Lib], rule: Rule, loader: &'b dyn Load) -> Self {
        Self::new_inner(path, libs, rule, loader, Scope::root(), false)
    }

    pub(crate) fn for_builtin() -> Self {
        Self::new_inner(
            Arc::new(PathBuf::from("")),
            &[],
            Default::default(),
            &NoopLoader,
            Scope::root(),
            true,
        )
    }

    fn new(&self, scope: Scope<'a>) -> Self {
        Self::new_inner(
            self.path.clone(),
            self.libs,
            self.rule,
            self.loader,
            scope,
            self.is_builtin,
        )
    }

    fn new_inner(
        path: Arc<PathBuf>,
        libs: &'b [Lib],
        rule: Rule,
        loader: &'b dyn Load,
        scope: Scope<'a>,
        is_builtin: bool,
    ) -> Self {
        Self {
            info: Default::default(),
            path,
            export_equals_span: DUMMY_SP,
            // builtin types are declared
            in_declare: is_builtin,
            resolved_import_types: Default::default(),
            resolved_import_vars: Default::default(),
            errored_imports: Default::default(),
            pending_exports: Default::default(),
            rule,
            libs,
            scope,
            ctx: Ctx {
                in_declare: false,
                allow_ref_declaring: false,
                pat_mode: PatMode::Assign,
                computed_prop_mode: ComputedPropMode::Object,
                var_kind: VarDeclKind::Var,
            },
            loader,
            is_builtin,
            duplicated_tracker: Default::default(),
            facts_buf: None,
            hoisting_ws: Default::default(),
        }
    }

    #[inline]
    pub(crate) fn with<F, Ret>(&mut self, op: F) -> Ret
    where
        F: for<'aa, 'bb> FnOnce(&mut Analyzer<'aa, 'bb>) -> Ret,
    {
        op(self)
    }

    pub(crate) fn with_child<F, Ret>(&mut self, kind: ScopeKind, facts: CondFacts, op: F) -> Ret
    where
        F: for<'aa, 'bb> FnOnce(&mut Analyzer<'aa, 'bb>) -> Ret,
    {
        let ctx = self.ctx;
        let child_scope = Scope::new(&self.scope, kind, facts);
        let (ret, info, mut child_scope, dup) = {
            let mut child = self.new(child_scope);
            child.ctx = ctx;

            let ret = op(&mut child);

            (
                ret,
                child.info,
                child.scope.remove_parent(),
                child.duplicated_tracker,
            )
        };

        self.info.errors.extend(info.errors);
        if !self.is_builtin {
            assert_eq!(
                info.exports.types,
                Default::default(),
                "child cannot export a type"
            );
            assert!(
                info.exports.vars.is_empty(),
                "child cannot export a variable"
            );
        }

        self.duplicated_tracker.record_all(dup);
        self.scope.copy_hoisted_vars_from(&mut child_scope);

        ret
    }

    pub(super) fn with_ctx(&mut self, ctx: Ctx) -> WithCtx<'_, 'a, 'b> {
        let orig_ctx = self.ctx;
        self.ctx = ctx;
        WithCtx {
            analyzer: self,
            orig_ctx,
        }
    }
}

pub(super) struct WithCtx<'a, 'b, 'c> {
    analyzer: &'a mut Analyzer<'b, 'c>,
    orig_ctx: Ctx,
}

impl Drop for WithCtx<'_, '_, '_> {
    fn drop(&mut self) {
        self.analyzer.ctx = self.orig_ctx;
    }
}

impl<'b, 'c> Deref for WithCtx<'_, 'b, 'c> {
    type Target = Analyzer<'b, 'c>;

    fn deref(&self) -> &Self::Target {
        &self.analyzer
    }
}

impl<'b, 'c> DerefMut for WithCtx<'_, 'b, 'c> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut *self.analyzer
    }
}

struct NoopLoader;
impl Load for NoopLoader {
    fn load(&self, _: Arc<PathBuf>, _: &ImportInfo) -> Result<ModuleTypeInfo, Error> {
        unreachable!("builtin module should not import other module")
    }
}

#[validator]
impl Validate<Vec<ModuleItem>> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, items: &mut Vec<ModuleItem>) -> Self::Output {
        {
            // We first load imports.
            let mut imports: Vec<ImportInfo> = vec![];

            // Extract imports
            items.visit_with(&mut ImportFinder { to: &mut imports });

            let loader = self.loader;
            let path = self.path.clone();
            let import_results: Vec<Result<ModuleTypeInfo, _>> = imports
                .par_iter()
                .map(|import| {
                    loader.load(path.clone(), &*import).map_err(|err| {
                        //
                        (import, err)
                    })
                })
                .collect();

            for res in import_results {
                match res {
                    Ok(import) => {
                        self.resolved_import_types.extend(import.types);
                        self.resolved_import_vars.extend(import.vars);
                    }
                    Err((import, mut err)) => {
                        match err {
                            Error::ModuleLoadFailed { ref mut errors, .. } => {
                                self.info.errors.append(errors);
                            }
                            _ => {}
                        }
                        // Mark errored imported types as any to prevent useless errors
                        self.errored_imports.extend(
                            import
                                .items
                                .iter()
                                .map(|&Specifier { ref local, .. }| local.clone()),
                        );

                        self.info.errors.push(err);
                    }
                }
            }
        }

        let mut has_normal_export = false;
        items.iter().for_each(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(decl)) => {
                if self.export_equals_span.is_dummy() {
                    self.export_equals_span = decl.span;
                }
                if has_normal_export {
                    self.info.errors.push(Error::TS2309 { span: decl.span });
                }

                //
            }
            ModuleItem::ModuleDecl(item) => match item {
                ModuleDecl::ExportDecl(..)
                | ModuleDecl::ExportAll(..)
                | ModuleDecl::ExportDefaultDecl(..)
                | ModuleDecl::ExportDefaultExpr(..)
                | ModuleDecl::TsNamespaceExport(..) => {
                    has_normal_export = true;
                    if !self.export_equals_span.is_dummy() {
                        self.info.errors.push(Error::TS2309 {
                            span: self.export_equals_span,
                        });
                    }
                }
                _ => {}
            },
            _ => {}
        });

        if !self.in_declare {
            let mut visitor = AmbientFunctionHandler {
                last_ambient_name: None,
                errors: &mut self.info.errors,
            };

            items.visit_with(&mut visitor);

            if visitor.last_ambient_name.is_some() {
                visitor.errors.push(Error::TS2391 {
                    span: visitor.last_ambient_name.unwrap().span,
                })
            }
        }

        // if self.is_builtin {
        //     items.visit_mut_children(self);
        // } else {
        //     let order = self.reorder_stmts(&*items);
        //     assert_eq!(order.len(), items.len());
        //
        //     for idx in order {
        //         items[idx].visit_mut_with(self);
        //     }
        // }
        items.visit_mut_children(self);

        self.handle_pending_exports();

        Ok(())
    }
}

#[validator]
impl Validate<Vec<Stmt>> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, items: &mut Vec<Stmt>) -> Self::Output {
        let mut visitor = AmbientFunctionHandler {
            last_ambient_name: None,
            errors: &mut self.info.errors,
        };

        items.visit_with(&mut visitor);

        if visitor.last_ambient_name.is_some() {
            visitor.errors.push(Error::TS2391 {
                span: visitor.last_ambient_name.unwrap().span,
            })
        }

        items.visit_mut_children(self);

        Ok(())
    }
}

/// Done
#[validator]
impl Validate<Decorator> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, d: &mut Decorator) -> Self::Output {
        self.validate(&mut d.expr).store(&mut self.info.errors);

        Ok(())
    }
}

#[validator]
impl Validate<TsImportEqualsDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, node: &mut TsImportEqualsDecl) -> Self::Output {
        self.record(node);

        match node.module_ref {
            TsModuleRef::TsEntityName(ref e) => {
                match self.type_of_ts_entity_name(node.span, e, None) {
                    Ok(..) => {}
                    Err(err) => self.info.errors.push(err),
                }
            }
            _ => {}
        }

        Ok(())
    }
}

#[validator]
impl Validate<TsModuleDecl> for Analyzer<'_, '_> {
    type Output = ValidationResult<()>;

    fn validate(&mut self, decl: &mut TsModuleDecl) -> Self::Output {
        let span = decl.span;

        let mut new = self.new(Scope::root());
        new.ctx.in_declare = decl.declare;

        decl.visit_mut_children(&mut new);
        self.info.errors.append_errors(&mut new.info.errors);

        let module = self.finalize(ty::Module {
            span,
            exports: new.info.exports,
        });
        self.register_type(
            match decl.id {
                TsModuleName::Ident(ref i) => i.into(),
                TsModuleName::Str(ref s) => Ident::new(s.value.clone(), s.span).into(),
            },
            Type::Module(module),
        )
        .store(&mut self.info.errors);

        Ok(())
    }
}
