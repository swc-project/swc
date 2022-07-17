/// A struct to internally store current file's comments for the
/// transform plugins.
///
/// This storage is introduced to conform with existing design to the comments,
/// specifically `SingleThreadedComments`. It doesn't support thread-safety
/// which does not allow to be passed into wasmerEnv (HostEnvironment). A scoped
/// tls holds inner comments as global, per each transform execution. Refer
/// `swc_plugin::transform_execytor::TransformExecutor::transform` for the
/// responsibility to manage actual data.
///
/// Should never attempt to use this other than plugin_runner.
// TODO: This storage does not support mutable yet
#[cfg(feature = "plugin-rt")]
pub struct HostCommentsStorage {
    pub inner: Option<swc_common::comments::SingleThreadedComments>,
}

#[cfg(feature = "plugin-rt")]
better_scoped_tls::scoped_tls!(
  pub static COMMENTS: HostCommentsStorage
);
