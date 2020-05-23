#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]

use crate::{ambient::RealImplRemover, dce::get_used};
use fxhash::FxHashSet;
use std::{
    cmp::{
        Ordering,
        Ordering::{Equal, Greater},
    },
    collections::hash_map::Entry,
    sync::Arc,
};
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prop_name_to_expr, StmtLike};
use swc_ts_checker::{
    id::Id,
    ty,
    ty::Type,
    util::{PatExt, TypeEq},
    ModuleTypeInfo,
};

mod ambient;
mod dce;

pub fn generate_dts(module: Module, info: ModuleTypeInfo) -> Module {
    module
        .fold_with(&mut RealImplRemover::default())
        .fold_with(&mut TypeResolver {
            used: get_used(&info),
            info,
            current_class: None,
            in_declare: false,
            top_level: true,
            forced_module: false,
            prevent_empty_export: false,
        })
}

#[derive(Debug)]
struct TypeResolver {
    info: ModuleTypeInfo,
    used: FxHashSet<Id>,
    current_class: Option<ty::Class>,

    in_declare: bool,
    top_level: bool,
    forced_module: bool,
    prevent_empty_export: bool,
}

impl TypeResolver {
    fn take<F>(&mut self, sym: &Id, mut pred: F) -> Option<Arc<Type>>
    where
        F: FnMut(&Type) -> bool,
    {
        if let Some(types) = self.info.types.get_mut(sym) {
            for ty in &*types {
                debug_assert!(ty.is_arc(), "All exported types must be freezed");
            }

            let pos = types.iter().position(|ty| pred(ty.normalize()));
            if let Some(pos) = pos {
                return Some(match types.remove(pos) {
                    Type::Arc(ty) => ty,
                    _ => unreachable!(),
                });
            }
        }

        None
    }

    fn get_mapped<F, T>(&self, sym: &Id, mut pred: F) -> Option<T>
    where
        F: FnMut(&Type) -> Option<T>,
    {
        if let Some(types) = self.info.types.get(sym) {
            for ty in &*types {
                debug_assert!(ty.is_arc(), "All exported types must be freezed: {:?}", ty);
            }

            types.iter().filter_map(|ty| pred(ty.normalize())).next()
        } else {
            None
        }
    }

    fn fold_stmts<T>(&mut self, nodes: Vec<T>) -> Vec<T>
    where
        T: StmtLike + FoldWith<Self>,
    {
        nodes
    }
}

impl Fold<BlockStmt> for TypeResolver {
    fn fold(&mut self, mut node: BlockStmt) -> BlockStmt {
        let old = self.top_level;
        self.top_level = false;
        node = node.fold_children(self);
        self.top_level = old;

        node
    }
}

impl Fold<Function> for TypeResolver {
    fn fold(&mut self, mut node: Function) -> Function {
        node.is_generator = false;
        node.is_async = false;

        let old = self.top_level;
        self.top_level = false;
        node = node.fold_children(self);
        self.top_level = old;

        node
    }
}

impl Fold<VarDecl> for TypeResolver {
    fn fold(&mut self, node: VarDecl) -> VarDecl {
        let mut node = node.fold_children(self);

        node.decls.retain(|v| match v.name {
            Pat::Invalid(..) => false,
            _ => true,
        });

        VarDecl {
            declare: true,
            ..node
        }
    }
}

impl Fold<VarDeclarator> for TypeResolver {
    fn fold(&mut self, mut node: VarDeclarator) -> VarDeclarator {
        if match &node.name {
            Pat::Array(arr) => arr.elems.is_empty(),
            Pat::Object(obj) => obj.props.is_empty(),
            _ => false,
        } {
            return VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Invalid(Invalid { span: DUMMY_SP }),
                init: None,
                definite: false,
            };
        }

        match node.name {
            Pat::Ident(ref mut i) => {
                if !self.used.contains(&i.clone().into()) {
                    node.name = Pat::Invalid(Invalid { span: DUMMY_SP });
                    return node;
                }
            }
            _ => {}
        }

        match node.init {
            Some(box Expr::Lit(Lit::Null(..)))
            | Some(box Expr::Lit(Lit::Str(..)))
            | Some(box Expr::Lit(Lit::JSXText(..))) => {
                node.init = None;
            }
            Some(box Expr::Lit(..)) => {}
            _ => {
                node.init = None;
            }
        };

        if node.init.is_some() {
            node.name.set_ty(None);
            return node;
        }

        match node.name {
            Pat::Ident(ref mut i) => {
                if i.type_ann.is_none() {
                    if let Some(ty) = self.info.vars.remove(&i.clone().into()).map(From::from) {
                        i.type_ann = Some(TsTypeAnn {
                            span: DUMMY_SP,
                            type_ann: box ty,
                        });
                    }
                }
            }
            _ => {}
        }

        if node.init.is_none() {
            node.name = node.name.fold_with(self);
        }

        node
    }
}

impl Fold<Pat> for TypeResolver {
    fn fold(&mut self, mut node: Pat) -> Pat {
        node = node.fold_children(self);

        match node {
            Pat::Assign(a) => *a.left,
            _ => node,
        }
    }
}

impl Fold<FnDecl> for TypeResolver {
    fn fold(&mut self, mut node: FnDecl) -> FnDecl {
        node.declare = !self.in_declare;

        let node: FnDecl = node.fold_children(self);

        if node.function.return_type.is_some() {
            return node;
        }

        let return_type = self.get_mapped(&node.ident.clone().into(), |ty| match ty {
            Type::Function(ty::Function { ref ret_ty, .. }) => {
                Some(TsTypeAnn::from((**ret_ty).clone()))
            }
            _ => None,
        });

        FnDecl {
            function: Function {
                return_type,
                ..node.function
            },
            ..node
        }
    }
}

impl Fold<TsModuleDecl> for TypeResolver {
    fn fold(&mut self, node: TsModuleDecl) -> TsModuleDecl {
        self.prevent_empty_export = true;

        let old_in_declare = self.in_declare;
        let old_top_level = self.top_level;

        self.top_level = false;
        self.in_declare = true;

        let node = TsModuleDecl {
            declare: true,
            ..node.fold_children(self)
        };

        self.top_level = old_top_level;
        self.in_declare = old_in_declare;

        node
    }
}

impl Fold<TsEnumDecl> for TypeResolver {
    fn fold(&mut self, node: TsEnumDecl) -> TsEnumDecl {
        let mut is_all_lit = true;
        let mut should_init_only_first = true;
        let has_no_init = node.members.iter().all(|v| v.init.is_none());

        if node.members.iter().any(|m| m.init.is_some()) {
            should_init_only_first = false;
        }

        let _: Option<()> = self.get_mapped(&node.id.clone().into(), |ty| {
            match ty {
                Type::Enum(e) => {
                    //
                    if e.members.iter().any(|m| match m.val {
                        Expr::Tpl(..) | Expr::Lit(..) => false,

                        _ => true,
                    }) {
                        is_all_lit = false;
                    }
                }
                _ => {}
            }

            None
        });

        let members = self.get_mapped(&node.id.clone().into(), |ty| match ty {
            Type::Enum(e) => Some(
                e.members
                    .iter()
                    .enumerate()
                    .map(|(i, member)| TsEnumMember {
                        span: member.span,
                        id: member.id.clone(),
                        init: if is_all_lit {
                            if has_no_init {
                                Some(box member.val.clone())
                            } else {
                                if should_init_only_first {
                                    if i == 0 {
                                        Some(box member.val.clone())
                                    } else {
                                        None
                                    }
                                } else {
                                    Some(box member.val.clone())
                                }
                            }
                        } else {
                            None
                        },
                    })
                    .collect(),
            ),
            _ => None,
        });

        TsEnumDecl {
            declare: !self.in_declare,
            members: members.unwrap_or(node.members),
            ..node
        }
    }
}

impl Fold<TsTypeAliasDecl> for TypeResolver {
    fn fold(&mut self, node: TsTypeAliasDecl) -> TsTypeAliasDecl {
        TsTypeAliasDecl {
            declare: !self.in_declare,
            ..node.fold_children(self)
        }
    }
}

impl Fold<Option<BlockStmt>> for TypeResolver {
    #[inline]
    fn fold(&mut self, _: Option<BlockStmt>) -> Option<BlockStmt> {
        None
    }
}

impl Fold<ClassMember> for TypeResolver {
    fn fold(&mut self, node: ClassMember) -> ClassMember {
        match node {
            ClassMember::Method(ClassMethod {
                span,
                key,
                function,
                kind,
                is_static,
                accessibility: Some(Accessibility::Private),
                is_abstract,
                is_optional,
            }) => {
                return ClassMember::ClassProp(ClassProp {
                    span,
                    computed: match key {
                        PropName::Computed(..) => true,
                        _ => false,
                    },
                    key: box prop_name_to_expr(key),
                    value: None,
                    type_ann: None,
                    is_static,
                    decorators: vec![],
                    accessibility: Some(Accessibility::Private),
                    is_abstract,
                    is_optional,
                    readonly: false,
                    definite: false,
                })
            }
            _ => {}
        }

        node.fold_children(self)
    }
}

impl Fold<ClassDecl> for TypeResolver {
    fn fold(&mut self, mut node: ClassDecl) -> ClassDecl {
        node.declare = !self.in_declare;

        let old_class = self.current_class.take();

        if let Some(class) = self.get_mapped(&node.ident.clone().into(), |ty| match ty {
            Type::Class(class) => Some(class.clone()),
            _ => None,
        }) {
            self.current_class = Some(class);
        }

        node = node.fold_children(self);

        self.current_class = old_class;

        node
    }
}

impl Fold<ClassProp> for TypeResolver {
    fn fold(&mut self, mut node: ClassProp) -> ClassProp {
        node.value = None;

        if node.accessibility == Some(Accessibility::Private) {
            node.type_ann = None;
        }

        if node.type_ann.is_some() {
            return node;
        }

        node.fold_children(self)
    }
}

impl Fold<ClassMethod> for TypeResolver {
    fn fold(&mut self, mut node: ClassMethod) -> ClassMethod {
        node = node.fold_children(self);

        if node.function.return_type.is_some() {
            return node;
        }

        node
    }
}

impl Fold<Vec<ClassMember>> for TypeResolver {
    fn fold(&mut self, mut members: Vec<ClassMember>) -> Vec<ClassMember> {
        members = members.fold_children(self);

        let mut props = Vec::with_capacity(members.len() + 6);
        let mut buf = Vec::with_capacity(members.len());
        //

        for mut m in members {
            match m {
                ClassMember::Constructor(ref mut c) => {
                    for p in c.params.iter_mut() {
                        match p {
                            ParamOrTsParamProp::TsParamProp(ref mut p) => {
                                if p.accessibility.is_some() || p.readonly {
                                    props.push(ClassMember::ClassProp(ClassProp {
                                        span: Default::default(),
                                        key: box match &p.param {
                                            TsParamPropParam::Ident(p) => Expr::Ident(p.clone()),
                                            TsParamPropParam::Assign(p) => match &p.left {
                                                //
                                                box Pat::Ident(i) => Expr::Ident(i.clone()),
                                                _ => unreachable!(
                                                    "binding pattern in property initializer"
                                                ),
                                            },
                                        },
                                        value: None,
                                        type_ann: None,
                                        is_static: false,
                                        decorators: vec![],
                                        computed: false,
                                        accessibility: p.accessibility,
                                        is_abstract: false,
                                        is_optional: false,
                                        readonly: p.readonly,
                                        definite: false,
                                    }));
                                }

                                p.accessibility = None;
                                p.readonly = false;
                            }
                            _ => {}
                        }
                    }
                }
                ClassMember::Method(ref mut m) => {
                    if let Some(Accessibility::Public) = m.accessibility {
                        m.accessibility = None;
                    }

                    match &m.key {
                        PropName::Computed(e) => match &*e.expr {
                            Expr::Bin(..) => continue,
                            _ => {}
                        },
                        _ => {}
                    }
                }
                _ => {}
            }

            buf.push(m);
        }

        props.extend(buf);

        props
    }
}

impl Fold<Stmt> for TypeResolver {
    fn fold(&mut self, v: Stmt) -> Stmt {
        let v = v.fold_children(self);
        match v {
            Stmt::Decl(Decl::Class(ref i)) if !self.used.contains((&i.ident.clone().into())) => {
                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }
            Stmt::Decl(Decl::Fn(ref i)) if !self.used.contains((&i.ident.clone().into())) => {
                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }

            Stmt::Decl(Decl::TsTypeAlias(ref i)) if !self.used.contains((&i.id.clone().into())) => {
                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }
            Stmt::Decl(Decl::TsInterface(ref i)) if !self.used.contains((&i.id.clone().into())) => {
                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }
            Stmt::Decl(Decl::TsEnum(ref i)) if !self.used.contains((&i.id.clone().into())) => {
                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }

            Stmt::Decl(Decl::Var(ref var)) if var.decls.is_empty() => {
                Stmt::Empty(EmptyStmt { span: DUMMY_SP })
            }
            _ => v,
        }
    }
}

impl Fold<Vec<Stmt>> for TypeResolver {
    fn fold(&mut self, mut stmts: Vec<Stmt>) -> Vec<Stmt> {
        if !self.top_level {
            return vec![];
        }

        stmts = stmts.fold_children(self);

        self.fold_stmts(stmts)
    }
}

impl Fold<Vec<ModuleItem>> for TypeResolver {
    fn fold(&mut self, mut items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        items = items.fold_children(self).move_flat_map(|item| match item {
            ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(..))) if self.in_declare => None,

            ModuleItem::ModuleDecl(_) | ModuleItem::Stmt(Stmt::Decl(..)) => Some(item),

            _ => None,
        });

        if self.top_level && self.forced_module && !self.prevent_empty_export {
            // items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
            //     NamedExport {
            //         span: DUMMY_SP,
            //         specifiers: vec![],
            //         src: None,
            //         type_only: false,
            //     },
            // )));
        }

        self.fold_stmts(items)
    }
}

impl Fold<ModuleItem> for TypeResolver {
    fn fold(&mut self, mut node: ModuleItem) -> ModuleItem {
        node = node.fold_children(self);
        let span = node.span();

        match node {
            ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(i))) => {
                if self.used.get(&i.id.clone().into()).is_none() {
                    self.forced_module = true;
                    return Stmt::Empty(EmptyStmt { span }).into();
                }
                return ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(i)));
            }

            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) if self.in_declare => {
                return ModuleItem::Stmt(Stmt::Decl(decl.decl))
            }
            _ => {}
        }

        node
    }
}

/// Sorts the type.
///
/// Note: I don't know why tsc does such strange operation, but I want to
/// replace tsc.
impl Fold<TsUnionType> for TypeResolver {
    fn fold(&mut self, mut u: TsUnionType) -> TsUnionType {
        fn rank(kind: TsKeywordTypeKind) -> u8 {
            match kind {
                TsKeywordTypeKind::TsNumberKeyword => 0,
                TsKeywordTypeKind::TsStringKeyword => 1,
                TsKeywordTypeKind::TsBooleanKeyword => 2,
                // TODO(kdy1): Implement fully
                _ => 4,
            }
        }

        u.types.sort_by(|a, b| match (&**a, &**b) {
            (&TsType::TsKeywordType(ref a), &TsType::TsKeywordType(ref b)) => {
                rank(a.kind).cmp(&rank(b.kind))
            }
            _ => Equal,
        });

        u
    }
}

impl Fold<TsIndexSignature> for TypeResolver {
    fn fold(&mut self, sig: TsIndexSignature) -> TsIndexSignature {
        let sig = sig.fold_children(self);

        if sig.type_ann.is_none() {
            return TsIndexSignature {
                type_ann: Some(TsTypeAnn {
                    span: DUMMY_SP,
                    type_ann: box TsType::TsKeywordType(TsKeywordType {
                        span: DUMMY_SP,
                        kind: TsKeywordTypeKind::TsAnyKeyword,
                    }),
                }),
                ..sig
            };
        }

        sig
    }
}
