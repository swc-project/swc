use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

pub(crate) trait AsCollapsibleDecl {
    fn get_decl_id(&self) -> Option<Id>;
}

impl AsCollapsibleDecl for Decl {
    fn get_decl_id(&self) -> Option<Id> {
        match self {
            Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                Some(ident.to_id())
            }
            Decl::TsEnum(ts_enum) => Some(ts_enum.id.to_id()),
            Decl::TsModule(ts_module) => ts_module.id.as_ident().map(Ident::to_id),
            _ => None,
        }
    }
}

impl AsCollapsibleDecl for Stmt {
    fn get_decl_id(&self) -> Option<Id> {
        self.as_decl().and_then(AsCollapsibleDecl::get_decl_id)
    }
}

impl AsCollapsibleDecl for ModuleItem {
    fn get_decl_id(&self) -> Option<Id> {
        match self {
            Self::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. })) => decl.get_decl_id(),
            Self::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                decl:
                    DefaultDecl::Class(ClassExpr {
                        ident: Some(ident), ..
                    })
                    | DefaultDecl::Fn(FnExpr {
                        ident: Some(ident), ..
                    }),
                ..
            })) => Some(ident.to_id()),
            Self::Stmt(stmt) => stmt.get_decl_id(),
            _ => None,
        }
    }
}

pub(crate) trait AsEnumOrModule {
    fn is_enum_or_module(&self) -> bool;
    fn get_enum_or_module_id(&self) -> Option<Id>;
}

impl AsEnumOrModule for Stmt {
    fn is_enum_or_module(&self) -> bool {
        matches!(self, Self::Decl(Decl::TsModule(..) | Decl::TsEnum(..)))
    }

    fn get_enum_or_module_id(&self) -> Option<Id> {
        self.as_decl().and_then(|decl| match decl {
            Decl::TsEnum(ts_enum) => Some(ts_enum.id.to_id()),
            Decl::TsModule(ts_module) => ts_module.id.as_ident().map(Ident::to_id),
            _ => None,
        })
    }
}

impl AsEnumOrModule for ModuleItem {
    fn is_enum_or_module(&self) -> bool {
        matches!(
            self,
            Self::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsModule(..) | Decl::TsEnum(..),
                ..
            })) | Self::Stmt(Stmt::Decl(Decl::TsModule(..) | Decl::TsEnum(..)))
        )
    }

    fn get_enum_or_module_id(&self) -> Option<Id> {
        match self {
            Self::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsEnum(ts_enum),
                ..
            })) => Some(ts_enum.id.to_id()),
            Self::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsModule(ts_module),
                ..
            })) => ts_module.id.as_ident().map(Ident::to_id),
            Self::Stmt(Stmt::Decl(Decl::TsEnum(ts_enum))) => Some(ts_enum.id.to_id()),
            Self::Stmt(Stmt::Decl(Decl::TsModule(ts_module))) => {
                ts_module.id.as_ident().map(Ident::to_id)
            }
            _ => None,
        }
    }
}

///
/// this.prop = value
pub(crate) fn assign_value_to_this_prop(prop_name: PropName, value: Expr) -> Box<Expr> {
    let target = MemberExpr {
        obj: ThisExpr { span: DUMMY_SP }.into(),
        span: DUMMY_SP,
        prop: prop_name.into(),
    };

    let expr = value.make_assign_to(op!("="), target.into());

    Box::new(expr)
}

/// this.#prop = value
pub(crate) fn assign_value_to_this_private_prop(
    private_name: PrivateName,
    value: Expr,
) -> Box<Expr> {
    let target = MemberExpr {
        obj: ThisExpr { span: DUMMY_SP }.into(),
        span: DUMMY_SP,
        prop: MemberProp::PrivateName(private_name),
    };

    let expr = value.make_assign_to(op!("="), target.into());

    Box::new(expr)
}

pub(crate) struct Factory;

impl Factory {
    pub(crate) fn function(params: Vec<Param>, body: BlockStmt) -> Function {
        Function {
            params,
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(body),
            is_generator: false,
            is_async: false,
            type_params: None,
            return_type: None,
        }
    }
}

pub(crate) trait VecStmtLike {
    type StmtLike;
    fn inject_after_directive<T>(&mut self, replace_with: T)
    where
        T: IntoIterator<Item = Self::StmtLike>;
}

impl VecStmtLike for Vec<ModuleItem> {
    type StmtLike = ModuleItem;

    fn inject_after_directive<T>(&mut self, replace_with: T)
    where
        T: IntoIterator<Item = Self::StmtLike>,
    {
        let directive_pos = self
            .iter()
            .position(|stmt| match stmt {
                // search first none directive
                ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) => {
                    !matches!(**expr, Expr::Lit(Lit::Str(..)))
                }
                _ => true,
            })
            .unwrap_or_default();

        self.splice(directive_pos..directive_pos, replace_with);
    }
}
