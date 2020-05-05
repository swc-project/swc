use crate::ty::{Function, TypeParam, TypeParamDecl};
use fxhash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{util::move_map::MoveMap, Fold, FoldWith};

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

impl Fold<Option<TypeParamDecl>> for TypeParamRemover<'_> {
    fn fold(&mut self, node: Option<TypeParamDecl>) -> Option<TypeParamDecl> {
        let mut node = node?;

        node.params = node.params.move_flat_map(|param| {
            // As we didn't fold children yet, scope contains param iff it's declared by
            // parent
            if self.scope.has(&param.name) {
                return None;
            }

            Some(param)
        });

        node = node.fold_children(self);

        if node.params.is_empty() {
            return None;
        }

        Some(node)
    }
}

impl Fold<TypeParam> for TypeParamRemover<'_> {
    fn fold(&mut self, node: TypeParam) -> TypeParam {
        self.scope.params.insert(node.name.clone());

        node
    }
}

impl Fold<Function> for TypeParamRemover<'_> {
    fn fold(&mut self, node: Function) -> Function {
        let mut v = TypeParamRemover {
            scope: Scope {
                parent: Some(&self.scope),
                params: Default::default(),
            },
        };

        node.fold_children(&mut v)
    }
}

#[derive(Debug, Default)]
struct Scope<'a> {
    parent: Option<&'a Scope<'a>>,
    params: FxHashSet<JsWord>,
}

impl Scope<'_> {
    fn has(&self, name: &JsWord) -> bool {
        if self.params.contains(name) {
            return true;
        }

        self.parent.map(|parent| parent.has(name)).unwrap_or(false)
    }
}
