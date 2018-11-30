use ast::*;
use swc_common::{Fold, FoldWith};

macro_rules! mk_impl {
    ($T:ty) => {
        // impl<A: Pass, B: Pass> Fold<$T> for JoinedPass<A, B> {
        //     fn fold(&mut self, node: $T) -> $T {
        //         println!("Folding {}", stringify!($T));
        //         node.fold_children(self)
        //     }
        // }
        // impl<A: Pass, B: Pass> Fold<Box<$T>> for JoinedPass<A, B> {
        //     fn fold(&mut self, node: Box<$T>) -> Box<$T> {
        //         println!("Folding boxed<{}>", stringify!($T));
        //         let node = self.first.fold(*node);
        //         box self.second.fold(node)
        //     }
        // }
    };
}

macro_rules! mk_trait {
    ($($T:ty),*) => {
        /// Crazy trait to make traversal fast again.
        pub trait Pass: $( ::swc_common::Fold<$T> + )* {}
        impl<P> Pass for P
            where P: ?Sized + $( ::swc_common::Fold<$T> +)*{

        }

        $(
            mk_impl!($T);
        )*
    };
}

mk_trait!(
    // ArrayLit,
    // ArrayPat,
    // ArrowExpr,
    // AssignExpr,
    // AssignPat,
    // AssignPatProp,
    // AssignProp,
    // AwaitExpr,
    // BinExpr,
    // BlockStmt,
    // Bool,
    // BreakStmt,
    // CallExpr,
    // CatchClause,
    // Class,
    // ClassDecl,
    // ClassExpr,
    // ClassMethod,
    // CondExpr,
    // ContinueStmt,
    // DebuggerStmt,
    // DoWhileStmt,
    // EmptyStmt,
    // ExportAll,
    // ExportSpecifier,
    // ExprOrSpread,
    // FnDecl,
    // FnExpr,
    // ForInStmt,
    // ForOfStmt,
    // ForStmt,
    // Function,
    // GetterProp,
    // Ident,
    // IfStmt,
    // ImportDecl,
    // ImportDefault,
    // ImportSpecific,
    // ImportStarAs,
    // KeyValuePatProp,
    // KeyValueProp,
    // LabeledStmt,
    // MemberExpr,
    // MetaPropExpr,
    // MethodProp,
    // Module,
    // NamedExport,
    // NewExpr,
    // Null,
    // Number,
    // ObjectLit,
    // ObjectPat,
    // ParenExpr,
    // Regex,
    // RestPat,
    // ReturnStmt,
    // SeqExpr,
    // SetterProp,
    // SpreadElement,
    // Str,
    // SwitchCase,
    // SwitchStmt,
    // ThisExpr,
    // ThrowStmt,
    // TplElement,
    // TplLit,
    // TryStmt,
    // UnaryExpr,
    // UpdateExpr,
    // VarDecl,
    // VarDeclarator,
    // WhileStmt,
    // WithStmt,
    // YieldExpr,
    // // enums
    // AssignOp,
    // BinaryOp,
    // BlockStmtOrExpr,
    // ClassMethodKind,
    // Decl,
    // ExportDefaultDecl,
    // Expr,
    // ExprOrSuper,
    // ImportSpecifier,
    // Lit,
    // ModuleDecl,
    // ModuleItem,
    // ObjectPatProp,
    // Pat,
    // PatOrExpr,
    // Prop,
    // PropName,
    // PropOrSpread,
    // Stmt,
    // UnaryOp,
    // UpdateOp,
    // VarDeclKind,
    // VarDeclOrExpr,
    // VarDeclOrPat,
);

#[derive(Debug, Clone, Copy)]
pub struct JoinedPass<A, B> {
    pub first: A,
    pub second: B,
}

fn type_name<T>() -> String {
    format!("{}", unsafe { std::intrinsics::type_name::<T>() })
}

impl<A, B, T> Fold<Box<T>> for JoinedPass<A, B>
where
    Box<T>: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    fn fold(&mut self, node: Box<T>) -> Box<T> {
        println!("Optimized box for {}", type_name::<T>());
        let node = self.first.fold(*node);
        box self.second.fold(node)
    }
}

impl<A, B, T> Fold<T> for JoinedPass<A, B>
where
    T: FoldWith<Self>,
    T: FoldWith<A>,
    T: FoldWith<B>,
{
    default fn fold(&mut self, node: T) -> T {
        println!("Fold<{}>", type_name::<T>());

        node.fold_with(&mut self.first).fold_with(&mut self.second)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn expr_folder() -> impl Fold<Expr> {
        struct Logger;
        impl Fold<Expr> for Logger {
            fn fold(&mut self, node: Expr) -> Expr {
                // let node = node.fold_children(self);

                println!("Folding expr");
                node
            }
        }
        Logger
    }

    #[test]
    fn test_it() {
        crate::tests::Tester::run(|tester| {
            let module = tester
                .with_parser("actual.js", "use(foo + bar + 1)", |p| p.parse_module())
                .unwrap();

            module.fold_with(&mut chain!(expr_folder(), expr_folder(), expr_folder()));

            Ok(())
        });
    }

}
