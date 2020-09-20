use crate::ty::{self, Function, TypeParam, TypeParamDecl};
use fxhash::FxHashSet;
use swc_common::util::move_map::MoveMap;
use swc_ts_types::{FoldWith as _, Id};

/// Removes conflicting type parameters from children.
///
/// # Input
///
/// ```ts
/// const arrayMap: <A, B>(f: (x: A) => B) => <A, B>(a: A[]) => B[];
/// ```
///
/// # Output
///
/// ```ts
/// const arrayMap: <A, B>(f: (x: A) => B) => (a: A[]) => B[];
/// ```
#[derive(Debug)]
pub(super) struct TypeParamRemover<'a> {
    scope: Scope<'a>,
}

impl TypeParamRemover<'static> {
    pub fn new() -> Self {
        Self {
            scope: Default::default(),
        }
    }
}

impl ty::Fold for TypeParamRemover<'_> {
    fn fold_opt_type_param_decl(&mut self, node: Option<TypeParamDecl>) -> Option<TypeParamDecl> {
        let mut node = node?;

        node.params = node.params.move_flat_map(|param| {
            // As we didn't fold children yet, scope contains param iff it's declared by
            // parent
            if self.scope.has(&param.name) {
                return None;
            }

            Some(param)
        });

        node = node.fold_children_with(self);

        if node.params.is_empty() {
            return None;
        }

        Some(node)
    }

    fn fold_type_param(&mut self, node: ty::TypeParam) -> TypeParam {
        self.scope.params.insert(node.name.clone());

        node
    }

    fn fold_function(&mut self, node: ty::Function) -> Function {
        let mut v = TypeParamRemover {
            scope: Scope {
                parent: Some(&self.scope),
                params: Default::default(),
            },
        };

        node.fold_children_with(&mut v)
    }
}

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    params: FxHashSet<Id>,
}

impl Scope<'_> {
    fn has(&self, name: &Id) -> bool {
        if self.params.contains(name) {
            return true;
        }

        self.parent.map(|parent| parent.has(name)).unwrap_or(false)
    }
}
