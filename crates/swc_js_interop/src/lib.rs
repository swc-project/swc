//! This module should not be depended by plugin.
//!
//! This is js executer runtime for swc plugin host. (`@swc/core` or `next-swc`)

use anyhow::Result;

mod impls;

/// `fn_src`: The function source code, which will be cached.
pub async fn exec_js(fn_src: &str, data: Vec<u8>) -> Result<Vec<u8>> {
    impls::exec_js(fn_src, data).await
}
