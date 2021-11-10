use crate::resolve::Resolve;
use anyhow::Error;
use lru::LruCache;
use std::sync::Mutex;
use swc_common::FileName;

#[derive(Debug)]
pub struct CachingResolver<R>
where
    R: Resolve,
{
    cache: Mutex<LruCache<(FileName, String), FileName>>,
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
            cache: Mutex::new(LruCache::new(cap)),
            inner,
        }
    }
}

impl<R> Resolve for CachingResolver<R>
where
    R: Resolve,
{
    fn resolve(&self, base: &FileName, src: &str) -> Result<FileName, Error> {
        {
            let lock = self.cache.lock();
            match lock {
                Ok(mut lock) => {
                    //
                    if let Some(v) = lock.get(&(base.clone(), src.to_string())) {
                        return Ok(v.clone());
                    }
                }
                Err(_) => {}
            }
        }

        let resolved = self.inner.resolve(base, src)?;
        {
            let lock = self.cache.lock();
            match lock {
                Ok(mut lock) => {
                    lock.put((base.clone(), src.to_string()), resolved.clone());
                }
                Err(_) => {}
            }
        }

        Ok(resolved)
    }
}
