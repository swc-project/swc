use swc_ecma_hooks::VisitMutHook;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    TraverseCtx,
};

mod block_scoped_fn;
mod duplicate_keys;
mod function_name;
mod instanceof;
mod shorthand;
mod sticky_regex;
mod typeof_symbol;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2015Options {
    /// Enable block scoped functions transformation
    pub block_scoped_functions: bool,

    /// Enable shorthand properties transformation
    pub shorthand: bool,

    /// Enable function name transformation
    pub function_name: bool,

    /// Enable duplicate keys transformation
    pub duplicate_keys: bool,

    /// Enable sticky regex transformation
    pub sticky_regex: bool,

    /// Enable instanceof transformation
    pub instanceof: bool,

    /// Enable typeof symbol transformation
    pub typeof_symbol: bool,
}

impl Es2015Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.block_scoped_functions
            || self.shorthand
            || self.function_name
            || self.duplicate_keys
            || self.sticky_regex
            || self.instanceof
            || self.typeof_symbol
    }
}

pub fn hook(options: Es2015Options) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    // Block scoped functions: { function f() {} } -> { let f = function f() {} }
    let hook = hook.chain(if options.block_scoped_functions {
        Some(self::block_scoped_fn::hook())
    } else {
        None
    });

    // Shorthand properties: { a } -> { a: a }
    let hook = hook.chain(if options.shorthand {
        Some(self::shorthand::hook())
    } else {
        None
    });

    // Function name: var f = function() {} -> var f = function f() {}
    let hook = hook.chain(if options.function_name {
        Some(self::function_name::hook())
    } else {
        None
    });

    // Duplicate keys: { a: 1, a: 2 } -> { a: 1, ["a"]: 2 }
    let hook = hook.chain(if options.duplicate_keys {
        Some(self::duplicate_keys::hook())
    } else {
        None
    });

    // Sticky regex: /foo/y -> new RegExp("foo", "y")
    let hook = hook.chain(if options.sticky_regex {
        Some(self::sticky_regex::hook())
    } else {
        None
    });

    // instanceof: a instanceof B -> _instanceof(a, B)
    let hook = hook.chain(if options.instanceof {
        Some(self::instanceof::hook())
    } else {
        None
    });

    // typeof symbol: typeof x -> _typeof(x)
    let hook = hook.chain(if options.typeof_symbol {
        Some(self::typeof_symbol::hook())
    } else {
        None
    });

    hook.build()
}
