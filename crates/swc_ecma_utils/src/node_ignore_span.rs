use std::{borrow::Cow, fmt::Debug, hash::Hash};

use swc_common::EqIgnoreSpan;
use swc_ecma_ast::{Expr, MemberProp};

/// A newtype that will ignore Span while doing `eq` or `hash`.
pub struct NodeIgnoringSpan<'a, Node: ToOwned + Debug>(Cow<'a, Node>);

impl<'a, Node: ToOwned + Debug> Debug for NodeIgnoringSpan<'a, Node> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_tuple("NodeIgnoringSpan").field(&*self.0).finish()
    }
}

impl<'a, Node: ToOwned + Debug> NodeIgnoringSpan<'a, Node> {
    #[inline]
    pub fn borrowed(expr: &'a Node) -> Self {
        Self(Cow::Borrowed(expr))
    }

    #[inline]
    pub fn owned(expr: <Node as ToOwned>::Owned) -> Self {
        Self(Cow::Owned(expr))
    }
}

impl<'a, Node: EqIgnoreSpan + ToOwned + Debug> PartialEq for NodeIgnoringSpan<'a, Node> {
    fn eq(&self, other: &Self) -> bool {
        self.0.eq_ignore_span(&other.0)
    }
}

impl<'a, Node: EqIgnoreSpan + ToOwned + Debug> Eq for NodeIgnoringSpan<'a, Node> {}

// TODO: This is only a workaround for Expr. we need something like
// `hash_ignore_span` for each node in the end.
impl<'a> Hash for NodeIgnoringSpan<'a, Expr> {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        // In pratice, most of cases/input we are dealing with are Expr::Member or
        // Expr::Ident.
        match &*self.0 {
            Expr::Ident(i) => {
                i.sym.hash(state);
            }
            Expr::Member(i) => {
                {
                    NodeIgnoringSpan::borrowed(i.obj.as_ref()).hash(state);
                }
                if let MemberProp::Ident(prop) = &i.prop {
                    prop.sym.hash(state);
                }
            }
            _ => {
                // Other expression kinds would fallback to the same empty hash.
                // So, they will spend linear time to do comparisons.
            }
        }
    }
}

#[test]
fn test_hash_eq_ignore_span_expr_ref() {
    use rustc_hash::FxHashSet;
    use swc_common::{util::take::Take, Mark, DUMMY_SP};
    use swc_ecma_ast::*;

    use crate::{member_expr, quote_expr};

    fn expr_ref(expr_ref: &Expr) -> NodeIgnoringSpan<Expr> {
        NodeIgnoringSpan::borrowed(expr_ref)
    }

    testing::run_test(false, |_cm, _handler| {
        Ident::within_ignored_ctxt(|| {
            let dummy_sp = DUMMY_SP;
            let meaningful_sp = dummy_sp.apply_mark(Mark::new());

            let meaningful_ident_expr = Expr::Ident(Ident::new("foo".into(), meaningful_sp));
            let dummy_ident_expr = Expr::Ident(Ident::new("foo".into(), dummy_sp));

            let meaningful_member_expr = member_expr!(meaningful_sp, foo.bar).into();
            let dummy_member_expr = member_expr!(dummy_sp, foo.bar).into();

            let meaningful_null_expr = quote_expr!(meaningful_sp, null);
            let dummy_null_expr = quote_expr!(dummy_sp, null);

            let meaningful_array_expr = Box::new(Expr::Array(ArrayLit {
                span: meaningful_sp,
                elems: Default::default(),
            }));

            let dummy_array_expr = Box::new(Expr::Array(ArrayLit::dummy()));

            // Should equal ignoring span and syntax context
            assert_eq!(
                expr_ref(&meaningful_ident_expr),
                expr_ref(&dummy_ident_expr)
            );

            assert_eq!(
                expr_ref(&meaningful_array_expr),
                expr_ref(&dummy_array_expr)
            );

            let mut set = FxHashSet::from_iter([
                expr_ref(&meaningful_ident_expr),
                expr_ref(&meaningful_member_expr),
                expr_ref(&meaningful_null_expr),
                expr_ref(&meaningful_array_expr),
            ]);

            // Should produce the same hash value ignoring span and syntax
            assert!(set.contains(&expr_ref(&dummy_ident_expr)));
            assert!(set.contains(&expr_ref(&dummy_member_expr)));
            assert!(set.contains(&expr_ref(&dummy_null_expr)));
            assert!(set.contains(&expr_ref(&dummy_array_expr)));

            set.insert(expr_ref(&dummy_ident_expr));
            set.insert(expr_ref(&dummy_member_expr));
            set.insert(expr_ref(&dummy_null_expr));
            set.insert(expr_ref(&dummy_array_expr));
            assert_eq!(set.len(), 4);

            // Should not equal ignoring span and syntax context
            let dummy_ident_expr = Expr::Ident(Ident::new("baz".into(), dummy_sp));
            let dummy_member_expr = member_expr!(dummy_sp, baz.bar).into();
            let dummy_arrow_expr = Box::new(Expr::Arrow(ArrowExpr::dummy()));
            assert!(!set.contains(&expr_ref(&dummy_ident_expr)));
            assert!(!set.contains(&expr_ref(&dummy_member_expr)));
            assert!(!set.contains(&expr_ref(&dummy_arrow_expr)));
        });

        Ok(())
    })
    .unwrap();
}
