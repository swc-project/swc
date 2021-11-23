use super::ast::Index32;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_utils::Id;

#[derive(Debug, Clone)]
pub(crate) struct Symbol {
    /// This is the name that came from the parser. Printed names may be renamed
    /// during minification or to avoid name collisions. Do not use the original
    /// name during printing.
    pub original_name: JsWord,

    /// This is used for minification. Symbols that are declared in sibling
    /// scopes can share a name. A good heuristic (from Google Closure
    /// Compiler) is to assign names to symbols from sibling scopes in
    /// declaration order. That way local variable names are reused in each
    /// global function like this, which improves gzip compression:
    ///
    ///   function x(a, b) { ... }
    ///   function y(a, b, c) { ... }
    ///
    /// The parser fills this in for symbols inside nested scopes. There are
    /// three slot namespaces: regular symbols, label symbols, and private
    /// symbols.
    pub nested_scope_slot: Index32,

    pub kind: SymbolKind,

    /// Certain symbols must not be renamed or minified. For example, the
    /// "arguments" variable is declared by the runtime for every function.
    /// Renaming can also break any identifier used inside a "with" statement.
    pub must_not_be_renamed: bool,
}

#[derive(Debug)]
pub struct SymbolMap {
    symbols: AHashMap<Id, Symbol>,
}

impl SymbolMap {
    pub fn get(&self, id: &Id) -> Option<&Symbol> {
        self.symbols.get(id)
    }
}

#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) enum SymbolKind {
    /// An unbound symbol is one that isn't declared in the file it's referenced
    /// in. For example, using "window" without declaring it will be unbound.
    SymbolUnbound,

    /// This has special merging behavior. You're allowed to re-declare these
    /// symbols more than once in the same scope. These symbols are also hoisted
    /// out of the scope they are declared in to the closest containing function
    /// or module scope. These are the symbols with this kind:
    ///
    /// - Function arguments
    /// - Function statements
    /// - Variables declared using "var"
    SymbolHoisted,
    SymbolHoistedFunction,

    /// There's a weird special case where catch variables declared using a
    /// simple identifier (i.e. not a binding pattern) block hoisted
    /// variables instead of becoming an error:
    ///
    ///   var e = 0;
    ///   try { throw 1 } catch (e) {
    ///     print(e) // 1
    ///     var e = 2
    ///     print(e) // 2
    ///   }
    ///   print(e) // 0 (since the hoisting stops at the catch block boundary)
    ///
    /// However, other forms are still a syntax error:
    ///
    ///   try {} catch (e) { let e }
    ///   try {} catch ({e}) { var e }
    ///
    /// This symbol is for handling this weird special case.
    SymbolCatchIdentifier,

    /// Generator and async functions are not hoisted, but still have special
    /// properties such as being able to overwrite previous functions with the
    /// same name
    SymbolGeneratorOrAsyncFunction,

    /// This is the special "arguments" variable inside functions
    SymbolArguments,

    /// Classes can merge with TypeScript namespaces.
    SymbolClass,

    /// A class-private identifier (i.e. "#foo").
    SymbolPrivateField,
    SymbolPrivateMethod,
    SymbolPrivateGet,
    SymbolPrivateSet,
    SymbolPrivateGetSetPair,
    SymbolPrivateStaticField,
    SymbolPrivateStaticMethod,
    SymbolPrivateStaticGet,
    SymbolPrivateStaticSet,
    SymbolPrivateStaticGetSetPair,

    /// Labels are in their own namespace
    SymbolLabel,

    /// TypeScript enums can merge with TypeScript namespaces and other
    /// TypeScript enums.
    SymbolTSEnum,

    /// TypeScript namespaces can merge with classes, functions, TypeScript
    /// enums, and other TypeScript namespaces.
    SymbolTSNamespace,

    /// In TypeScript, imports are allowed to silently collide with symbols
    /// within the module. Presumably this is because the imports may be
    /// type-only.
    SymbolImport,

    /// Assigning to a "const" symbol will throw a TypeError at runtime
    SymbolConst,

    /// Injected symbols can be overridden by provided defines
    SymbolInjected,

    /// This annotates all other symbols that don't have special behavior.
    SymbolOther,
}

impl SymbolKind {
    pub fn is_private(self) -> bool {
        SymbolKind::SymbolPrivateField <= self && self <= SymbolKind::SymbolPrivateGetSetPair
    }
}

impl Symbol {
    pub fn slot_namespace(&self) -> SlotNamespace {
        if matches!(self.kind, SymbolKind::SymbolUnbound) || self.must_not_be_renamed {
            return SlotNamespace::SlotMustNotBeRenamed;
        }

        if self.kind.is_private() {
            return SlotNamespace::SlotPrivateName;
        }

        if matches!(self.kind, SymbolKind::SymbolLabel) {
            return SlotNamespace::SlotLabel;
        }

        SlotNamespace::SlotDefault
    }
}

#[repr(u8)]
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) enum SlotNamespace {
    SlotDefault,
    SlotLabel,
    SlotPrivateName,
    SlotMustNotBeRenamed,
}
