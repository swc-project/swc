use serde::{Deserialize, Serialize};

use crate::merge::Merge;

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct MergingOption<T>(Option<T>)
where
    T: Merge + Default;

impl<T> MergingOption<T>
where
    T: Merge + Default,
{
    pub fn into_inner(self) -> Option<T> {
        self.0
    }
}

impl<T> Merge for MergingOption<T>
where
    T: Merge + Default,
{
    fn merge(&mut self, other: Self) {
        match other.0 {
            Some(other) => {
                if self.0.is_none() {
                    *self = Default::default();
                }

                self.0.as_mut().unwrap().merge(other);
            }
            None => {}
        }
    }
}
