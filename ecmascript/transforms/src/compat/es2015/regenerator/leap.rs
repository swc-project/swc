use super::case::Loc;
use crate::util::Id;
use swc_atoms::JsWord;

#[derive(Debug)]
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
