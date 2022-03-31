use swc_common::{comments::Comments, plugin::Serialized, BytePos};
use swc_plugin_comments::{CommentsVecPtr, HostCommentsStorage, COMMENTS};

use crate::{host_environment::HostEnvironment, memory_interop::write_into_memory_view};

/// Ask to get leading_comments from currently scoped comments held by
/// HostCommentsStorage.
///
/// Returns 1 if operation success with Some(Vec<Comments>), 0 otherwise.
/// Allocated results should be read through CommentsPtr.
pub fn get_leading_comments_proxy(
    env: &HostEnvironment,
    byte_pos: u32,
    allocated_ret_ptr: i32,
) -> i32 {
    if let Some(memory) = env.memory_ref() {
        if let Some(alloc_guest_memory) = env.alloc_guest_memory_ref() {
            if !COMMENTS.is_set() {
                return 0;
            }

            return COMMENTS.with(|storage: &HostCommentsStorage| {
                if let Some(comments) = &storage.inner {
                    let leading_comments = comments.get_leading(BytePos(byte_pos));
                    if let Some(leading_comments) = leading_comments {
                        let serialized_leading_comments_vec_bytes =
                            Serialized::serialize(&leading_comments)
                                .expect("Should be serializable");

                        let serialized_bytes_len =
                            serialized_leading_comments_vec_bytes.as_ref().len();

                        let (allocated_ptr, allocated_ptr_len) = write_into_memory_view(
                            memory,
                            &serialized_leading_comments_vec_bytes,
                            |_| {
                                // In most cases our host-plugin tranmpoline works in a way that
                                // plugin pre-allocates
                                // memory before calling host imported fn. But in case of
                                // comments return value is Vec<Comments> which
                                // guest cannot predetermine size to allocate, intead
                                // let host allocate by calling guest's alloc via attached
                                // hostenvironment.
                                alloc_guest_memory
                                    .call(
                                        serialized_bytes_len
                                            .try_into()
                                            .expect("Should be able to convert size"),
                                    )
                                    .expect("Should able to allocate memory in the plugin")
                            },
                        );

                        // Retuning (allocated_ptr, len) into caller (plugin)
                        let comment_ptr_serialized = Serialized::serialize(&CommentsVecPtr(
                            allocated_ptr,
                            allocated_ptr_len,
                        ))
                        .expect("Should be serializable");

                        write_into_memory_view(memory, &comment_ptr_serialized, |_| {
                            allocated_ret_ptr
                        });
                        return 1;
                    }
                }
                0
            });
        }
    }
    0
}
