pub use self::options::Optionds;

mod id;
mod option;
pub mod rules;

#[derive(Default)]
pub struct NameMangler {
    ids: FxHashMap<Id, Id>,
}

impl VisitMut for NameMangler {}
