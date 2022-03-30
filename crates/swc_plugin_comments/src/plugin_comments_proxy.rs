#[cfg(feature = "plugin-mode")]
use swc_common::{
    comments::{Comment, Comments},
    BytePos,
};

/// A struct implements `swc_common::comments::Comments` for the plugin.
/// This is a proxy to the host's comments reference while plugin transform
/// runs, does not contain actual data but lazily requests to the host for each
/// interfaces.
///
/// This _does not_ derives serialization / deserialization for the
/// Serialized::de/serialize interface. Instead, swc_plugin_macro injects an
/// instance in plugin's runtime directly.
#[cfg(feature = "plugin-mode")]
pub struct PluginCommentsProxy;

#[cfg(feature = "plugin-mode")]
impl Comments for PluginCommentsProxy {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        unimplemented!("not implemented yet");
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        unimplemented!("not implemented yet");
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        unimplemented!("not implemented yet");
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        unimplemented!("not implemented yet");
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        unimplemented!("not implemented yet");
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        unimplemented!("not implemented yet");
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        unimplemented!("not implemented yet");
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        unimplemented!("not implemented yet");
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        unimplemented!("not implemented yet");
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        unimplemented!("not implemented yet");
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        unimplemented!("not implemented yet");
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        unimplemented!("not implemented yet");
    }

    fn add_pure_comment(&self, pos: BytePos) {
        unimplemented!("not implemented yet");
    }

    fn with_leading<F, Ret>(&self, pos: BytePos, f: F) -> Ret
    where
        Self: Sized,
        F: FnOnce(&[Comment]) -> Ret,
    {
        unimplemented!("not implemented yet");
    }

    fn with_trailing<F, Ret>(&self, pos: BytePos, f: F) -> Ret
    where
        Self: Sized,
        F: FnOnce(&[Comment]) -> Ret,
    {
        unimplemented!("not implemented yet");
    }
}
