#![allow(unused_variables)]
#[cfg(feature = "plugin-mode")]
use swc_common::{
    source_map::{
        DistinctSources, FileLinesResult, MalformedSourceMapPositions, Pos, SpanSnippetError,
    },
    BytePos, FileName, Loc, SourceFileAndBytePos, SourceMapper, Span,
};
#[cfg(feature = "plugin-mode")]
use swc_ecma_ast::SourceMapperExt;

#[cfg(feature = "plugin-mode")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
use crate::memory_interop::read_returned_result_from_host_fallible;

#[cfg(target_arch = "wasm32")]
extern "C" {
    fn __lookup_char_pos_source_map_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
    fn __doctest_offset_line_proxy(orig: u32) -> u32;
    fn __merge_spans_proxy(
        lhs_lo: u32,
        lhs_hi: u32,
        lhs_ctxt: u32,
        rhs_lo: u32,
        rhs_hi: u32,
        rhs_ctxt: u32,
        allocated_ptr: i32,
    ) -> i32;
    fn __span_to_string_proxy(
        span_lo: u32,
        span_hi: u32,
        span_ctxt: u32,
        allocated_ret_ptr: i32,
    ) -> i32;
    fn __span_to_filename_proxy(
        span_lo: u32,
        span_hi: u32,
        span_ctxt: u32,
        allocated_ret_ptr: i32,
    ) -> i32;
    fn __span_to_lines_proxy(
        span_lo: u32,
        span_hi: u32,
        span_ctxt: u32,
        allocated_ret_ptr: i32,
    ) -> i32;
    fn __lookup_byte_offset_proxy(byte_pos: u32, allocated_ret_ptr: i32) -> i32;
}

#[cfg(feature = "plugin-mode")]
#[derive(Debug, Copy, Clone)]
pub struct PluginSourceMapProxy;

#[cfg(feature = "plugin-mode")]
impl PluginSourceMapProxy {
    /*
    fn sss<F, Ret>(&self, sp: Span, extract_source: F) -> Result<Ret, SpanSnippetError>
    where
        F: FnOnce(&str, usize, usize) -> Ret,
    {
        if sp.lo() > sp.hi() {
            return Err(SpanSnippetError::IllFormedSpan(sp));
        }
        if sp.lo.is_dummy() || sp.hi.is_dummy() {
            return Err(SpanSnippetError::DummyBytePos);
        }

        let local_begin = self.lookup_byte_offset(sp.lo());
        let local_end = self.lookup_byte_offset(sp.hi());

        if local_begin.sf.start_pos != local_end.sf.start_pos {
            Err(SpanSnippetError::DistinctSources(DistinctSources {
                begin: (local_begin.sf.name.clone(), local_begin.sf.start_pos),
                end: (local_end.sf.name.clone(), local_end.sf.start_pos),
            }))
        } else {
            let pos: BytePos = BytePos(0);
            let start_index = pos.to_usize();
            let end_index = local_end.pos.to_usize();
            let source_len = (local_begin.sf.end_pos - local_begin.sf.start_pos).to_usize();

            if start_index > end_index || end_index > source_len {
                return Err(SpanSnippetError::MalformedForSourcemap(
                    MalformedSourceMapPositions {
                        name: local_begin.sf.name.clone(),
                        source_len,
                        begin_pos: local_begin.pos,
                        end_pos: local_end.pos,
                    },
                ));
            }

            let src = &local_begin.sf.src;
            Ok(extract_source(src, start_index, end_index))
        }
    }
     */

    pub fn span_to_source<F, Ret>(
        &self,
        sp: Span,
        extract_source: F,
    ) -> Result<Ret, SpanSnippetError>
    where
        F: FnOnce(&str, usize, usize) -> Ret,
    {
        #[cfg(target_arch = "wasm32")]
        {
            if sp.lo() > sp.hi() {
                return Err(SpanSnippetError::IllFormedSpan(sp));
            }
            if sp.lo.is_dummy() || sp.hi.is_dummy() {
                return Err(SpanSnippetError::DummyBytePos);
            }

            let local_begin: SourceFileAndBytePos =
                read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
                    __lookup_byte_offset_proxy(sp.lo().0, serialized_ptr)
                })
                .expect("Should return begin offset");
            let local_end: SourceFileAndBytePos =
                read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
                    __lookup_byte_offset_proxy(sp.hi().0, serialized_ptr)
                })
                .expect("Should return end offset");

            if local_begin.sf.start_pos != local_end.sf.start_pos {
                Err(SpanSnippetError::DistinctSources(DistinctSources {
                    begin: (local_begin.sf.name.clone(), local_begin.sf.start_pos),
                    end: (local_end.sf.name.clone(), local_end.sf.start_pos),
                }))
            } else {
                let start_index = local_begin.pos.to_usize();
                let end_index = local_end.pos.to_usize();
                let source_len = (local_begin.sf.end_pos - local_begin.sf.start_pos).to_usize();

                if start_index > end_index || end_index > source_len {
                    return Err(SpanSnippetError::MalformedForSourcemap(
                        MalformedSourceMapPositions {
                            name: local_begin.sf.name.clone(),
                            source_len,
                            begin_pos: local_begin.pos,
                            end_pos: local_end.pos,
                        },
                    ));
                }

                let src = &local_begin.sf.src;
                return Ok(extract_source(src, start_index, end_index));
            }
        }

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }
}

/// Subset of SourceMap interface supported in plugin.
/// Unlike `Comments`, this does not fully implement `SourceMap`.
#[cfg(feature = "plugin-mode")]
impl SourceMapper for PluginSourceMapProxy {
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    fn lookup_char_pos(&self, pos: BytePos) -> Loc {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
            __lookup_char_pos_source_map_proxy(pos.0, serialized_ptr)
        })
        .expect("Host should return Loc");

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn span_to_lines(&self, sp: Span) -> FileLinesResult {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
            __span_to_lines_proxy(sp.lo.0, sp.hi.0, sp.ctxt.as_u32(), serialized_ptr)
        })
        .expect("Host should return FileLinesResult");

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn span_to_string(&self, sp: Span) -> String {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
            __span_to_string_proxy(sp.lo.0, sp.hi.0, sp.ctxt.as_u32(), serialized_ptr)
        })
        .expect("Host should return String");

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn span_to_filename(&self, sp: Span) -> FileName {
        #[cfg(target_arch = "wasm32")]
        return read_returned_result_from_host_fallible(|serialized_ptr| unsafe {
            __span_to_filename_proxy(sp.lo.0, sp.hi.0, sp.ctxt.as_u32(), serialized_ptr)
        })
        .expect("Host should return Filename");

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn span_to_snippet(&self, sp: Span) -> Result<String, SpanSnippetError> {
        #[cfg(target_arch = "wasm32")]
        return self.span_to_source(sp, |src, start_index, end_index| {
            src[start_index..end_index].to_string()
        });

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn merge_spans(&self, sp_lhs: Span, sp_rhs: Span) -> Option<Span> {
        #[cfg(target_arch = "wasm32")]
        unsafe {
            // We need to `allocate` memory, force creates empty span instead of DUMMY_SP
            let span = Span {
                lo: BytePos(0),
                hi: BytePos(0),
                ctxt: swc_common::SyntaxContext::empty(),
            };

            let serialized =
                swc_common::plugin::Serialized::serialize(&span).expect("Should be serializable");
            let serialized_ref = serialized.as_ref();
            let ptr = serialized_ref.as_ptr();
            let len = serialized_ref.len();

            let ret = __merge_spans_proxy(
                sp_lhs.lo.0,
                sp_lhs.hi.0,
                sp_lhs.ctxt.as_u32(),
                sp_rhs.lo.0,
                sp_rhs.hi.0,
                sp_rhs.ctxt.as_u32(),
                ptr as _,
            );

            return if ret == 1 { Some(span) } else { None };
        };

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }

    fn call_span_if_macro(&self, sp: Span) -> Span {
        // This mimics host's behavior
        // https://github.com/swc-project/swc/blob/f7dc3fff1f03c9b7cee27ef760dc11bc96083f60/crates/swc_common/src/source_map.rs#L1283-L1285=
        sp
    }

    fn doctest_offset_line(&self, line: usize) -> usize {
        #[cfg(target_arch = "wasm32")]
        unsafe {
            return __doctest_offset_line_proxy(line as u32) as usize;
        };

        #[cfg(not(target_arch = "wasm32"))]
        unimplemented!("Sourcemap proxy cannot be called in this context")
    }
}

#[cfg(feature = "plugin-mode")]
impl SourceMapperExt for PluginSourceMapProxy {
    fn get_code_map(&self) -> &dyn SourceMapper {
        self
    }
}
