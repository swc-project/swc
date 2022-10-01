// Copyright 2012-2014 The Rust Project Developers. See the COPYRIGHT
// file at the top-level directory of this distribution and at
// http://rust-lang.org/COPYRIGHT.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

//! Machinery for hygienic macros, inspired by the `MTWT[1]` paper.
//!
//! `[1]` Matthew Flatt, Ryan Culpepper, David Darais, and Robert Bruce Findler.
//! 2012. *Macros that work together: Compile-time bindings, partial expansion,
//! and definition contexts*. J. Funct. Program. 22, 2 (March 2012), 181-216.
//! DOI=10.1017/S0956796812000093 <https://doi.org/10.1017/S0956796812000093>

#[allow(unused)]
use std::{
    collections::{HashMap, HashSet},
    fmt,
};

#[cfg(feature = "rkyv-bytecheck-impl")]
use rkyv_latest as rkyv;
use serde::{Deserialize, Serialize};

use super::GLOBALS;
use crate::collections::AHashMap;

/// A SyntaxContext represents a chain of macro expansions (represented by
/// marks).
#[derive(Clone, Copy, PartialEq, Eq, Default, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(transparent)]
#[cfg_attr(
    any(feature = "rkyv-impl", feature = "rkyv-bytecheck-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct SyntaxContext(#[cfg_attr(feature = "__rkyv", omit_bounds)] u32);

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for SyntaxContext {
    fn arbitrary(_: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        Ok(SyntaxContext::empty())
    }
}

#[allow(unused)]
#[derive(Copy, Clone, Debug)]
struct SyntaxContextData {
    outer_mark: Mark,
    prev_ctxt: SyntaxContext,
    // This context, but with all transparent and semi-transparent marks filtered away.
    opaque: SyntaxContext,
}

/// A mark is a unique id associated with a macro expansion.
#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
pub struct Mark(u32);

#[allow(unused)]
#[derive(Clone, Debug)]
struct MarkData {
    parent: Mark,
    is_builtin: bool,
}

#[cfg_attr(
    any(feature = "rkyv-impl", feature = "rkyv-bytecheck-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct MutableMarkContext(pub u32, pub u32, pub u32);

// List of proxy calls injected by the host in the plugin's runtime context.
// When related calls being executed inside of the plugin, it'll call these
// proxies instead which'll call actual host fn.
extern "C" {
    // Instead of trying to copy-serialize `Mark`, this fn directly consume
    // inner raw value as well as fn and let each context constructs struct
    // on their side.
    fn __mark_fresh_proxy() -> u32;
    fn __mark_is_builtin_proxy(self_mark: u32) -> u32;
    fn __mark_set_builtin_proxy(self_mark: u32, is_builtin: u32);
    fn __syntax_context_apply_mark_proxy(self_syntax_context: u32, mark: u32) -> u32;
    fn __syntax_context_outer_proxy(self_mark: u32) -> u32;

    // These are proxy fn uses serializable context to pass forward mutated param
    // with return value back to the guest.
    fn __mark_is_descendant_of_proxy(self_mark: u32, ancestor: u32, allocated_ptr: i32);
    fn __mark_least_ancestor(a: u32, b: u32, allocated_ptr: i32);
    fn __syntax_context_remove_mark_proxy(self_mark: u32, allocated_ptr: i32);
}

impl Mark {
    /// Shortcut for `Mark::fresh()`
    #[allow(clippy::new_without_default)]
    pub fn new() -> Self {
        Mark::fresh()
    }

    pub fn fresh() -> Self {
        // Note: msvc tries to link against proxied fn for normal build,
        // have to limit build target to wasm only to avoid it.
        #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
        return Mark(unsafe { __mark_fresh_proxy() });

        // https://github.com/swc-project/swc/pull/3492#discussion_r802224857
        // We loosen conditions here for the cases like running plugin's test without
        // targeting wasm32-*.
        #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
        return GLOBALS.with(|globals| {
            let count = globals
                .mark_count
                .fetch_add(1, std::sync::atomic::Ordering::SeqCst);
            Mark(count)
        });
        // return HygieneData::with(|data| {
        //     // let ret = Mark(data.mark_count);
        //     // data.mark_count += 1;
        //     // ret
        // });
    }

    /// The mark of the theoretical expansion that generates freshly parsed,
    /// unexpanded AST.
    #[inline]
    pub const fn root() -> Self {
        Mark(0)
    }

    #[inline]
    pub fn as_u32(self) -> u32 {
        self.0
    }

    #[inline]
    pub fn from_u32(raw: u32) -> Mark {
        Mark(raw)
    }

    #[allow(unused_mut, unused_assignments)]
    #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
    pub fn least_ancestor(mut a: Mark, mut b: Mark) -> Mark {
        let serialized = crate::plugin::serialized::PluginSerializedBytes::try_serialize(
            &MutableMarkContext(0, 0, 0),
        )
        .expect("Should be serializable");
        let (ptr, len) = serialized.as_ptr();

        unsafe {
            __mark_least_ancestor(a.0, b.0, ptr as _);
        }

        let context: MutableMarkContext = unsafe {
            crate::plugin::serialized::deserialize_from_ptr(
                ptr,
                len.try_into().expect("Should able to convert ptr length"),
            )
            .expect("Should able to deserialize")
        };
        a = Mark::from_u32(context.0);
        b = Mark::from_u32(context.1);

        return Mark(context.2);
    }
}

#[allow(unused)]
#[derive(Debug)]
pub(crate) struct HygieneData {
    syntax_contexts: Vec<SyntaxContextData>,
    markings: AHashMap<(SyntaxContext, Mark), SyntaxContext>,
}

impl Default for HygieneData {
    fn default() -> Self {
        Self::new()
    }
}

impl HygieneData {
    pub(crate) fn new() -> Self {
        HygieneData {
            syntax_contexts: vec![SyntaxContextData {
                outer_mark: Mark::root(),
                prev_ctxt: SyntaxContext(0),
                opaque: SyntaxContext(0),
            }],
            markings: HashMap::default(),
            // mark_count: 1,
        }
    }

    fn with<T, F: FnOnce(&mut HygieneData) -> T>(f: F) -> T {
        GLOBALS.with(|globals| {
            #[cfg(feature = "parking_lot")]
            return f(&mut globals.hygiene_data.lock());

            #[cfg(not(feature = "parking_lot"))]
            return f(&mut *globals.hygiene_data.lock().unwrap());
        })
    }
}

// pub fn clear_markings() {
//     HygieneData::with(|data| data.markings = HashMap::default());
// }

impl SyntaxContext {
    pub const fn empty() -> Self {
        SyntaxContext(0)
    }

    /// Returns `true` if `self` is marked with `mark`.
    ///
    /// Panics if `mark` is not a valid mark.
    pub fn has_mark(self, mark: Mark) -> bool {
        debug_assert_ne!(
            mark,
            Mark::root(),
            "Cannot check if a span contains a `ROOT` mark"
        );

        let mut ctxt = self;

        loop {
            if ctxt == SyntaxContext::empty() {
                return false;
            }

            let m = ctxt.remove_mark();
            if m == mark {
                return true;
            }
            if m == Mark::root() {
                return false;
            }
        }
    }

    #[inline]
    pub fn as_u32(self) -> u32 {
        self.0
    }

    #[inline]
    pub fn from_u32(raw: u32) -> SyntaxContext {
        SyntaxContext(raw)
    }

    /// Extend a syntax context with a given mark and default transparency for
    /// that mark.
    pub fn apply_mark(self, mark: Mark) -> SyntaxContext {
        #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
        return unsafe { SyntaxContext(__syntax_context_apply_mark_proxy(self.0, mark.0)) };

        #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
        {
            assert_ne!(mark, Mark::root());
            self.apply_mark_internal(mark)
        }
    }

    #[allow(unused)]
    fn apply_mark_internal(self, mark: Mark) -> SyntaxContext {
        HygieneData::with(|data| {
            let syntax_contexts = &mut data.syntax_contexts;
            let mut opaque = syntax_contexts[self.0 as usize].opaque;

            let prev_ctxt = opaque;
            opaque = *data.markings.entry((prev_ctxt, mark)).or_insert_with(|| {
                let new_opaque = SyntaxContext(syntax_contexts.len() as u32);
                syntax_contexts.push(SyntaxContextData {
                    outer_mark: mark,
                    prev_ctxt,
                    opaque: new_opaque,
                });
                new_opaque
            });

            let prev_ctxt = self;
            *data.markings.entry((prev_ctxt, mark)).or_insert_with(|| {
                let new_opaque_and_semitransparent_and_transparent =
                    SyntaxContext(syntax_contexts.len() as u32);
                syntax_contexts.push(SyntaxContextData {
                    outer_mark: mark,
                    prev_ctxt,
                    opaque,
                });
                new_opaque_and_semitransparent_and_transparent
            })
        })
    }

    #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
    pub fn remove_mark(&mut self) -> Mark {
        let context = MutableMarkContext(0, 0, 0);
        let serialized = crate::plugin::serialized::PluginSerializedBytes::try_serialize(&context)
            .expect("Should be serializable");
        let (ptr, len) = serialized.as_ptr();

        unsafe {
            __syntax_context_remove_mark_proxy(self.0, ptr as _);
        }

        let context: MutableMarkContext = unsafe {
            crate::plugin::serialized::deserialize_from_ptr(
                ptr,
                len.try_into().expect("Should able to convert ptr length"),
            )
            .expect("Should able to deserialize")
        };

        *self = SyntaxContext(context.0);

        return Mark::from_u32(context.2);
    }

    /// Pulls a single mark off of the syntax context. This effectively moves
    /// the context up one macro definition level. That is, if we have a
    /// nested macro definition as follows:
    ///
    /// ```rust,ignore
    /// macro_rules! f {
    ///    macro_rules! g {
    ///        ...
    ///    }
    /// }
    /// ```
    ///
    /// and we have a SyntaxContext that is referring to something declared by
    /// an invocation of g (call it g1), calling remove_mark will result in
    /// the SyntaxContext for the invocation of f that created g1.
    /// Returns the mark that was removed.
    #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
    pub fn remove_mark(&mut self) -> Mark {
        HygieneData::with(|data| {
            let outer_mark = data.syntax_contexts[self.0 as usize].outer_mark;
            *self = data.syntax_contexts[self.0 as usize].prev_ctxt;
            outer_mark
        })
    }

    #[inline]
    pub fn outer(self) -> Mark {
        #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
        return unsafe { Mark(__syntax_context_outer_proxy(self.0)) };

        #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
        HygieneData::with(|data| data.syntax_contexts[self.0 as usize].outer_mark)
    }
}

impl fmt::Debug for SyntaxContext {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "#{}", self.0)
    }
}

impl Default for Mark {
    fn default() -> Self {
        Mark::root()
    }
}
