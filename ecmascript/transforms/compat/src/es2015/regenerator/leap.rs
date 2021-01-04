use super::case::Loc;
use is_macro::Is;
use smallvec::SmallVec;
use swc_atoms::JsWord;
use swc_ecma_utils::Id;

#[derive(Debug, Default)]
pub(super) struct LeapManager {
    stack: SmallVec<[Entry; 16]>,
}

impl LeapManager {
    pub fn push(&mut self, entry: Entry) {
        self.stack.push(entry);
    }
    pub fn pop(&mut self) -> Option<Entry> {
        self.stack.pop()
    }

    pub fn find_leap_loc<F>(&self, mut pred: F, label: Option<&JsWord>) -> Option<Loc>
    where
        F: FnMut(&Entry) -> Option<Loc>,
    {
        for entry in self.stack.iter().rev() {
            let loc = pred(entry);

            if let Some(loc) = loc {
                if label.is_some() {
                    let entry_label = match entry {
                        Entry::Labeled { label, .. } => Some(label),
                        Entry::Loop {
                            label: Some(label), ..
                        } => Some(label),
                        _ => None,
                    };

                    if label == entry_label {
                        return Some(loc);
                    }
                } else if entry.is_labeled() {
                } else {
                    return Some(loc);
                }
            }
        }

        None
    }
    pub fn find_break_loc(&self, label: Option<&JsWord>) -> Option<Loc> {
        self.find_leap_loc(
            |entry| match *entry {
                Entry::Labeled { break_loc, .. } => Some(break_loc),
                //                Entry::Fn { .. } => None,
                Entry::Loop { break_loc, .. } => Some(break_loc),
                Entry::Switch { break_loc, .. } => Some(break_loc),
                Entry::TryEntry { .. } => None,
                Entry::Catch(..) => None,
                Entry::Finally(..) => None,
            },
            label,
        )
    }

    pub fn find_continue_loc(&self, label: Option<&JsWord>) -> Option<Loc> {
        self.find_leap_loc(
            |entry| match *entry {
                Entry::Loop { continue_loc, .. } => Some(continue_loc),
                _ => None,
            },
            label,
        )
    }
}

#[derive(Debug)]
pub(super) struct WithEntry<'a> {
    manager: &'a mut LeapManager,
}

impl Drop for WithEntry<'_> {
    fn drop(&mut self) {
        self.manager.stack.pop();
    }
}

#[derive(Debug, Is)]
pub(super) enum Entry {
    Labeled {
        label: JsWord,
        break_loc: Loc,
    },

    //    Fn {
    //        return_loc: Loc,
    //    },
    Loop {
        break_loc: Loc,
        continue_loc: Loc,
        label: Option<JsWord>,
    },

    Switch {
        break_loc: Loc,
    },

    TryEntry(TryEntry),
    Catch(CatchEntry),
    Finally(FinallyEntry),
}

#[derive(Debug, Clone)]
pub(super) struct TryEntry {
    pub first_loc: Loc,
    pub catch_entry: Option<CatchEntry>,
    pub finally_entry: Option<FinallyEntry>,
}

#[derive(Debug, Clone)]
pub(super) struct CatchEntry {
    pub first_loc: Loc,
    pub param_id: Id,
}

#[derive(Debug, Clone)]
pub(super) struct FinallyEntry {
    pub first_loc: Loc,
    pub after_loc: Loc,
}
