use serde::{Deserialize, Serialize};

use super::Merge;

#[derive(Clone, Serialize, Deserialize, Debug)]
#[serde(untagged)]
pub enum BoolOrObject<T> {
    Bool(bool),
    Obj(T),
}

impl<T> Default for BoolOrObject<T> {
    fn default() -> Self {
        Self::Bool(false)
    }
}

impl<T> BoolOrObject<T> {
    pub fn into_obj(self) -> Option<T>
    where
        T: Default,
    {
        match self {
            BoolOrObject::Bool(true) => Some(Default::default()),
            BoolOrObject::Bool(false) => None,
            BoolOrObject::Obj(o) => Some(o),
        }
    }
}

impl<T> Merge for BoolOrObject<T>
where
    T: Clone + Merge + Default,
{
    fn merge(&mut self, from: &Self) {
        match self {
            BoolOrObject::Bool(l) => match from {
                BoolOrObject::Bool(r) => {
                    *l |= *r;
                }
                BoolOrObject::Obj(_) => *self = from.clone(),
            },
            BoolOrObject::Obj(o) => match from {
                BoolOrObject::Bool(r) => {
                    if *r {
                        o.merge(&Default::default())
                    }
                }
                BoolOrObject::Obj(r) => o.merge(r),
            },
        }
    }
}
