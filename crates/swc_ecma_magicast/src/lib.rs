use std::ops::{Deref, Index, IndexMut, Shl};

pub struct ModuleNode<'a> {
    pub imports: ModuleImports<'a>,
    pub exports: ModuleExports<'a>,
}

pub struct ModuleExports<'a> {
    pub default: OptionalNode<ExportItemNode<'a>>,
}

impl<'a> Index<String> for ModuleExports<'a> {
    type Output = ExportItemNode<'a>;
}

impl<'a> IndexMut<String> for ModuleExports<'a> {}

pub struct OptionalNode<T> {
    node: Option<T>,
}

impl<N> OptionalNode<N> {
    pub fn ensure(&mut self) -> &mut N {
        self.node.get_or_insert_with(|| panic!("unreachable"))
    }
}

pub struct ExportItemNode<'a> {}

pub struct ArrayNode<'a> {
    elems: VecNode<'a, ArrayElemeNode<'a>>,
}

pub struct ObjectNode<'a> {}

pub trait ExprLike {}

pub struct ExprNode<'a> {}

impl ExprNode<'a> {
    pub fn cast<T>(&self) -> &T
    where
        T: ExprLike,
    {
        unimplemented!()
    }
}

fn usage() {
    let m: ModuleNode;

    m.exports.default;

    m.imports[ModuleSpecifier("foo")];
    m.imports["foo".as_module_specifier()];
    m.imports.from("foo"); // OptionalNode<ImportFrom> where ImportFrom is ensurable
    m.imports.named("foo"); // OPtionalNode<ImportNamed> where ImportNamed is
                            // not ensurable, and derefs to BindingRef
}

pub struct ImportNamed {}

impl Deref for ImportNamed {
    type Target = BindingRef;
}

pub struct ImportFrom {}

impl Ensurable for ImportFrom {}

pub struct BindingRef {}

pub trait Proxy {
    type Item;
}

pub trait Ensurable: Proxy {
    fn ensure(&mut self) -> Self::Item;
}

struct ModuleSpecifier<'a>(&'a str);

struct Identifier<'a>(&'a str);

pub struct Value<T>(T);

impl<'a, T> Shl<T> for &'a mut Value<T> {
    type Output = ();

    fn shl(self, rhs: T) -> Self::Output {
        self.0 = rhs
    }
}

impl<T> Deref for Value<T> {
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// Required for moving .cast() calls from the user code to our code
pub trait CastableTo<T>: Proxy {}
