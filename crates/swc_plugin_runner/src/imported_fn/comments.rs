use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    plugin::Serialized,
    BytePos,
};
use swc_plugin_proxy::COMMENTS;
use wasmer::{LazyInit, Memory, NativeFunc};

use crate::memory_interop::{allocate_return_values_into_guest, copy_bytes_into_host};

/// External environment state for imported (declared in host, injected into
/// guest) fn for comments proxy.
#[derive(wasmer::WasmerEnv, Clone)]
pub struct CommentHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    #[wasmer(export(name = "__alloc"))]
    pub alloc_guest_memory: LazyInit<NativeFunc<u32, i32>>,
    /// A buffer to `Comment`, or `Vec<Comment>` plugin need to pass to the host
    /// to perform mutable comment operations like `add_leading, or
    /// add_leading_comments`. This is vec to serialized bytes, doesn't
    /// distinguish if it's Vec<Comment> or not. Host should perform
    /// typed deserialization accordingly.
    pub mutable_comment_buffer: Arc<Mutex<Vec<u8>>>,
}

impl CommentHostEnvironment {
    pub fn new(mutable_comment_buffer: &Arc<Mutex<Vec<u8>>>) -> CommentHostEnvironment {
        CommentHostEnvironment {
            memory: LazyInit::default(),
            alloc_guest_memory: LazyInit::default(),
            mutable_comment_buffer: mutable_comment_buffer.clone(),
        }
    }
}

/// Copy given serialized byte into host's comment buffer, subsequent proxy call
/// in the host can read it.
pub fn copy_comment_to_host_env(env: &CommentHostEnvironment, bytes_ptr: i32, bytes_ptr_len: i32) {
    if let Some(memory) = env.memory_ref() {
        (*env.mutable_comment_buffer.lock()) =
            copy_bytes_into_host(memory, bytes_ptr, bytes_ptr_len);
    }
}

/// Utility fn to unwrap necessary values for the comments fn operation when fn
/// needs to return values.
fn unwrap_comments_storage_or_default<F, R>(f: F, default: R) -> R
where
    F: FnOnce(&SingleThreadedComments) -> R,
{
    if !COMMENTS.is_set() {
        return default;
    }

    COMMENTS.with(|storage| {
        if let Some(comments) = &storage.inner {
            f(comments)
        } else {
            default
        }
    })
}

/// Utility fn to unwrap necessary values for the comments fn operation when fn
/// does not need to return values.
fn unwrap_comments_storage<F>(f: F)
where
    F: FnOnce(&SingleThreadedComments),
{
    unwrap_comments_storage_or_default(
        |comments| {
            f(comments);
            None
        },
        None as Option<i32>,
    );
}

/// Utility fn to unwrap necessary values for the comments, as well as host
/// environment's state.
fn unwrap_comments_storage_with_env<F, R>(env: &CommentHostEnvironment, f: F, default: R) -> R
where
    F: FnOnce(&SingleThreadedComments, &Memory, &NativeFunc<u32, i32>) -> R,
{
    if let Some(memory) = env.memory_ref() {
        if let Some(alloc_guest_memory) = env.alloc_guest_memory_ref() {
            return unwrap_comments_storage_or_default(
                |comments| f(comments, memory, alloc_guest_memory),
                default,
            );
        }
    }
    default
}

/// Common logics for add_*_comment/comments.
fn add_comments_inner<F>(env: &CommentHostEnvironment, byte_pos: u32, f: F)
where
    F: FnOnce(&SingleThreadedComments, BytePos, Serialized),
{
    unwrap_comments_storage(|comments| {
        let byte_pos = BytePos(byte_pos);
        // PluginCommentProxy in the guest should've copied buffer already
        let comment_byte = &mut (*env.mutable_comment_buffer.lock());
        let serialized = Serialized::new_for_plugin(
            comment_byte,
            comment_byte
                .len()
                .try_into()
                .expect("Should able to convert ptr length"),
        );

        f(comments, byte_pos, serialized);

        // This is not strictly required, but will help to ensure to access previous
        // call's buffer when we make some mistakes for the execution order.
        comment_byte.clear();
    });
}

pub fn add_leading_comment_proxy(env: &CommentHostEnvironment, byte_pos: u32) {
    add_comments_inner(env, byte_pos, |comments, byte_pos, serialized| {
        comments.add_leading(byte_pos, serialized.into());
    });
}

pub fn add_leading_comments_proxy(env: &CommentHostEnvironment, byte_pos: u32) {
    add_comments_inner(env, byte_pos, |comments, byte_pos, serialized| {
        comments.add_leading_comments(byte_pos, serialized.into());
    });
}

pub fn has_leading_comments_proxy(byte_pos: u32) -> i32 {
    unwrap_comments_storage_or_default(|comments| comments.has_leading(BytePos(byte_pos)) as i32, 0)
}

pub fn move_leading_comments_proxy(from_byte_pos: u32, to_byte_pos: u32) {
    unwrap_comments_storage(|comments| {
        comments.move_leading(BytePos(from_byte_pos), BytePos(to_byte_pos))
    });
}

pub fn take_leading_comments_proxy(
    env: &CommentHostEnvironment,
    byte_pos: u32,
    allocated_ret_ptr: i32,
) -> i32 {
    unwrap_comments_storage_with_env(
        env,
        |comments, memory, alloc_guest_memory| {
            let leading_comments = comments.take_leading(BytePos(byte_pos));
            if let Some(leading_comments) = leading_comments {
                let serialized_leading_comments_vec_bytes =
                    Serialized::serialize(&leading_comments).expect("Should be serializable");

                allocate_return_values_into_guest(
                    memory,
                    alloc_guest_memory,
                    allocated_ret_ptr,
                    &serialized_leading_comments_vec_bytes,
                );
                1
            } else {
                0
            }
        },
        0,
    )
}

/// Ask to get leading_comments from currently scoped comments held by
/// HostCommentsStorage.
///
/// Returns 1 if operation success with Some(Vec<Comments>), 0 otherwise.
/// Allocated results should be read through CommentsPtr.
pub fn get_leading_comments_proxy(
    env: &CommentHostEnvironment,
    byte_pos: u32,
    allocated_ret_ptr: i32,
) -> i32 {
    unwrap_comments_storage_with_env(
        env,
        |comments, memory, alloc_guest_memory| {
            let leading_comments = comments.get_leading(BytePos(byte_pos));
            if let Some(leading_comments) = leading_comments {
                let serialized_leading_comments_vec_bytes =
                    Serialized::serialize(&leading_comments).expect("Should be serializable");

                allocate_return_values_into_guest(
                    memory,
                    alloc_guest_memory,
                    allocated_ret_ptr,
                    &serialized_leading_comments_vec_bytes,
                );
                1
            } else {
                0
            }
        },
        0,
    )
}

pub fn add_trailing_comment_proxy(env: &CommentHostEnvironment, byte_pos: u32) {
    add_comments_inner(env, byte_pos, |comments, byte_pos, serialized| {
        comments.add_trailing(byte_pos, serialized.into());
    });
}

pub fn add_trailing_comments_proxy(env: &CommentHostEnvironment, byte_pos: u32) {
    add_comments_inner(env, byte_pos, |comments, byte_pos, serialized| {
        comments.add_trailing_comments(byte_pos, serialized.into());
    });
}

pub fn has_trailing_comments_proxy(byte_pos: u32) -> i32 {
    unwrap_comments_storage_or_default(
        |comments| comments.has_trailing(BytePos(byte_pos)) as i32,
        0,
    )
}

pub fn move_trailing_comments_proxy(from_byte_pos: u32, to_byte_pos: u32) {
    unwrap_comments_storage(|comments| {
        comments.move_trailing(BytePos(from_byte_pos), BytePos(to_byte_pos))
    });
}

pub fn take_trailing_comments_proxy(
    env: &CommentHostEnvironment,
    byte_pos: u32,
    allocated_ret_ptr: i32,
) -> i32 {
    unwrap_comments_storage_with_env(
        env,
        |comments, memory, alloc_guest_memory| {
            let trailing_comments = comments.take_trailing(BytePos(byte_pos));
            if let Some(leading_comments) = trailing_comments {
                let serialized_leading_comments_vec_bytes =
                    Serialized::serialize(&leading_comments).expect("Should be serializable");

                allocate_return_values_into_guest(
                    memory,
                    alloc_guest_memory,
                    allocated_ret_ptr,
                    &serialized_leading_comments_vec_bytes,
                );
                1
            } else {
                0
            }
        },
        0,
    )
}

pub fn get_trailing_comments_proxy(
    env: &CommentHostEnvironment,
    byte_pos: u32,
    allocated_ret_ptr: i32,
) -> i32 {
    unwrap_comments_storage_with_env(
        env,
        |comments, memory, alloc_guest_memory| {
            let trailing_comments = comments.get_trailing(BytePos(byte_pos));
            if let Some(leading_comments) = trailing_comments {
                let serialized_leading_comments_vec_bytes =
                    Serialized::serialize(&leading_comments).expect("Should be serializable");

                allocate_return_values_into_guest(
                    memory,
                    alloc_guest_memory,
                    allocated_ret_ptr,
                    &serialized_leading_comments_vec_bytes,
                );
                1
            } else {
                0
            }
        },
        0,
    )
}

pub fn add_pure_comment_proxy(byte_pos: u32) {
    unwrap_comments_storage(|comments| comments.add_pure_comment(BytePos(byte_pos)));
}
