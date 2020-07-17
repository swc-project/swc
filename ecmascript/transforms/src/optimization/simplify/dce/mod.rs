use self::side_effect::{ImportDetector, SideEffectVisitor};
use fxhash::FxHashSet;
use std::{any::type_name, borrow::Cow};
use swc_atoms::JsWord;
use swc_common::{
    chain,
    pass::{CompilerPass, Repeated},
    util::move_map::MoveMap,
    Fold, FoldWith, Mark, Span, Spanned, VisitWith,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id, StmtLike};

macro_rules! preserve {
    ($T:ty) => {
        impl Fold<$T> for Dce<'_> {
            fn fold(&mut self, mut node: $T) -> $T {
                node.span = node.span.apply_mark(self.config.used_mark);
                node
            }
        }
    };
}

mod decl;
mod module_decl;
mod side_effect;
mod stmt;

#[derive(Debug)]
pub struct Config<'a> {
    /// If this is [None], all exports are treated as used.
    pub used: Option<Cow<'a, [Id]>>,

    /// Mark used while performing dce.
    ///
    /// Should not be `Mark::root()`. Used to reduce allocation of [Mark].
    pub used_mark: Mark,
}

impl Default for Config<'_> {
    fn default() -> Self {
        Self {
            used: None,
            used_mark: Mark::fresh(Mark::root()),
        }
    }
}

pub fn dce<'a>(config: Config<'a>) -> impl RepeatedJsPass + 'a {
    assert_ne!(
        config.used_mark,
        Mark::root(),
        "dce cannot use Mark::root() as used_mark"
    );

    let used_mark = config.used_mark;

    chain!(
        Dce {
            config,
            dropped: false,
            included: Default::default(),
            changed: false,
            marking_phase: false,
            decl_dropping_phase: false,
        },
        UsedMarkRemover { used_mark }
    )
}

struct UsedMarkRemover {
    used_mark: Mark,
}

noop_fold_type!(UsedMarkRemover);

impl CompilerPass for UsedMarkRemover {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("dce-cleanup")
    }
}

impl Repeated for UsedMarkRemover {
    fn changed(&self) -> bool {
        false
    }

    fn reset(&mut self) {}
}

impl Fold<Span> for UsedMarkRemover {
    fn fold(&mut self, s: Span) -> Span {
        let mut ctxt = s.ctxt().clone();
        if ctxt.remove_mark() == self.used_mark {
            return s.with_ctxt(ctxt);
        }

        s
    }
}

#[derive(Debug)]
struct Dce<'a> {
    changed: bool,
    config: Config<'a>,

    /// Identifiers which should be emitted.
    included: FxHashSet<Id>,

    /// If true, idents are added to [included].
    marking_phase: bool,

    /// If false, the pass **ignores** imports.
    ///
    /// It means, imports are not marked (as used) nor removed.
    decl_dropping_phase: bool,

    dropped: bool,
}

impl CompilerPass for Dce<'_> {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("dce")
    }
}

impl Repeated for Dce<'_> {
    fn changed(&self) -> bool {
        self.dropped
    }

    fn reset(&mut self) {
        self.dropped = false;
        self.included = Default::default();
    }
}

impl<T> Fold<Vec<T>> for Dce<'_>
where
    T: StmtLike + FoldWith<Self> + Spanned + std::fmt::Debug,
    T: for<'any> VisitWith<SideEffectVisitor<'any>> + VisitWith<ImportDetector>,
{
    fn fold(&mut self, mut items: Vec<T>) -> Vec<T> {
        let old = self.changed;

        let mut preserved = FxHashSet::default();
        preserved.reserve(items.len());

        loop {
            log::info!("loop start");

            self.changed = false;
            let mut idx = 0u32;
            items = items.move_map(|mut item| {
                let item = if preserved.contains(&idx) {
                    item
                } else {
                    if self.should_include(&item) {
                        preserved.insert(idx);
                        self.changed = true;
                        item = item.fold_with(self);
                    }
                    item
                };

                idx += 1;
                item
            });

            if !self.changed {
                items = items.move_map(|item| item.fold_with(self));
            }

            if !self.changed {
                break;
            }
        }

        {
            let mut idx = 0;
            items = items.move_flat_map(|item| {
                let item = self.drop_unused_decls(item);
                let item = match item.try_into_stmt() {
                    Ok(stmt) => match stmt {
                        Stmt::Empty(..) => {
                            self.dropped = true;
                            idx += 1;
                            return None;
                        }
                        _ => T::from_stmt(stmt),
                    },
                    Err(item) => item,
                };

                if !preserved.contains(&idx) {
                    self.dropped = true;
                    idx += 1;
                    return None;
                }

                idx += 1;
                // Drop unused imports
                if self.is_marked(item.span()) {
                    Some(item)
                } else {
                    None
                }
            });
        }

        self.changed = old;

        items
    }
}

impl Dce<'_> {
    pub fn is_marked(&self, span: Span) -> bool {
        let mut ctxt = span.ctxt().clone();

        loop {
            let mark = ctxt.remove_mark();

            if mark == Mark::root() {
                return false;
            }

            if mark == self.config.used_mark {
                return true;
            }
        }
    }

    pub fn should_preserve_export(&self, i: &JsWord) -> bool {
        self.config.used.is_none()
            || self
                .config
                .used
                .as_ref()
                .unwrap()
                .iter()
                .any(|exported| exported.0 == *i)
    }

    //    pub fn with_child<T, F>(&mut self, op: F) -> T
    //    where
    //        F: for<'any> FnOnce(&mut Dce<'any>) -> T,
    //    {
    //        let mut child = Dce {
    //            changed: false,
    //            config: Config {
    //                used: self.config.used.as_ref().map(|v| Cow::Borrowed(&**v)),
    //                ..self.config
    //            },
    //            included: Default::default(),
    //            marking_phase: false,
    //            dropped: false,
    //        };
    //
    //        let ret = op(&mut child);
    //
    //        self.changed |= child.changed;
    //        self.dropped |= child.dropped;
    //        self.included.extend(child.included);
    //
    //        ret
    //    }

    pub fn fold_in_marking_phase<T>(&mut self, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let old = self.marking_phase;
        self.marking_phase = true;
        log::info!("Marking: {}", type_name::<T>());
        let node = node.fold_with(self);
        self.marking_phase = old;

        node
    }

    pub fn drop_unused_decls<T>(&mut self, node: T) -> T
    where
        T: FoldWith<Self>,
    {
        let old = self.decl_dropping_phase;
        self.decl_dropping_phase = true;
        let node = node.fold_with(self);
        self.decl_dropping_phase = old;

        node
    }
}

impl Fold<Ident> for Dce<'_> {
    fn fold(&mut self, i: Ident) -> Ident {
        if self.is_marked(i.span) {
            return i;
        }

        if self.marking_phase {
            if self.included.insert(i.to_id()) {
                log::info!("{} is used", i.sym);
                self.changed = true;
            }
        }

        i
    }
}

impl Fold<MemberExpr> for Dce<'_> {
    fn fold(&mut self, mut e: MemberExpr) -> MemberExpr {
        if self.is_marked(e.span()) {
            return e;
        }

        e.obj = e.obj.fold_with(self);
        if e.computed {
            e.prop = e.prop.fold_with(self);
        }

        e
    }
}

impl Fold<UpdateExpr> for Dce<'_> {
    fn fold(&mut self, mut node: UpdateExpr) -> UpdateExpr {
        if self.is_marked(node.span) {
            return node;
        }

        node.span = node.span.apply_mark(self.config.used_mark);
        node.arg = self.fold_in_marking_phase(node.arg);

        node
    }
}
