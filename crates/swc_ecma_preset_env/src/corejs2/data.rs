use crate::util::{PooledStr, SwcFold};

include!(concat!(env!("OUT_DIR"), "/corejs2_data/lib.rs"));

pub struct StaticProperty(&'static [(PooledStr, u32, u32)]);

pub fn builtin_types_get(query: &str) -> Option<impl ExactSizeIterator<Item = &'static str>> {
    let idx = BUILTIN_TYPES
        .binary_search_by(|(k, ..)| k.as_str().cmp(query))
        .ok()?;
    let (_, start, end) = BUILTIN_TYPES[idx];
    let iter = LIST_STORE[start as usize..end as usize]
        .iter()
        .map(|s| s.as_str());
    Some(iter)
}

pub fn instance_properties_get(query: &str) -> Option<impl ExactSizeIterator<Item = &'static str>> {
    let idx = INSTANCE_KEYS.get(query)?;
    let (start, end) = INSTANCE_PROPERTIES_VALUES[idx];
    let iter = LIST_STORE[start as usize..end as usize]
        .iter()
        .map(|s| s.as_str());
    Some(iter)
}

pub fn static_properties_get(query: &str) -> Option<StaticProperty> {
    let idx = STATIC_PROPERTIES
        .binary_search_by(|(k, ..)| k.as_str().cmp(query))
        .ok()?;
    let (_, start, end) = STATIC_PROPERTIES[idx];
    Some(StaticProperty(
        &STATIC_PROPERTIES_STORE[start as usize..end as usize],
    ))
}

impl StaticProperty {
    pub fn get(&self, query: &str) -> Option<impl ExactSizeIterator<Item = &'static str>> {
        let &(_, start, end) = self.0.iter().find(|(k, ..)| k.as_str() == query)?;
        let iter = LIST_STORE[start as usize..end as usize]
            .iter()
            .map(|s| s.as_str());
        Some(iter)
    }
}
