#[cfg(feature = "plugin-mode")]
use swc_common::plugin::Serialized;
#[cfg(feature = "plugin-mode")]
use swc_common::{
    comments::{Comment, Comments},
    BytePos,
};

extern "C" {
    fn __get_leading_comments_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
}

/// A struct to exchance allocated Vec<Comment> between memory spaces.
#[derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)]
pub struct CommentsVecPtr(pub i32, pub i32);

/// A struct implements `swc_common::comments::Comments` for the plugin.
/// This is a proxy to the host's comments reference while plugin transform
/// runs, does not contain actual data but lazily requests to the host for each
/// interfaces.
///
/// This _does not_ derives serialization / deserialization for the
/// Serialized::de/serialize interface. Instead, swc_plugin_macro injects an
/// instance in plugin's runtime directly.
#[cfg(feature = "plugin-mode")]
#[derive(Debug)]
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
        // Allocate CommentsVecPtr to get return value from the host
        let comments_vec_ptr = CommentsVecPtr(0, 0);
        let serialized_comments_vec_ptr = Serialized::serialize(&comments_vec_ptr)
            .expect("Should able to serialize CommentsVecPtr");
        let serialized_comments_vec_ptr_ref = serialized_comments_vec_ptr.as_ref();
        let serialized_comments_vec_ptr_raw_ptr = serialized_comments_vec_ptr_ref.as_ptr();
        let serialized_comments_vec_ptr_raw_len = serialized_comments_vec_ptr_ref.len();

        let ret = unsafe {
            __get_leading_comments_proxy(pos.0, serialized_comments_vec_ptr_raw_ptr as _)
        };

        if ret == 0 {
            return None;
        }

        // First, reconstruct CommentsVecPtr to reveal ptr to the allocated
        // Vec<Comments>
        let raw_comments_vec_ptr_bytes = unsafe {
            std::slice::from_raw_parts(
                serialized_comments_vec_ptr_raw_ptr,
                serialized_comments_vec_ptr_raw_len,
            )
        };
        let comments_vec_ptr_serialized = Serialized::new_for_plugin(
            raw_comments_vec_ptr_bytes,
            serialized_comments_vec_ptr_raw_len
                .try_into()
                .expect("Should able to convert ptr length"),
        );
        let comments_vec_ptr: CommentsVecPtr =
            Serialized::deserialize(&comments_vec_ptr_serialized)
                .expect("Should able to deserialize");

        // Reconstruct actual Vec<Comments>
        let result_ptr_bytes = unsafe {
            std::slice::from_raw_parts(
                comments_vec_ptr.0 as _,
                comments_vec_ptr
                    .1
                    .try_into()
                    .expect("Should able to convert ptr length"),
            )
        };

        let result_serialized = Serialized::new_for_plugin(result_ptr_bytes, comments_vec_ptr.1);
        Some(Serialized::deserialize(&result_serialized).expect("Should able to deserialize"))
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
