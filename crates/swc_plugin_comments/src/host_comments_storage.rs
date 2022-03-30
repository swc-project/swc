use scoped_tls_hkt::scoped_thread_local;
use swc_common::comments::SingleThreadedComments;

/// A struct to internally store reference to current file's comments for the
/// transform plugins.
///
/// As struct implies, this is thin wrapper only holds reference to existing
/// comments. This only works by plugin's lifecycle has logical gaurantee to the
/// arbitary data, that comments will live until plugin completes transforms.
///
/// This storage is introduced to conform with existing design to the comments,
/// specifically `SingleThreadedComments`. It doesn't support thread-safety
/// which does not allow to be passed into wasmerEnv (HostEnvironment). A scoped
/// tls with local lifetime support (scoped_tls_hkt) holds inner comments
/// reference as global, per each transform execution. Refer
/// `swc_plugin_runner::apply_transform_plugin` for the responsibility to manage
/// actual data.
///
/// Should never attempt to use this other than plugin_runner.
// TODO: This storage does not support mutable yet:
// https://docs.rs/scoped-tls-hkt/latest/scoped_tls_hkt/#mutable-higher-kinded-types
#[derive(Copy, Clone)]
pub struct HostCommentsStorage<'a> {
    pub inner: Option<&'a SingleThreadedComments>,
}

scoped_thread_local!(
  /// Thread local holds actual HostCommentsStorage with its lifetime support.
  /// Host side runner owns responsibility to update inner data references
  /// accordingly before executing relavant transform.
  #[allow(suspicious_auto_trait_impls)] //https://github.com/Diggsey/scoped-tls-hkt/issues/2
  pub static COMMENTS: for<'a> HostCommentsStorage<'a>
);
