use swc_ecma_ast::{ModuleItem, Stmt};

pub trait IsDirective {
    fn as_ref(&self) -> Option<&Stmt>;
    fn is_use_strict(&self) -> bool {
        self.as_ref().map_or(false, Stmt::is_use_strict)
    }
}

impl<T> IsDirective for Box<T>
where
    T: IsDirective,
{
    fn as_ref(&self) -> Option<&Stmt> {
        T::as_ref(&**self)
    }
}

impl IsDirective for Stmt {
    fn as_ref(&self) -> Option<&Stmt> {
        Some(self)
    }
}

impl IsDirective for ModuleItem {
    fn as_ref(&self) -> Option<&Stmt> {
        match *self {
            ModuleItem::Stmt(ref s) => Some(s),
            _ => None,
        }
    }
}
