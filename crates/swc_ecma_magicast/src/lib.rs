use std::ops::{Deref, Index, IndexMut, Shl};

use swc_ecma_ast::Module;

use crate::data::Data;

mod data;

pub struct ModuleNode(Data<Module>);

impl ModuleNode {
    pub fn imports(&self) -> ModuleImports {}

    pub fn exports(&self) -> ModuleExports {}
}

pub struct ModuleImports {}

pub struct ModuleExports {
    pub default: OptionalNode<ExportItemNode>,
}

impl Index<String> for ModuleExports {
    type Output = ExportItemNode;
}

impl IndexMut<String> for ModuleExports {}

pub struct OptionalNode<T> {
    node: Option<T>,
}

impl<N> OptionalNode<N> {
    pub fn ensure(&mut self) -> &mut N {
        self.node.get_or_insert_with(|| panic!("unreachable"))
    }
}

pub struct ExportItemNode {}

pub struct ArrayNode {
    elems: VecNode<'a, ArrayElemeNode>,
}

pub struct ObjectNode {}

pub trait ExprLike {}

pub struct ExprNode {}

impl ExprNode {
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

    m.imports.from("foo"); // OptionalNode<ImportFrom> where ImportFrom is ensurable
    m.imports.named("foo"); // OPtionalNode<ImportNamed> where ImportNamed is
                            // not ensurable, and derefs to BindingRef

    m.imports.named("foo").remove();

    obj.props;

    arr.elems;
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

    /// Creates a new proxied data using self as the context, and new_data as
    /// the data
    fn new_proxied(&self, new_data: Self::Item) -> Result<Box<Self>, ()>;
}

pub trait Ensurable: Proxy {
    fn ensure(&mut self) -> Self::Item;
}

struct ModuleSpecifier(&'a str);

struct Identifier(&'a str);

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
