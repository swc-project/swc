#[cfg(feature = "plugin-mode")]
use swc_common::{
    comments::{Comment, Comments},
    BytePos,
};

#[cfg(feature = "plugin-mode")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
use crate::memory_interop::read_returned_result_from_host;

#[cfg(target_arch = "wasm32")]
extern "C" {
    fn __copy_comment_to_host_env(bytes_ptr: i32, bytes_ptr_len: i32);
    fn __add_leading_comment_proxy(byte_pos: u32);
    fn __add_leading_comments_proxy(byte_pos: u32);
    fn __has_leading_comments_proxy(byte_pos: u32) -> i32;
    fn __move_leading_comments_proxy(from_byte_pos: u32, to_byte_pos: u32);
    fn __take_leading_comments_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
    fn __get_leading_comments_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
    fn __add_trailing_comment_proxy(byte_pos: u32);
    fn __add_trailing_comments_proxy(byte_pos: u32);
    fn __has_trailing_comments_proxy(byte_pos: u32) -> i32;
    fn __move_trailing_comments_proxy(from_byte_pos: u32, to_byte_pos: u32);
    fn __take_trailing_comments_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
    fn __get_trailing_comments_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
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
#[cfg(feature = "plugin-mode")]
#[derive(Debug, Copy, Clone)]
pub struct PluginCommentsProxy;

#[cfg(feature = "plugin-mode")]
impl PluginCommentsProxy {
    /// Copy guest memory's struct into host via CommentHostEnvironment's
    /// comment_buffer as serialized to pass param from guest to the host for
    /// the fn like add_leading*.
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    fn allocate_comments_buffer_to_host<T>(&self, value: &T)
    where
        T: rkyv::Serialize<rkyv::ser::serializers::AllocSerializer<512>>,
    {
        #[cfg(target_arch = "wasm32")]
        {
            let serialized = Serialized::serialize(value).expect("Should able to serialize value");
            let serialized_comment_ptr_ref = serialized.as_ref();
            unsafe {
                // We need to copy PluginCommentProxy's param for add_leading (Comment, or
                // Vec<Comment>) to the host, before calling proxy to the host. This'll fill in
                // CommentHostEnvironment's buffer, subsequent proxy call will read &
                // deserialize it.
                __copy_comment_to_host_env(
                    serialized_comment_ptr_ref.as_ptr() as _,
                    serialized_comment_ptr_ref
                        .len()
                        .try_into()
                        .expect("Should able to convert ptr length"),
                );
            }
        }
    }
}

#[cfg(feature = "plugin-mode")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
impl Comments for PluginCommentsProxy {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.allocate_comments_buffer_to_host(&cmt);
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __add_leading_comment_proxy(pos.0);
        }
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.allocate_comments_buffer_to_host(&comments);
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
        return self.read_returned_result_from_host(|serialized_ptr| unsafe {
            __take_leading_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        #[cfg(target_arch = "wasm32")]
        return self.read_returned_result_from_host(|serialized_ptr| unsafe {
            __get_leading_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.allocate_comments_buffer_to_host(&cmt);
        #[cfg(target_arch = "wasm32")]
        unsafe {
            __add_trailing_comment_proxy(pos.0);
        }
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.allocate_comments_buffer_to_host(&comments);
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
        return self.read_returned_result_from_host(|serialized_ptr| unsafe {
            __take_trailing_comments_proxy(pos.0, serialized_ptr)
        });

        #[cfg(not(target_arch = "wasm32"))]
        None
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        #[cfg(target_arch = "wasm32")]
        return self.read_returned_result_from_host(|serialized_ptr| unsafe {
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
