use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;

use crate::{util::PooledStr, Versions};

include!(concat!(env!("OUT_DIR"), "/corejs2_builtin/lib.rs"));

pub(crate) static BUILTINS: Lazy<FxHashMap<&str, Versions>> = Lazy::new(|| {
    // Since the `BrowserData` struct is large and has many empty slots,
    // it is not suitable for generation at compile time.

    FEATURES
        .iter()
        .map(|&(feature, start, end)| {
            let start = start as usize;
            let end = end as usize;
            let mut versions = Versions::default();
            for (browser, version) in &VERSION_STORE[start..end] {
                let version = version.as_str().parse().unwrap();
                versions.insert(browser.as_str(), Some(version));
            }
            (feature.as_str(), versions)
        })
        .collect()
});
