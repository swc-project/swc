use std::fmt;

use crate::util::{PooledStr, SwcFold};

#[derive(Clone, Copy)]
pub(crate) struct CoreJSPolyfillDescriptor {
    name: u32,
    pure: u32,
    global: u32,
    exclude: u32,
}

include!(concat!(env!("OUT_DIR"), "/corejs3_builtin/lib.rs"));

pub struct StaticProperty(&'static [(PooledStr, (u32, u32, u32, u32))]);

pub fn builtin_types_get(query: &str) -> Option<CoreJSPolyfillDescriptor> {
    let idx = BUILTIN_INDEX.get(query)?;
    let (name, pure, global, exclude) = BUILTINS_VALUES[idx];
    Some(CoreJSPolyfillDescriptor {
        pure,
        global,
        name,
        exclude,
    })
}

pub fn instance_properties_get(query: &str) -> Option<CoreJSPolyfillDescriptor> {
    let idx = INSTRANCE_PROPS_INDEX.get(query)?;
    let (name, pure, global, exclude) = INSTRANCE_PROPS_VALUES[idx];
    Some(CoreJSPolyfillDescriptor {
        pure,
        global,
        name,
        exclude,
    })
}

pub fn static_properties_get(query: &str) -> Option<StaticProperty> {
    let idx = STATIC_PROPS_INDEX.get(query)?;
    let (start, end) = STATIC_PROPS_LIST[idx];
    Some(StaticProperty(
        &STATIC_PROPS_STORE[start as usize..end as usize],
    ))
}

impl StaticProperty {
    pub fn get(&self, query: &str) -> Option<CoreJSPolyfillDescriptor> {
        let idx = self
            .0
            .binary_search_by_key(&query, |(k, ..)| k.as_str())
            .ok()?;
        let (_, (name, pure, global, exclude)) = self.0[idx];
        Some(CoreJSPolyfillDescriptor {
            pure,
            global,
            name,
            exclude,
        })
    }
}

impl CoreJSPolyfillDescriptor {
    pub fn name(&self) -> &'static str {
        PooledStr(self.name).as_str()
    }

    pub fn pure(&self) -> Option<&'static str> {
        (self.pure != 0).then(|| PooledStr(self.pure).as_str())
    }

    pub fn global(&self) -> impl ExactSizeIterator<Item = &'static str> {
        use precomputed_map::store::AccessSeq;

        let (offset, len) = unpack_store(self.global);
        (offset..offset + len)
            .map(|idx| GlobalStore::index(idx).unwrap())
            .map(|idx| PooledStr(idx).as_str())
    }

    pub fn exclude(&self) -> impl ExactSizeIterator<Item = &'static str> {
        use precomputed_map::store::AccessSeq;

        let (offset, len) = unpack_store(self.exclude);
        (offset..offset + len)
            .map(|idx| ExcludeStore::index(idx).unwrap())
            .map(|idx| PooledStr(idx).as_str())
    }
}

pub fn common_iterators() -> impl ExactSizeIterator<Item = &'static str> {
    COMMON_ITERATORS.iter().map(|s| s.as_str())
}

pub fn promise_dependencies() -> impl ExactSizeIterator<Item = &'static str> {
    PROMISE_DEPENDENCIES.iter().map(|s| s.as_str())
}

fn unpack_store(id: u32) -> (usize, usize) {
    let offset = id & ((1 << 24) - 1);
    let len = id >> 24;
    (offset as usize, len as usize)
}

impl fmt::Debug for CoreJSPolyfillDescriptor {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("CoreJSPolyfillDescriptor")
            .field("name", &self.name())
            .finish_non_exhaustive()
    }
}
