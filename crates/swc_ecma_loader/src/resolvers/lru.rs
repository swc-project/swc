use std::num::NonZeroUsize;

use anyhow::Error;
use lru::LruCache;
use parking_lot::Mutex;
use swc_common::FileName;

use crate::resolve::{Resolution, Resolve};

#[derive(Debug)]
pub struct CachingResolver<R>
where
    R: Resolve,
{
    cache: Mutex<LruCache<(FileName, String), Resolution>>,
    inner: R,
}

impl<R> Default for CachingResolver<R>
where
    R: Resolve + Default,
{
    fn default() -> Self {
        Self::new(40, Default::default())
    }
}

impl<R> CachingResolver<R>
where
    R: Resolve,
{
    pub fn new(cap: usize, inner: R) -> Self {
        Self {
            cache: Mutex::new(LruCache::new(
                NonZeroUsize::try_from(cap).expect("cap == 0"),
            )),
            inner,
        }
    }
}

impl<R> Resolve for CachingResolver<R>
where
    R: Resolve,
{
    fn resolve(&self, base: &FileName, src: &str) -> Result<Resolution, Error> {
        {
            let mut lock = self.cache.lock();
            //
            if let Some(v) = lock.get(&(base.clone(), src.to_string())) {
                return Ok(v.clone());
            }
        }

        let resolved = self.inner.resolve(base, src)?;
        {
            let mut lock = self.cache.lock();
            lock.put((base.clone(), src.to_string()), resolved.clone());
        }

        Ok(resolved)
    }
}
