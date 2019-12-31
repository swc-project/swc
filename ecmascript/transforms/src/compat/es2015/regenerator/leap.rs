use super::case::Loc;
use crate::util::Id;
use is_macro::Is;
use smallvec::SmallVec;
use swc_atoms::JsWord;

#[derive(Debug, Default)]
pub(super) struct LeapManager {
    stack: SmallVec<[Entry; 16]>,
}

impl LeapManager {
    pub fn with<F, Ret>(&mut self, entry: Entry, op: F) -> Ret
    where
        F: FnOnce(&mut Self) -> Ret,
    {
        let prev_len = self.stack.len();

        self.stack.push(entry);

        let ret = op(self);

        self.stack.pop();
        assert_eq!(prev_len, self.stack.len());

        ret
    }

    pub fn find_leap_loc<F>(&self, pred: F, label: Option<JsWord>) -> Option<Loc>
    where
        F: FnMut(&Entry) -> Option<Loc>,
    {
        for (i, entry) in self.stack.iter().enumerate().rev() {
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

                    if label.as_ref() == entry_label {
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
    pub fn find_break_loc(&self, label: Option<JsWord>) -> Option<Loc> {
        self.find_leap_loc(
            |entry| match *entry {
                Entry::Labeled { break_loc, .. } => Some(break_loc),
                Entry::Fn { .. } => None,
                Entry::Loop { break_loc, .. } => Some(break_loc),
                Entry::Switch { break_loc, .. } => Some(break_loc),
                Entry::Try { .. } => None,
            },
            label,
        )
    }

    pub fn find_continue_loc(&self, label: Option<JsWord>) -> Option<Loc> {
        self.find_leap_loc(
            |entry| match *entry {
                Entry::Loop { continue_loc, .. } => Some(continue_loc),
                _ => None,
            },
            label,
        )
    }
}

#[derive(Debug, Is)]
pub(super) enum Entry {
    Labeled {
        label: JsWord,
        break_loc: Loc,
    },

    Fn {
        return_loc: Loc,
    },

    Loop {
        break_loc: Loc,
        continue_loc: Loc,
        label: Option<JsWord>,
    },

    Switch {
        break_loc: Loc,
    },

    Try {
        first_loc: Loc,
        catch_entry: Option<CatchEntry>,
        finally_entry: Option<FinallyEntry>,
    },
}

#[derive(Debug)]
pub(super) struct CatchEntry {
    pub first_loc: Loc,
    pub param_id: Id,
}

#[derive(Debug)]
pub(super) struct FinallyEntry {
    pub first_loc: Loc,
    pub after_loc: Loc,
}
