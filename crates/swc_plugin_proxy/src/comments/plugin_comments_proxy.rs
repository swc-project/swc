#[cfg(feature = "__plugin_mode")]
use swc_common::{
    comments::{Comment, Comments},
    BytePos,
};
#[cfg(feature = "__plugin_mode")]
use swc_trace_macro::swc_trace;

#[cfg(all(feature = "__rkyv", feature = "__plugin_mode", target_arch = "wasm32"))]
use crate::memory_interop::read_returned_result_from_host;

#[cfg(target_arch = "wasm32")]
extern "C" {
    fn __copy_comment_to_host_env(bytes_ptr: u32, bytes_ptr_len: u32);
    fn __add_leading_comment_proxy(byte_pos: u32);
    fn __add_leading_comments_proxy(byte_pos: u32);
    fn __has_leading_comments_proxy(byte_pos: u32) -> u32;
    fn __move_leading_comments_proxy(from_byte_pos: u32, to_byte_pos: u32);
    fn __take_leading_comments_proxy(byte_pos: u32, allocated_ret_ptr: u32) -> u32;
    fn __get_leading_comments_proxy(byte_pos: u32, allocated_ret_ptr: u32) -> u32;
    fn __add_trailing_comment_proxy(byte_pos: u32);
    fn __add_trailing_comments_proxy(byte_pos: u32);
    fn __has_trailing_comments_proxy(byte_pos: u32) -> u32;
    fn __move_trailing_comments_proxy(from_byte_pos: u32, to_byte_pos: u32);
    fn __take_trailing_comments_proxy(byte_pos: u32, allocated_ret_ptr: u32) -> u32;
    fn __get_trailing_comments_proxy(byte_pos: u32, allocated_ret_ptr: u32) -> u32;
    fn __add_pure_comment_proxy(byte_pos: u32);
}

/// A struct implements `swc_common::comments::Comments` for the plugin.
/// This is a proxy to the host's comments reference while plugin transform
/// runs, does not contain actual data but lazily requests to the host for each
/// interfaces.
///
/// This _does not_ derives serialization / deserialization for the
/// Serialized::de/serialize interface. Instead, swc_plugin_macro injects an
/// instance in plugin's runtime directly.
#[cfg(feature = "__plugin_mode")]
#[derive(Debug, Copy, Clone)]
pub struct PluginCommentsProxy;

#[cfg(feature = "__plugin_mode")]
#[swc_trace]
impl PluginCommentsProxy {
    /// Copy guest memory's struct into host via CommentHostEnvironment's
    /// comment_buffer as serialized to pass param from guest to the host for
    /// the fn like add_leading*.
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    fn allocate_comments_buffer_to_host<T>(&self, value: T)
    where
        T: for<'a> rkyv::Serialize<
            rancor::Strategy<
                rkyv::ser::Serializer<
                    rkyv::util::AlignedVec,
                    rkyv::ser::allocator::ArenaHandle<'a>,
                    rkyv::ser::sharing::Share,
                >,
                rancor::Error,
            >,
        >,
    {
        #[cfg(target_arch = "wasm32")]
        {
            let serialized = swc_common::plugin::serialized::PluginSerializedBytes::try_serialize(
                &swc_common::plugin::serialized::VersionedSerializable::new(value),
            )
            .expect("Should able to serialize value");
            let (serialized_comment_ptr, serialized_comment_ptr_len) = serialized.as_ptr();
            unsafe {
                // We need to copy PluginCommentProxy's param for add_leading (Comment, or
                // Vec<Comment>) to the host, before calling proxy to the host. This'll fill in
                // CommentHostEnvironment's buffer, subsequent proxy call will read &
                // deserialize it.
                __copy_comment_to_host_env(
                    serialized_comment_ptr as u32,
                    serialized_comment_ptr_len
                        .try_into()
                        .expect("Should able to convert ptr length"),
                );
            }
        }
    }
}

#[cfg(all(feature = "__plugin_mode", not(target_arch = "wasm32")))]
#[swc_trace]
impl Comments for PluginCommentsProxy {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        swc_common::comments::COMMENTS.with(|c| {
            c.add_leading(pos, cmt);
        });
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        swc_common::comments::COMMENTS.with(|c| {
            c.add_leading_comments(pos, comments);
        });
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        swc_common::comments::COMMENTS.with(|c| c.has_leading(pos))
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        swc_common::comments::COMMENTS.with(|c| {
            c.move_leading(from, to);
        });
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        swc_common::comments::COMMENTS.with(|c| c.take_leading(pos))
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        swc_common::comments::COMMENTS.with(|c| c.get_leading(pos))
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        swc_common::comments::COMMENTS.with(|c| {
            c.add_trailing(pos, cmt);
        });
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        swc_common::comments::COMMENTS.with(|c| {
            c.add_trailing_comments(pos, comments);
        });
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        swc_common::comments::COMMENTS.with(|c| c.has_trailing(pos))
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        swc_common::comments::COMMENTS.with(|c| {
            c.move_trailing(from, to);
        });
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        swc_common::comments::COMMENTS.with(|c| c.take_trailing(pos))
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        swc_common::comments::COMMENTS.with(|c| c.get_trailing(pos))
    }

    fn add_pure_comment(&self, pos: BytePos) {
        swc_common::comments::COMMENTS.with(|c| {
            c.add_pure_comment(pos);
        });
    }
}

#[cfg(all(feature = "__plugin_mode", target_arch = "wasm32"))]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
#[swc_trace]
impl Comments for PluginCommentsProxy {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.allocate_comments_buffer_to_host(cmt);
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __add_leading_comment_proxy(pos.0);
        }
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.allocate_comments_buffer_to_host(comments);
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __add_leading_comments_proxy(pos.0);
        }
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        #[cfg(target_arch = "wasm32")]
        {
            if unsafe { __has_leading_comments_proxy(pos.0) } == 0 {
                false
            } else {
                true
            }
        }
        #[cfg(not(target_arch = "wasm32"))]
        false
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __move_leading_comments_proxy(from.0, to.0)
        }
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __take_leading_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __get_leading_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.allocate_comments_buffer_to_host(cmt);
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __add_trailing_comment_proxy(pos.0);
        }
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.allocate_comments_buffer_to_host(comments);
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __add_trailing_comments_proxy(pos.0);
        }
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        #[cfg(target_arch = "wasm32")]
        {
            if unsafe { __has_trailing_comments_proxy(pos.0) } == 0 {
                false
            } else {
                true
            }
        }
        #[cfg(not(target_arch = "wasm32"))]
        false
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __move_trailing_comments_proxy(from.0, to.0)
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __take_trailing_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host(|serialized_ptr| unsafe {
            __get_trailing_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn add_pure_comment(&self, pos: BytePos) {
        #[cfg(target_arch = "wasm32")]
        {
            unsafe {
                __add_pure_comment_proxy(pos.0);
            }
        }
    }
}
