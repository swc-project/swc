pub(crate) struct SwcFold;

impl precomputed_map::phf::HashOne for SwcFold {
    fn hash_one<T: std::hash::Hash>(k: u64, v: T) -> u64 {
        use std::hash::Hasher;

        let mut hasher =
            foldhash::fast::FoldHasher::with_seed(k, foldhash::SharedSeed::global_fixed());
        v.hash(&mut hasher);
        hasher.finish()
    }
}

#[derive(Clone, Copy)]
pub(crate) struct PooledStr(pub(crate) u32);

impl PooledStr {
    pub fn as_str(self) -> &'static str {
        const STRPOOL: &str = include_str!(concat!(env!("OUT_DIR"), "/str.bin"));

        let offset = self.0 & ((1 << 24) - 1);
        let len = self.0 >> 24;
        &STRPOOL[offset as usize..][..len as usize]
    }
}
