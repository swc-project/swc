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

use serde::{Deserialize, Serialize};

use super::GLOBALS;
use crate::{collections::AHashMap, EqIgnoreSpan};

/// A SyntaxContext represents a chain of macro expansions (represented by
/// marks).
#[derive(Clone, Copy, PartialEq, Eq, Default, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(transparent)]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct SyntaxContext(#[cfg_attr(feature = "__rkyv", rkyv(omit_bounds))] u32);

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for SyntaxContext {
    fn arbitrary(_: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        Ok(SyntaxContext::empty())
    }
}

better_scoped_tls::scoped_tls!(static EQ_IGNORE_SPAN_IGNORE_CTXT: ());

impl EqIgnoreSpan for SyntaxContext {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self == other || EQ_IGNORE_SPAN_IGNORE_CTXT.is_set()
    }
}

impl SyntaxContext {
    /// In `op`, [EqIgnoreSpan] of [Ident] will ignore the syntax context.
    pub fn within_ignored_ctxt<F, Ret>(op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        EQ_IGNORE_SPAN_IGNORE_CTXT.set(&(), op)
    }
}

#[allow(unused)]
#[derive(Copy, Clone, Debug)]
struct SyntaxContextData {
    outer_mark: Mark,
    prev_ctxt: SyntaxContext,
    opaque: SyntaxContext,
}

/// A mark is a unique id associated with a macro expansion.
#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
pub struct Mark(u32);

#[allow(unused)]
#[derive(Clone, Debug)]
pub(crate) struct MarkData {
    pub(crate) parent: Mark,
}

#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct MutableMarkContext(pub u32, pub u32, pub u32);

// List of proxy calls injected by the host in the plugin's runtime context.
// When related calls being executed inside of the plugin, it'll call these
// proxies instead which'll call actual host fn.
extern "C" {
    // Instead of trying to copy-serialize `Mark`, this fn directly consume
    // inner raw value as well as fn and let each context constructs struct
    // on their side.
    fn __mark_fresh_proxy(mark: u32) -> u32;
    fn __mark_parent_proxy(self_mark: u32) -> u32;
    fn __syntax_context_apply_mark_proxy(self_syntax_context: u32, mark: u32) -> u32;
    fn __syntax_context_outer_proxy(self_mark: u32) -> u32;

    // These are proxy fn uses serializable context to pass forward mutated param
    // with return value back to the guest.
    fn __mark_is_descendant_of_proxy(self_mark: u32, ancestor: u32, allocated_ptr: i32);
    fn __mark_least_ancestor(a: u32, b: u32, allocated_ptr: i32);
    fn __syntax_context_remove_mark_proxy(self_mark: u32, allocated_ptr: i32);
}

impl Mark {
    /// Shortcut for `Mark::fresh(Mark::root())`
    #[track_caller]
    #[allow(clippy::new_without_default)]
    pub fn new() -> Self {
        Mark::fresh(Mark::root())
    }

    #[track_caller]
    pub fn fresh(parent: Mark) -> Self {
        // Note: msvc tries to link against proxied fn for normal build,
        // have to limit build target to wasm only to avoid it.
        #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
        return Mark(unsafe { __mark_fresh_proxy(parent.as_u32()) });

        // https://github.com/swc-project/swc/pull/3492#discussion_r802224857
        // We loosen conditions here for the cases like running plugin's test without
        // targeting wasm32-*.
        #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
        return with_marks(|marks| {
            marks.push(MarkData { parent });
            Mark(marks.len() as u32 - 1)
        });
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

    #[inline]
    pub fn parent(self) -> Mark {
        #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
        return Mark(unsafe { __mark_parent_proxy(self.0) });

        #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
        return with_marks(|marks| marks[self.0 as usize].parent);
    }

    #[allow(unused_assignments)]
    #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
    pub fn is_descendant_of(mut self, ancestor: Mark) -> bool {
        // This code path executed inside of the guest memory context.
        // In here, preallocate memory for the context.

        use crate::plugin::serialized::VersionedSerializable;
        let serialized = crate::plugin::serialized::PluginSerializedBytes::try_serialize(
            &VersionedSerializable::new(MutableMarkContext(0, 0, 0)),
        )
        .expect("Should be serializable");
        let (ptr, len) = serialized.as_ptr();

        // Calling host proxy fn. Inside of host proxy, host will
        // write the result into allocated context in the guest memory space.
        unsafe {
            __mark_is_descendant_of_proxy(self.0, ancestor.0, ptr as _);
        }

        // Deserialize result, assign / return values as needed.
        let context: MutableMarkContext =
            crate::plugin::serialized::PluginSerializedBytes::from_raw_ptr(
                ptr,
                len.try_into().expect("Should able to convert ptr length"),
            )
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();

        self = Mark::from_u32(context.0);

        return context.2 != 0;
    }

    #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
    pub fn is_descendant_of(mut self, ancestor: Mark) -> bool {
        with_marks(|marks| {
            while self != ancestor {
                if self == Mark::root() {
                    return false;
                }
                self = marks[self.0 as usize].parent;
            }
            true
        })
    }

    #[allow(unused_mut, unused_assignments)]
    #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
    pub fn least_ancestor(mut a: Mark, mut b: Mark) -> Mark {
        use crate::plugin::serialized::VersionedSerializable;

        let serialized = crate::plugin::serialized::PluginSerializedBytes::try_serialize(
            &VersionedSerializable::new(MutableMarkContext(0, 0, 0)),
        )
        .expect("Should be serializable");
        let (ptr, len) = serialized.as_ptr();

        unsafe {
            __mark_least_ancestor(a.0, b.0, ptr as _);
        }

        let context: MutableMarkContext =
            crate::plugin::serialized::PluginSerializedBytes::from_raw_ptr(
                ptr,
                len.try_into().expect("Should able to convert ptr length"),
            )
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();
        a = Mark::from_u32(context.0);
        b = Mark::from_u32(context.1);

        return Mark(context.2);
    }

    /// Computes a mark such that both input marks are descendants of (or equal
    /// to) the returned mark. That is, the following holds:
    ///
    /// ```rust,ignore
    /// let la = least_ancestor(a, b);
    /// assert!(a.is_descendant_of(la))
    /// assert!(b.is_descendant_of(la))
    /// ```
    #[allow(unused_mut)]
    #[cfg(not(all(feature = "__plugin_mode", target_arch = "wasm32")))]
    pub fn least_ancestor(mut a: Mark, mut b: Mark) -> Mark {
        with_marks(|marks| {
            // Compute the path from a to the root
            let mut a_path = HashSet::<Mark>::default();
            while a != Mark::root() {
                a_path.insert(a);
                a = marks[a.0 as usize].parent;
            }

            // While the path from b to the root hasn't intersected, move up the tree
            while !a_path.contains(&b) {
                b = marks[b.0 as usize].parent;
            }

            b
        })
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
        }
    }

    fn with<T, F: FnOnce(&mut HygieneData) -> T>(f: F) -> T {
        GLOBALS.with(|globals| {
            #[cfg(feature = "parking_lot")]
            return f(&mut globals.hygiene_data.lock());

            #[cfg(not(feature = "parking_lot"))]
            return f(&mut globals.hygiene_data.lock().unwrap());
        })
    }
}

#[track_caller]
#[allow(unused)]
pub(crate) fn with_marks<T, F: FnOnce(&mut Vec<MarkData>) -> T>(f: F) -> T {
    GLOBALS.with(|globals| {
        #[cfg(feature = "parking_lot")]
        return f(&mut globals.marks.lock());

        #[cfg(not(feature = "parking_lot"))]
        return f(&mut globals.marks.lock().unwrap());
    })
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
            *data.markings.entry((prev_ctxt, mark)).or_insert_with(|| {
                let new_opaque = SyntaxContext(syntax_contexts.len() as u32);
                syntax_contexts.push(SyntaxContextData {
                    outer_mark: mark,
                    prev_ctxt,
                    opaque: new_opaque,
                });
                new_opaque
            })
        })
    }

    #[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
    pub fn remove_mark(&mut self) -> Mark {
        use crate::plugin::serialized::VersionedSerializable;

        let context = VersionedSerializable::new(MutableMarkContext(0, 0, 0));
        let serialized = crate::plugin::serialized::PluginSerializedBytes::try_serialize(&context)
            .expect("Should be serializable");
        let (ptr, len) = serialized.as_ptr();

        unsafe {
            __syntax_context_remove_mark_proxy(self.0, ptr as _);
        }

        let context: MutableMarkContext =
            crate::plugin::serialized::PluginSerializedBytes::from_raw_ptr(
                ptr,
                len.try_into().expect("Should able to convert ptr length"),
            )
            .deserialize()
            .expect("Should able to deserialize")
            .into_inner();

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

    /// Adjust this context for resolution in a scope created by the given
    /// expansion. For example, consider the following three resolutions of
    /// `f`:
    ///
    /// ```rust,ignore
    /// mod foo {
    ///     pub fn f() {}
    /// } // `f`'s `SyntaxContext` is empty.
    /// m!(f);
    /// macro m($f:ident) {
    ///     mod bar {
    ///         pub fn f() {} // `f`'s `SyntaxContext` has a single `Mark` from `m`.
    ///         pub fn $f() {} // `$f`'s `SyntaxContext` is empty.
    ///     }
    ///     foo::f(); // `f`'s `SyntaxContext` has a single `Mark` from `m`
    ///               //^ Since `mod foo` is outside this expansion, `adjust` removes the mark from `f`,
    ///               //| and it resolves to `::foo::f`.
    ///     bar::f(); // `f`'s `SyntaxContext` has a single `Mark` from `m`
    ///               //^ Since `mod bar` not outside this expansion, `adjust` does not change `f`,
    ///               //| and it resolves to `::bar::f`.
    ///     bar::$f(); // `f`'s `SyntaxContext` is empty.
    ///                //^ Since `mod bar` is not outside this expansion, `adjust` does not change `$f`,
    ///                //| and it resolves to `::bar::$f`.
    /// }
    /// ```
    /// This returns the expansion whose definition scope we use to privacy
    /// check the resolution, or `None` if we privacy check as usual (i.e.
    /// not w.r.t. a macro definition scope).
    pub fn adjust(&mut self, expansion: Mark) -> Option<Mark> {
        let mut scope = None;
        while !expansion.is_descendant_of(self.outer()) {
            scope = Some(self.remove_mark());
        }
        scope
    }

    /// Adjust this context for resolution in a scope created by the given
    /// expansion via a glob import with the given `SyntaxContext`.
    /// For example:
    ///
    /// ```rust,ignore
    /// m!(f);
    /// macro m($i:ident) {
    ///     mod foo {
    ///         pub fn f() {} // `f`'s `SyntaxContext` has a single `Mark` from `m`.
    ///         pub fn $i() {} // `$i`'s `SyntaxContext` is empty.
    ///     }
    ///     n(f);
    ///     macro n($j:ident) {
    ///         use foo::*;
    ///         f(); // `f`'s `SyntaxContext` has a mark from `m` and a mark from `n`
    ///              //^ `glob_adjust` removes the mark from `n`, so this resolves to `foo::f`.
    ///         $i(); // `$i`'s `SyntaxContext` has a mark from `n`
    ///               //^ `glob_adjust` removes the mark from `n`, so this resolves to `foo::$i`.
    ///         $j(); // `$j`'s `SyntaxContext` has a mark from `m`
    ///               //^ This cannot be glob-adjusted, so this is a resolution error.
    ///     }
    /// }
    /// ```
    /// This returns `None` if the context cannot be glob-adjusted.
    /// Otherwise, it returns the scope to use when privacy checking (see
    /// `adjust` for details).
    pub fn glob_adjust(
        &mut self,
        expansion: Mark,
        mut glob_ctxt: SyntaxContext,
    ) -> Option<Option<Mark>> {
        let mut scope = None;
        while !expansion.is_descendant_of(glob_ctxt.outer()) {
            scope = Some(glob_ctxt.remove_mark());
            if self.remove_mark() != scope.unwrap() {
                return None;
            }
        }
        if self.adjust(expansion).is_some() {
            return None;
        }
        Some(scope)
    }

    /// Undo `glob_adjust` if possible:
    ///
    /// ```rust,ignore
    /// if let Some(privacy_checking_scope) = self.reverse_glob_adjust(expansion, glob_ctxt) {
    ///     assert!(self.glob_adjust(expansion, glob_ctxt) == Some(privacy_checking_scope));
    /// }
    /// ```
    pub fn reverse_glob_adjust(
        &mut self,
        expansion: Mark,
        mut glob_ctxt: SyntaxContext,
    ) -> Option<Option<Mark>> {
        if self.adjust(expansion).is_some() {
            return None;
        }

        let mut marks = Vec::new();
        while !expansion.is_descendant_of(glob_ctxt.outer()) {
            marks.push(glob_ctxt.remove_mark());
        }

        let scope = marks.last().cloned();
        while let Some(mark) = marks.pop() {
            *self = self.apply_mark(mark);
        }
        Some(scope)
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
    #[track_caller]
    fn default() -> Self {
        Mark::new()
    }
}
