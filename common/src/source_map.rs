// Copyright 2012 The Rust Project Developers. See the COPYRIGHT
// file at the top-level directory of this distribution and at
// http://rust-lang.org/COPYRIGHT.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

//! The SourceMap tracks all the source code used within a single crate, mapping
//! from integer byte positions to the original source code location. Each bit
//! of source parsed during crate parsing (typically files, in-memory strings,
//! or various bits of macro expansion) cover a continuous range of bytes in the
//! SourceMap and are represented by SourceFiles. Byte positions are stored in
//! `spans` and used pervasively in the compiler. They are absolute positions
//! within the SourceMap, which upon request can be converted to line and column
//! information, source code snippets, etc.
pub use crate::syntax_pos::*;
use crate::{
    errors::SourceMapper,
    rustc_data_structures::stable_hasher::StableHasher,
    sync::{Lock, LockGuard, Lrc, MappedLockGuard},
};
use log::debug;
#[cfg(feature = "sourcemap")]
use sourcemap::SourceMapBuilder;
use std::{
    cmp,
    cmp::{max, min},
    collections::HashMap,
    env, fs,
    hash::Hash,
    io::{self, Read},
    path::{Path, PathBuf},
    sync::atomic::{AtomicUsize, Ordering::SeqCst},
};

// _____________________________________________________________________________
// SourceFile, MultiByteChar, FileName, FileLines
//

/// An abstraction over the fs operations used by the Parser.
pub trait FileLoader {
    /// Query the existence of a file.
    fn file_exists(&self, path: &Path) -> bool;

    /// Return an absolute path to a file, if possible.
    fn abs_path(&self, path: &Path) -> Option<PathBuf>;

    /// Read the contents of an UTF-8 file into memory.
    fn read_file(&self, path: &Path) -> io::Result<String>;
}

/// A FileLoader that uses std::fs to load real files.
pub struct RealFileLoader;

impl FileLoader for RealFileLoader {
    fn file_exists(&self, path: &Path) -> bool {
        fs::metadata(path).is_ok()
    }

    fn abs_path(&self, path: &Path) -> Option<PathBuf> {
        if path.is_absolute() {
            Some(path.to_path_buf())
        } else {
            env::current_dir().ok().map(|cwd| cwd.join(path))
        }
    }

    fn read_file(&self, path: &Path) -> io::Result<String> {
        let mut src = String::new();
        fs::File::open(path)?.read_to_string(&mut src)?;
        Ok(src)
    }
}

// This is a SourceFile identifier that is used to correlate SourceFiles between
// subsequent compilation sessions (which is something we need to do during
// incremental compilation).
#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug)]
pub struct StableSourceFileId(u128);

impl StableSourceFileId {
    pub fn new(source_file: &SourceFile) -> StableSourceFileId {
        let mut hasher = StableHasher::new();

        source_file.name.hash(&mut hasher);
        source_file.name_was_remapped.hash(&mut hasher);
        source_file.unmapped_path.hash(&mut hasher);

        StableSourceFileId(hasher.finish())
    }
}

// _____________________________________________________________________________
// SourceMap
//

#[derive(Default)]
pub(super) struct SourceMapFiles {
    pub(super) source_files: Vec<Lrc<SourceFile>>,
    stable_id_to_source_file: HashMap<StableSourceFileId, Lrc<SourceFile>>,
}

pub struct SourceMap {
    pub(super) files: Lock<SourceMapFiles>,
    start_pos: AtomicUsize,
    file_loader: Box<dyn FileLoader + Sync + Send>,
    // This is used to apply the file path remapping as specified via
    // --remap-path-prefix to all SourceFiles allocated within this SourceMap.
    path_mapping: FilePathMapping,
    /// In case we are in a doctest, replace all file names with the PathBuf,
    /// and add the given offsets to the line info
    doctest_offset: Option<(FileName, isize)>,
}

impl Default for SourceMap {
    fn default() -> Self {
        Self::new(FilePathMapping::empty())
    }
}

impl SourceMap {
    pub fn new(path_mapping: FilePathMapping) -> SourceMap {
        SourceMap {
            files: Default::default(),
            start_pos: Default::default(),
            file_loader: Box::new(RealFileLoader),
            path_mapping,
            doctest_offset: None,
        }
    }

    pub fn with_file_loader(
        file_loader: Box<dyn FileLoader + Sync + Send>,
        path_mapping: FilePathMapping,
    ) -> SourceMap {
        SourceMap {
            files: Default::default(),
            start_pos: Default::default(),
            file_loader,
            path_mapping,
            doctest_offset: None,
        }
    }

    pub fn path_mapping(&self) -> &FilePathMapping {
        &self.path_mapping
    }

    pub fn file_exists(&self, path: &Path) -> bool {
        self.file_loader.file_exists(path)
    }

    pub fn load_file(&self, path: &Path) -> io::Result<Lrc<SourceFile>> {
        let src = self.file_loader.read_file(path)?;
        let filename = path.to_owned().into();
        Ok(self.new_source_file(filename, src))
    }

    pub fn files(&self) -> MappedLockGuard<'_, Vec<Lrc<SourceFile>>> {
        LockGuard::map(self.files.borrow(), |files| &mut files.source_files)
    }

    pub fn source_file_by_stable_id(
        &self,
        stable_id: StableSourceFileId,
    ) -> Option<Lrc<SourceFile>> {
        self.files
            .borrow()
            .stable_id_to_source_file
            .get(&stable_id)
            .cloned()
    }

    fn next_start_pos(&self, len: usize) -> usize {
        // Add one so there is some space between files. This lets us distinguish
        // positions in the source_map, even in the presence of zero-length files.
        self.start_pos.fetch_add(len + 1, SeqCst)
    }

    /// Creates a new source_file.
    /// This does not ensure that only one SourceFile exists per file name.
    pub fn new_source_file(&self, filename: FileName, src: String) -> Lrc<SourceFile> {
        // The path is used to determine the directory for loading submodules and
        // include files, so it must be before remapping.
        // Note that filename may not be a valid path, eg it may be `<anon>` etc,
        // but this is okay because the directory determined by `path.pop()` will
        // be empty, so the working directory will be used.
        let unmapped_path = filename.clone();

        let (filename, was_remapped) = match filename {
            FileName::Real(filename) => {
                let (filename, was_remapped) = self.path_mapping.map_prefix(filename);
                (FileName::Real(filename), was_remapped)
            }
            other => (other, false),
        };

        // We hold lock at here to prevent panic
        // If we don't do this, lookup_char_pos and its family **may** panic.
        let mut files = self.files.borrow_mut();

        let start_pos = self.next_start_pos(src.len());

        let source_file = Lrc::new(SourceFile::new(
            filename,
            was_remapped,
            unmapped_path,
            src,
            Pos::from_usize(start_pos),
        ));

        {
            files.source_files.push(source_file.clone());
            files
                .stable_id_to_source_file
                .insert(StableSourceFileId::new(&source_file), source_file.clone());
        }

        source_file
    }

    pub fn mk_substr_filename(&self, sp: Span) -> String {
        let pos = self.lookup_char_pos(sp.lo());
        format!(
            "<{}:{}:{}>",
            pos.file.name,
            pos.line,
            pos.col.to_usize() + 1
        )
    }

    // If there is a doctest_offset, apply it to the line
    pub fn doctest_offset_line(&self, mut orig: usize) -> usize {
        if let Some((_, line)) = self.doctest_offset {
            if line >= 0 {
                orig += line as usize;
            } else {
                orig -= (-line) as usize;
            }
        }
        orig
    }

    /// Lookup source information about a BytePos
    pub fn lookup_char_pos(&self, pos: BytePos) -> Loc {
        let fm = self.lookup_source_file(pos);
        self.lookup_char_pos_with(fm, pos)
    }

    /// Lookup source information about a BytePos
    ///
    ///
    /// This method exists only for optimization and it's not part of public
    /// api.
    #[doc(hidden)]
    pub fn lookup_char_pos_with(&self, fm: Lrc<SourceFile>, pos: BytePos) -> Loc {
        let line_info = self.lookup_line_with(fm, pos);
        match line_info {
            Ok(SourceFileAndLine { sf: f, line: a }) => {
                let chpos = self.bytepos_to_file_charpos_with(&f, pos);

                let line = a + 1; // Line numbers start at 1
                let linebpos = f.lines[a];
                assert!(
                    pos >= linebpos,
                    "{}: bpos = {:?}; linebpos = {:?};",
                    f.name,
                    pos,
                    linebpos,
                );

                let linechpos = self.bytepos_to_file_charpos_with(&f, linebpos);

                let col = max(chpos, linechpos) - min(chpos, linechpos);

                let col_display = {
                    let start_width_idx = f
                        .non_narrow_chars
                        .binary_search_by_key(&linebpos, |x| x.pos())
                        .unwrap_or_else(|x| x);
                    let end_width_idx = f
                        .non_narrow_chars
                        .binary_search_by_key(&pos, |x| x.pos())
                        .unwrap_or_else(|x| x);
                    let special_chars = end_width_idx - start_width_idx;
                    let non_narrow: usize = f.non_narrow_chars[start_width_idx..end_width_idx]
                        .iter()
                        .map(|x| x.width())
                        .sum();
                    col.0 - special_chars + non_narrow
                };
                debug!(
                    "byte pos {:?} is on the line at byte pos {:?}",
                    pos, linebpos
                );
                debug!(
                    "char pos {:?} is on the line at char pos {:?}",
                    chpos, linechpos
                );
                debug!("byte is on line: {}", line);
                //                assert!(chpos >= linechpos);
                Loc {
                    file: f,
                    line,
                    col,
                    col_display,
                }
            }
            Err(f) => {
                let chpos = self.bytepos_to_file_charpos(pos);

                let col_display = {
                    let end_width_idx = f
                        .non_narrow_chars
                        .binary_search_by_key(&pos, |x| x.pos())
                        .unwrap_or_else(|x| x);
                    let non_narrow: usize = f.non_narrow_chars[0..end_width_idx]
                        .iter()
                        .map(|x| x.width())
                        .sum();
                    chpos.0 - end_width_idx + non_narrow
                };
                Loc {
                    file: f,
                    line: 0,
                    col: chpos,
                    col_display,
                }
            }
        }
    }

    /// If the relevant source_file is empty, we don't return a line number.
    pub fn lookup_line(&self, pos: BytePos) -> Result<SourceFileAndLine, Lrc<SourceFile>> {
        let f = self.lookup_source_file(pos);

        self.lookup_line_with(f, pos)
    }

    /// If the relevant source_file is empty, we don't return a line number.
    ///
    /// This method exists only for optimization and it's not part of public
    /// api.
    #[doc(hidden)]
    pub fn lookup_line_with(
        &self,
        f: Lrc<SourceFile>,
        pos: BytePos,
    ) -> Result<SourceFileAndLine, Lrc<SourceFile>> {
        match f.lookup_line(pos) {
            Some(line) => Ok(SourceFileAndLine { sf: f, line }),
            None => Err(f),
        }
    }

    pub fn lookup_char_pos_adj(&self, pos: BytePos) -> LocWithOpt {
        let loc = self.lookup_char_pos(pos);
        LocWithOpt {
            filename: loc.file.name.clone(),
            line: loc.line,
            col: loc.col,
            file: Some(loc.file),
        }
    }

    /// Returns `Some(span)`, a union of the lhs and rhs span.  The lhs must
    /// precede the rhs. If there are gaps between lhs and rhs, the
    /// resulting union will cross these gaps. For this to work, the spans
    /// have to be:
    ///
    ///    * the ctxt of both spans much match
    ///    * the lhs span needs to end on the same line the rhs span begins
    ///    * the lhs span must start at or before the rhs span
    pub fn merge_spans(&self, sp_lhs: Span, sp_rhs: Span) -> Option<Span> {
        // make sure we're at the same expansion id
        if sp_lhs.ctxt() != sp_rhs.ctxt() {
            return None;
        }

        let lhs_end = match self.lookup_line(sp_lhs.hi()) {
            Ok(x) => x,
            Err(_) => return None,
        };
        let rhs_begin = match self.lookup_line(sp_rhs.lo()) {
            Ok(x) => x,
            Err(_) => return None,
        };

        // if we must cross lines to merge, don't merge
        if lhs_end.line != rhs_begin.line {
            return None;
        }

        // ensure these follow the expected order and we don't overlap
        if (sp_lhs.lo() <= sp_rhs.lo()) && (sp_lhs.hi() <= sp_rhs.lo()) {
            Some(sp_lhs.to(sp_rhs))
        } else {
            None
        }
    }

    pub fn span_to_string(&self, sp: Span) -> String {
        if self.files.borrow().source_files.is_empty() && sp.is_dummy() {
            return "no-location".to_string();
        }

        let lo = self.lookup_char_pos_adj(sp.lo());
        let hi = self.lookup_char_pos_adj(sp.hi());
        format!(
            "{}:{}:{}: {}:{}",
            lo.filename,
            lo.line,
            lo.col.to_usize() + 1,
            hi.line,
            hi.col.to_usize() + 1
        )
    }

    pub fn span_to_filename(&self, sp: Span) -> FileName {
        self.lookup_char_pos(sp.lo()).file.name.clone()
    }

    pub fn span_to_unmapped_path(&self, sp: Span) -> FileName {
        self.lookup_char_pos(sp.lo())
            .file
            .unmapped_path
            .clone()
            .expect("SourceMap::span_to_unmapped_path called for imported SourceFile?")
    }

    pub fn is_multiline(&self, sp: Span) -> bool {
        let lo = self.lookup_char_pos(sp.lo());
        let hi = self.lookup_char_pos(sp.hi());
        lo.line != hi.line
    }

    pub fn span_to_lines(&self, sp: Span) -> FileLinesResult {
        debug!("span_to_lines(sp={:?})", sp);

        if sp.lo() > sp.hi() {
            return Err(SpanLinesError::IllFormedSpan(sp));
        }

        let lo = self.lookup_char_pos(sp.lo());
        debug!("span_to_lines: lo={:?}", lo);
        let hi = self.lookup_char_pos(sp.hi());
        debug!("span_to_lines: hi={:?}", hi);

        if lo.file.start_pos != hi.file.start_pos {
            return Err(SpanLinesError::DistinctSources(DistinctSources {
                begin: (lo.file.name.clone(), lo.file.start_pos),
                end: (hi.file.name.clone(), hi.file.start_pos),
            }));
        }
        assert!(hi.line >= lo.line);

        // Empty file contains no lines
        if lo.file.src.is_empty() {
            return Ok(FileLines {
                file: lo.file,
                lines: vec![],
            });
        }

        let mut lines = Vec::with_capacity(hi.line - lo.line + 1);

        // The span starts partway through the first line,
        // but after that it starts from offset 0.
        let mut start_col = lo.col;

        // For every line but the last, it extends from `start_col`
        // and to the end of the line. Be careful because the line
        // numbers in Loc are 1-based, so we subtract 1 to get 0-based
        // lines.
        for line_index in lo.line - 1..hi.line - 1 {
            let line_len = lo
                .file
                .get_line(line_index)
                .map(|s| s.chars().count())
                .unwrap_or(0);
            lines.push(LineInfo {
                line_index,
                start_col,
                end_col: CharPos::from_usize(line_len),
            });
            start_col = CharPos::from_usize(0);
        }

        // For the last line, it extends from `start_col` to `hi.col`:
        lines.push(LineInfo {
            line_index: hi.line - 1,
            start_col,
            end_col: hi.col,
        });

        Ok(FileLines {
            file: lo.file,
            lines,
        })
    }

    /// Extract the source surrounding the given `Span` using the
    /// `extract_source` function. The extract function takes three
    /// arguments: a string slice containing the source, an index in
    /// the slice for the beginning of the span and an index in the slice for
    /// the end of the span.
    fn span_to_source<F>(&self, sp: Span, extract_source: F) -> Result<String, SpanSnippetError>
    where
        F: Fn(&str, usize, usize) -> String,
    {
        if sp.lo() > sp.hi() {
            return Err(SpanSnippetError::IllFormedSpan(sp));
        }

        let local_begin = self.lookup_byte_offset(sp.lo());
        let local_end = self.lookup_byte_offset(sp.hi());

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
            Ok(extract_source(src, start_index, end_index))
        }
    }

    /// Return the source snippet as `String` corresponding to the given `Span`
    pub fn span_to_snippet(&self, sp: Span) -> Result<String, SpanSnippetError> {
        self.span_to_source(sp, |src, start_index, end_index| {
            src[start_index..end_index].to_string()
        })
    }

    pub fn span_to_margin(&self, sp: Span) -> Option<usize> {
        match self.span_to_prev_source(sp) {
            Err(_) => None,
            Ok(source) => source
                .split('\n')
                .last()
                .map(|last_line| last_line.len() - last_line.trim_start().len()),
        }
    }

    /// Return the source snippet as `String` before the given `Span`
    pub fn span_to_prev_source(&self, sp: Span) -> Result<String, SpanSnippetError> {
        self.span_to_source(sp, |src, start_index, _| src[..start_index].to_string())
    }

    /// Extend the given `Span` to just after the previous occurrence of `c`.
    /// Return the same span if no character could be found or if an error
    /// occurred while retrieving the code snippet.
    pub fn span_extend_to_prev_char(&self, sp: Span, c: char) -> Span {
        if let Ok(prev_source) = self.span_to_prev_source(sp) {
            let prev_source = prev_source.rsplit(c).nth(0).unwrap_or("").trim_start();
            if !prev_source.is_empty() && !prev_source.contains('\n') {
                return sp.with_lo(BytePos(sp.lo().0 - prev_source.len() as u32));
            }
        }

        sp
    }

    /// Extend the given `Span` to just after the previous occurrence of `pat`
    /// when surrounded by whitespace. Return the same span if no character
    /// could be found or if an error occurred while retrieving the code
    /// snippet.
    pub fn span_extend_to_prev_str(&self, sp: Span, pat: &str, accept_newlines: bool) -> Span {
        // assure that the pattern is delimited, to avoid the following
        //     fn my_fn()
        //           ^^^^ returned span without the check
        //     ---------- correct span
        for ws in &[" ", "\t", "\n"] {
            let pat = pat.to_owned() + ws;
            if let Ok(prev_source) = self.span_to_prev_source(sp) {
                let prev_source = prev_source.rsplit(&pat).nth(0).unwrap_or("").trim_start();
                if !prev_source.is_empty() && (!prev_source.contains('\n') || accept_newlines) {
                    return sp.with_lo(BytePos(sp.lo().0 - prev_source.len() as u32));
                }
            }
        }

        sp
    }

    /// Given a `Span`, try to get a shorter span ending before the first
    /// occurrence of `c` `char`
    pub fn span_until_char(&self, sp: Span, c: char) -> Span {
        match self.span_to_snippet(sp) {
            Ok(snippet) => {
                let snippet = snippet.split(c).nth(0).unwrap_or("").trim_end();
                if !snippet.is_empty() && !snippet.contains('\n') {
                    sp.with_hi(BytePos(sp.lo().0 + snippet.len() as u32))
                } else {
                    sp
                }
            }
            _ => sp,
        }
    }

    /// Given a `Span`, try to get a shorter span ending just after the first
    /// occurrence of `char` `c`.
    pub fn span_through_char(&self, sp: Span, c: char) -> Span {
        if let Ok(snippet) = self.span_to_snippet(sp) {
            if let Some(offset) = snippet.find(c) {
                return sp.with_hi(BytePos(sp.lo().0 + (offset + c.len_utf8()) as u32));
            }
        }
        sp
    }

    /// Given a `Span`, get a new `Span` covering the first token and all its
    /// trailing whitespace or the original `Span`.
    ///
    /// If `sp` points to `"let mut x"`, then a span pointing at `"let "` will
    /// be returned.
    pub fn span_until_non_whitespace(&self, sp: Span) -> Span {
        let mut whitespace_found = false;

        self.span_take_while(sp, |c| {
            if !whitespace_found && c.is_whitespace() {
                whitespace_found = true;
            }

            !(whitespace_found && !c.is_whitespace())
        })
    }

    /// Given a `Span`, get a new `Span` covering the first token without its
    /// trailing whitespace or the original `Span` in case of error.
    ///
    /// If `sp` points to `"let mut x"`, then a span pointing at `"let"` will be
    /// returned.
    pub fn span_until_whitespace(&self, sp: Span) -> Span {
        self.span_take_while(sp, |c| !c.is_whitespace())
    }

    /// Given a `Span`, get a shorter one until `predicate` yields false.
    pub fn span_take_while<P>(&self, sp: Span, predicate: P) -> Span
    where
        P: for<'r> FnMut(&'r char) -> bool,
    {
        if let Ok(snippet) = self.span_to_snippet(sp) {
            let offset = snippet
                .chars()
                .take_while(predicate)
                .map(|c| c.len_utf8())
                .sum::<usize>();

            sp.with_hi(BytePos(sp.lo().0 + (offset as u32)))
        } else {
            sp
        }
    }

    pub fn def_span(&self, sp: Span) -> Span {
        self.span_until_char(sp, '{')
    }

    /// Returns a new span representing just the start-point of this span
    pub fn start_point(&self, sp: Span) -> Span {
        let pos = sp.lo().0;
        let width = self.find_width_of_character_at_span(sp, false);
        let corrected_start_position = pos.checked_add(width).unwrap_or(pos);
        let end_point = BytePos(cmp::max(corrected_start_position, sp.lo().0));
        sp.with_hi(end_point)
    }

    /// Returns a new span representing just the end-point of this span
    pub fn end_point(&self, sp: Span) -> Span {
        let pos = sp.hi().0;

        let width = self.find_width_of_character_at_span(sp, false);
        let corrected_end_position = pos.checked_sub(width).unwrap_or(pos);

        let end_point = BytePos(cmp::max(corrected_end_position, sp.lo().0));
        sp.with_lo(end_point)
    }

    /// Returns a new span representing the next character after the end-point
    /// of this span
    pub fn next_point(&self, sp: Span) -> Span {
        let start_of_next_point = sp.hi().0;

        let width = self.find_width_of_character_at_span(sp, true);
        // If the width is 1, then the next span should point to the same `lo` and `hi`.
        // However, in the case of a multibyte character, where the width != 1,
        // the next span should span multiple bytes to include the whole
        // character.
        let end_of_next_point = start_of_next_point
            .checked_add(width - 1)
            .unwrap_or(start_of_next_point);

        let end_of_next_point = BytePos(cmp::max(sp.lo().0 + 1, end_of_next_point));
        Span::new(BytePos(start_of_next_point), end_of_next_point, sp.ctxt())
    }

    /// Finds the width of a character, either before or after the provided
    /// span.
    fn find_width_of_character_at_span(&self, sp: Span, forwards: bool) -> u32 {
        // Disregard malformed spans and assume a one-byte wide character.
        if sp.lo() >= sp.hi() {
            debug!("find_width_of_character_at_span: early return malformed span");
            return 1;
        }

        let local_begin = self.lookup_byte_offset(sp.lo());
        let local_end = self.lookup_byte_offset(sp.hi());
        debug!(
            "find_width_of_character_at_span: local_begin=`{:?}`, local_end=`{:?}`",
            local_begin, local_end
        );

        let start_index = local_begin.pos.to_usize();
        let end_index = local_end.pos.to_usize();
        debug!(
            "find_width_of_character_at_span: start_index=`{:?}`, end_index=`{:?}`",
            start_index, end_index
        );

        // Disregard indexes that are at the start or end of their spans, they can't fit
        // bigger characters.
        if (!forwards && end_index == usize::min_value())
            || (forwards && start_index == usize::max_value())
        {
            debug!("find_width_of_character_at_span: start or end of span, cannot be multibyte");
            return 1;
        }

        let source_len = (local_begin.sf.end_pos - local_begin.sf.start_pos).to_usize();
        debug!(
            "find_width_of_character_at_span: source_len=`{:?}`",
            source_len
        );
        // Ensure indexes are also not malformed.
        if start_index > end_index || end_index > source_len {
            debug!("find_width_of_character_at_span: source indexes are malformed");
            return 1;
        }

        // We need to extend the snippet to the end of the src rather than to end_index
        // so when searching forwards for boundaries we've got somewhere to
        // search.
        let src = &local_begin.sf.src;
        let snippet = {
            let len = src.len();
            &src[start_index..len]
        };
        debug!("find_width_of_character_at_span: snippet=`{:?}`", snippet);

        let mut target = if forwards {
            end_index + 1
        } else {
            end_index - 1
        };
        debug!(
            "find_width_of_character_at_span: initial target=`{:?}`",
            target
        );

        while !snippet.is_char_boundary(target - start_index) && target < source_len {
            target = if forwards {
                target + 1
            } else {
                match target.checked_sub(1) {
                    Some(target) => target,
                    None => {
                        break;
                    }
                }
            };
            debug!("find_width_of_character_at_span: target=`{:?}`", target);
        }
        debug!(
            "find_width_of_character_at_span: final target=`{:?}`",
            target
        );

        if forwards {
            (target - end_index) as u32
        } else {
            (end_index - target) as u32
        }
    }

    pub fn get_source_file(&self, filename: &FileName) -> Option<Lrc<SourceFile>> {
        for sf in self.files.borrow().source_files.iter() {
            if *filename == sf.name {
                return Some(sf.clone());
            }
        }
        None
    }

    /// For a global BytePos compute the local offset within the containing
    /// SourceFile
    pub fn lookup_byte_offset(&self, bpos: BytePos) -> SourceFileAndBytePos {
        let sf = self.lookup_source_file(bpos);
        let offset = bpos - sf.start_pos;
        SourceFileAndBytePos { sf, pos: offset }
    }

    /// Converts an absolute BytePos to a CharPos relative to the source_file.
    fn bytepos_to_file_charpos(&self, bpos: BytePos) -> CharPos {
        let map = self.lookup_source_file(bpos);

        self.bytepos_to_file_charpos_with(&map, bpos)
    }

    fn bytepos_to_file_charpos_with(&self, map: &SourceFile, bpos: BytePos) -> CharPos {
        let total_extra_bytes = self.calc_extra_bytes(map, &mut 0, bpos);
        assert!(
            map.start_pos.to_u32() + total_extra_bytes <= bpos.to_u32(),
            "map.start_pos = {:?}; total_extra_bytes = {}; bpos = {:?}",
            map.start_pos,
            total_extra_bytes,
            bpos,
        );
        CharPos(bpos.to_usize() - map.start_pos.to_usize() - total_extra_bytes as usize)
    }

    /// Converts an absolute BytePos to a CharPos relative to the source_file.
    fn calc_extra_bytes(&self, map: &SourceFile, start: &mut usize, bpos: BytePos) -> u32 {
        // The number of extra bytes due to multibyte chars in the SourceFile
        let mut total_extra_bytes = 0;

        for (i, &mbc) in map.multibyte_chars[*start..].iter().enumerate() {
            debug!("{}-byte char at {:?}", mbc.bytes, mbc.pos);
            if mbc.pos < bpos {
                // every character is at least one byte, so we only
                // count the actual extra bytes.
                total_extra_bytes += mbc.bytes as u32 - 1;
                // We should never see a byte position in the middle of a
                // character
                debug_assert!(bpos.to_u32() >= mbc.pos.to_u32() + mbc.bytes as u32);
            } else {
                *start += i;
                break;
            }
        }

        total_extra_bytes
    }

    /// Return the index of the source_file (in self.files) which contains pos.
    ///
    /// This method exists only for optimization and it's not part of public
    /// api.
    #[doc(hidden)]
    pub fn lookup_source_file_in(
        files: &[Lrc<SourceFile>],
        pos: BytePos,
    ) -> Option<Lrc<SourceFile>> {
        let count = files.len();

        // Binary search for the source_file.
        let mut a = 0;
        let mut b = count;
        while b - a > 1 {
            let m = (a + b) / 2;
            if files[m].start_pos > pos {
                b = m;
            } else {
                a = m;
            }
        }

        if a >= count {
            return None;
        }

        Some(files[a].clone())
    }

    /// Return the index of the source_file (in self.files) which contains pos.
    ///
    /// This is not a public api.
    #[doc(hidden)]
    pub fn lookup_source_file(&self, pos: BytePos) -> Lrc<SourceFile> {
        let files = self.files.borrow();
        let files = &files.source_files;
        let fm = Self::lookup_source_file_in(&files, pos);
        match fm {
            Some(fm) => fm,
            None => {
                panic!(
                    "position {} does not resolve to a source location",
                    pos.to_usize()
                );
            }
        }
    }

    pub fn count_lines(&self) -> usize {
        self.files().iter().fold(0, |a, f| a + f.count_lines())
    }

    pub fn generate_fn_name_span(&self, span: Span) -> Option<Span> {
        let prev_span = self.span_extend_to_prev_str(span, "fn", true);
        self.span_to_snippet(prev_span)
            .map(|snippet| {
                let len = snippet
                    .find(|c: char| !c.is_alphanumeric() && c != '_')
                    .expect("no label after fn");
                prev_span.with_hi(BytePos(prev_span.lo().0 + len as u32))
            })
            .ok()
    }

    /// Take the span of a type parameter in a function signature and try to
    /// generate a span for the function name (with generics) and a new
    /// snippet for this span with the pointed type parameter as a new local
    /// type parameter.
    ///
    /// For instance:
    /// ```rust,ignore (pseudo-Rust)
    /// // Given span
    /// fn my_function(param: T)
    /// //                    ^ Original span
    ///
    /// // Result
    /// fn my_function(param: T)
    /// // ^^^^^^^^^^^ Generated span with snippet `my_function<T>`
    /// ```
    ///
    /// Attention: The method used is very fragile since it essentially
    /// duplicates the work of the parser. If you need to use this function
    /// or something similar, please consider updating the source_map
    /// functions and this function to something more robust.
    pub fn generate_local_type_param_snippet(&self, span: Span) -> Option<(Span, String)> {
        // Try to extend the span to the previous "fn" keyword to retrieve the function
        // signature
        let sugg_span = self.span_extend_to_prev_str(span, "fn", false);
        if sugg_span != span {
            if let Ok(snippet) = self.span_to_snippet(sugg_span) {
                // Consume the function name
                let mut offset = snippet
                    .find(|c: char| !c.is_alphanumeric() && c != '_')
                    .expect("no label after fn");

                // Consume the generics part of the function signature
                let mut bracket_counter = 0;
                let mut last_char = None;
                for c in snippet[offset..].chars() {
                    match c {
                        '<' => bracket_counter += 1,
                        '>' => bracket_counter -= 1,
                        '(' => {
                            if bracket_counter == 0 {
                                break;
                            }
                        }
                        _ => {}
                    }
                    offset += c.len_utf8();
                    last_char = Some(c);
                }

                // Adjust the suggestion span to encompass the function name with its generics
                let sugg_span = sugg_span.with_hi(BytePos(sugg_span.lo().0 + offset as u32));

                // Prepare the new suggested snippet to append the type parameter that triggered
                // the error in the generics of the function signature
                let mut new_snippet = if last_char == Some('>') {
                    format!("{}, ", &snippet[..(offset - '>'.len_utf8())])
                } else {
                    format!("{}<", &snippet[..offset])
                };
                new_snippet.push_str(
                    &self
                        .span_to_snippet(span)
                        .unwrap_or_else(|_| "T".to_string()),
                );
                new_snippet.push('>');

                return Some((sugg_span, new_snippet));
            }
        }

        None
    }

    ///
    #[cfg(feature = "sourcemap")]
    pub fn build_source_map(&self, mappings: &mut Vec<(BytePos, LineCol)>) -> sourcemap::SourceMap {
        self.build_source_map_from(mappings, None)
    }

    /// Creates a `.map` file.
    #[cfg(feature = "sourcemap")]
    pub fn build_source_map_from(
        &self,
        mappings: &mut Vec<(BytePos, LineCol)>,
        orig: Option<&sourcemap::SourceMap>,
    ) -> sourcemap::SourceMap {
        let mut builder = SourceMapBuilder::new(None);

        let mut src_id = 0u32;

        if let Some(orig) = orig {
            for (idx, src) in orig.sources().enumerate() {
                builder.set_source(idx as _, src);
                src_id = idx as u32 + 1;
            }
            for (idx, contents) in orig.source_contents().enumerate() {
                builder.set_source_contents(idx as _, contents);
            }
        }

        // // This method is optimized based on the fact that mapping is sorted.
        // mappings.sort_by_key(|v| v.0);

        let mut cur_file: Option<Lrc<SourceFile>> = None;

        let mut ch_start = 0;
        let mut line_ch_start = 0;

        for (pos, lc) in mappings.iter() {
            let pos = *pos;
            let lc = *lc;

            // TODO: Use correct algorithm
            if pos >= BytePos(4294967295) {
                continue;
            }

            let f;
            let f = match cur_file {
                Some(ref f) if f.start_pos <= pos && pos < f.end_pos => f,
                _ => {
                    f = self.lookup_source_file(pos);
                    src_id = builder.add_source(&f.name.to_string());
                    builder.set_source_contents(src_id, Some(&f.src));
                    cur_file = Some(f.clone());
                    ch_start = 0;
                    line_ch_start = 0;
                    &f
                }
            };

            let a = match f.lookup_line(pos) {
                Some(line) => line as u32,
                None => continue,
            };

            let mut line = a + 1; // Line numbers start at 1
            let linebpos = f.lines[a as usize];
            debug_assert!(
                pos >= linebpos,
                "{}: bpos = {:?}; linebpos = {:?};",
                f.name,
                pos,
                linebpos,
            );
            let chpos = pos.to_u32() - self.calc_extra_bytes(&f, &mut ch_start, pos);
            let linechpos =
                linebpos.to_u32() - self.calc_extra_bytes(&f, &mut line_ch_start, linebpos);

            let mut col = max(chpos, linechpos) - min(chpos, linechpos);

            if let Some(orig) = &orig {
                if let Some(token) = orig.lookup_token(line, col) {
                    line = token.get_src_line() + 1;
                    col = token.get_src_col();
                    if let Some(src) = token.get_source() {
                        src_id = builder.add_source(src);
                    }
                }
            }

            builder.add_raw(lc.line, lc.col, line - 1, col, Some(src_id), None);
        }

        builder.into_sourcemap()
    }
}

impl SourceMapper for SourceMap {
    fn lookup_char_pos(&self, pos: BytePos) -> Loc {
        self.lookup_char_pos(pos)
    }
    fn span_to_lines(&self, sp: Span) -> FileLinesResult {
        self.span_to_lines(sp)
    }
    fn span_to_string(&self, sp: Span) -> String {
        self.span_to_string(sp)
    }
    fn span_to_filename(&self, sp: Span) -> FileName {
        self.span_to_filename(sp)
    }
    fn merge_spans(&self, sp_lhs: Span, sp_rhs: Span) -> Option<Span> {
        self.merge_spans(sp_lhs, sp_rhs)
    }
    fn call_span_if_macro(&self, sp: Span) -> Span {
        sp
    }
    fn doctest_offset_line(&self, line: usize) -> usize {
        self.doctest_offset_line(line)
    }
}

#[derive(Clone)]
pub struct FilePathMapping {
    mapping: Vec<(PathBuf, PathBuf)>,
}

impl FilePathMapping {
    pub fn empty() -> FilePathMapping {
        FilePathMapping { mapping: vec![] }
    }

    pub fn new(mapping: Vec<(PathBuf, PathBuf)>) -> FilePathMapping {
        FilePathMapping { mapping }
    }

    /// Applies any path prefix substitution as defined by the mapping.
    /// The return value is the remapped path and a boolean indicating whether
    /// the path was affected by the mapping.
    pub fn map_prefix(&self, path: PathBuf) -> (PathBuf, bool) {
        // NOTE: We are iterating over the mapping entries from last to first
        //       because entries specified later on the command line should
        //       take precedence.
        for &(ref from, ref to) in self.mapping.iter().rev() {
            if let Ok(rest) = path.strip_prefix(from) {
                return (to.join(rest), true);
            }
        }

        (path, false)
    }
}

// _____________________________________________________________________________
// Tests
//

#[cfg(test)]
mod tests {
    use super::*;
    use crate::sync::Lrc;

    fn init_source_map() -> SourceMap {
        let sm = SourceMap::new(FilePathMapping::empty());
        sm.new_source_file(
            PathBuf::from("blork.rs").into(),
            "first line.\nsecond line".to_string(),
        );
        sm.new_source_file(PathBuf::from("empty.rs").into(), String::new());
        sm.new_source_file(
            PathBuf::from("blork2.rs").into(),
            "first line.\nsecond line".to_string(),
        );
        sm
    }

    #[test]
    fn t3() {
        // Test lookup_byte_offset
        let sm = init_source_map();

        let srcfbp1 = sm.lookup_byte_offset(BytePos(23));
        assert_eq!(srcfbp1.sf.name, PathBuf::from("blork.rs").into());
        assert_eq!(srcfbp1.pos, BytePos(23));

        let srcfbp1 = sm.lookup_byte_offset(BytePos(24));
        assert_eq!(srcfbp1.sf.name, PathBuf::from("empty.rs").into());
        assert_eq!(srcfbp1.pos, BytePos(0));

        let srcfbp2 = sm.lookup_byte_offset(BytePos(25));
        assert_eq!(srcfbp2.sf.name, PathBuf::from("blork2.rs").into());
        assert_eq!(srcfbp2.pos, BytePos(0));
    }

    #[test]
    fn t4() {
        // Test bytepos_to_file_charpos
        let sm = init_source_map();

        let cp1 = sm.bytepos_to_file_charpos(BytePos(22));
        assert_eq!(cp1, CharPos(22));

        let cp2 = sm.bytepos_to_file_charpos(BytePos(25));
        assert_eq!(cp2, CharPos(0));
    }

    #[test]
    fn t5() {
        // Test zero-length source_files.
        let sm = init_source_map();

        let loc1 = sm.lookup_char_pos(BytePos(22));
        assert_eq!(loc1.file.name, PathBuf::from("blork.rs").into());
        assert_eq!(loc1.line, 2);
        assert_eq!(loc1.col, CharPos(10));

        let loc2 = sm.lookup_char_pos(BytePos(25));
        assert_eq!(loc2.file.name, PathBuf::from("blork2.rs").into());
        assert_eq!(loc2.line, 1);
        assert_eq!(loc2.col, CharPos(0));
    }

    fn init_source_map_mbc() -> SourceMap {
        let sm = SourceMap::new(FilePathMapping::empty());
        // € is a three byte utf8 char.
        sm.new_source_file(
            PathBuf::from("blork.rs").into(),
            "fir€st €€€€ line.\nsecond line".to_string(),
        );
        sm.new_source_file(
            PathBuf::from("blork2.rs").into(),
            "first line€€.\n€ second line".to_string(),
        );
        sm
    }

    #[test]
    fn t6() {
        // Test bytepos_to_file_charpos in the presence of multi-byte chars
        let sm = init_source_map_mbc();

        let cp1 = sm.bytepos_to_file_charpos(BytePos(3));
        assert_eq!(cp1, CharPos(3));

        let cp2 = sm.bytepos_to_file_charpos(BytePos(6));
        assert_eq!(cp2, CharPos(4));

        let cp3 = sm.bytepos_to_file_charpos(BytePos(56));
        assert_eq!(cp3, CharPos(12));

        let cp4 = sm.bytepos_to_file_charpos(BytePos(61));
        assert_eq!(cp4, CharPos(15));
    }

    #[test]
    fn t7() {
        // Test span_to_lines for a span ending at the end of source_file
        let sm = init_source_map();
        let span = Span::new(BytePos(12), BytePos(23), NO_EXPANSION);
        let file_lines = sm.span_to_lines(span).unwrap();

        assert_eq!(file_lines.file.name, PathBuf::from("blork.rs").into());
        assert_eq!(file_lines.lines.len(), 1);
        assert_eq!(file_lines.lines[0].line_index, 1);
    }

    /// Given a string like " ~~~~~~~~~~~~ ", produces a span
    /// converting that range. The idea is that the string has the same
    /// length as the input, and we uncover the byte positions.  Note
    /// that this can span lines and so on.
    fn span_from_selection(input: &str, selection: &str) -> Span {
        assert_eq!(input.len(), selection.len());
        let left_index = selection.find('~').unwrap() as u32;
        let right_index = selection.rfind('~').map(|x| x as u32).unwrap_or(left_index);
        Span::new(BytePos(left_index), BytePos(right_index + 1), NO_EXPANSION)
    }

    /// Test span_to_snippet and span_to_lines for a span converting 3
    /// lines in the middle of a file.
    #[test]
    fn span_to_snippet_and_lines_spanning_multiple_lines() {
        let sm = SourceMap::new(FilePathMapping::empty());
        let inputtext = "aaaaa\nbbbbBB\nCCC\nDDDDDddddd\neee\n";
        let selection = "     \n    ~~\n~~~\n~~~~~     \n   \n";
        sm.new_source_file(
            Path::new("blork.rs").to_owned().into(),
            inputtext.to_string(),
        );
        let span = span_from_selection(inputtext, selection);

        // check that we are extracting the text we thought we were extracting
        assert_eq!(&sm.span_to_snippet(span).unwrap(), "BB\nCCC\nDDDDD");

        // check that span_to_lines gives us the complete result with the lines/cols we
        // expected
        let lines = sm.span_to_lines(span).unwrap();
        let expected = vec![
            LineInfo {
                line_index: 1,
                start_col: CharPos(4),
                end_col: CharPos(6),
            },
            LineInfo {
                line_index: 2,
                start_col: CharPos(0),
                end_col: CharPos(3),
            },
            LineInfo {
                line_index: 3,
                start_col: CharPos(0),
                end_col: CharPos(5),
            },
        ];
        assert_eq!(lines.lines, expected);
    }

    #[test]
    fn t8() {
        // Test span_to_snippet for a span ending at the end of source_file
        let sm = init_source_map();
        let span = Span::new(BytePos(12), BytePos(23), NO_EXPANSION);
        let snippet = sm.span_to_snippet(span);

        assert_eq!(snippet, Ok("second line".to_string()));
    }

    #[test]
    fn t9() {
        // Test span_to_str for a span ending at the end of source_file
        let sm = init_source_map();
        let span = Span::new(BytePos(12), BytePos(23), NO_EXPANSION);
        let sstr = sm.span_to_string(span);

        assert_eq!(sstr, "blork.rs:2:1: 2:12");
    }

    #[test]
    fn t10() {
        // Test span_to_lines for a span of empty file
        let sm = SourceMap::new(FilePathMapping::empty());
        sm.new_source_file(PathBuf::from("blork.rs").into(), "".to_string());
        let span = Span::new(BytePos(0), BytePos(0), NO_EXPANSION);
        let file_lines = sm.span_to_lines(span).unwrap();

        assert_eq!(file_lines.file.name, PathBuf::from("blork.rs").into());
        assert_eq!(file_lines.lines.len(), 0);
    }

    /// Test failing to merge two spans on different lines
    #[test]
    fn span_merging_fail() {
        let sm = SourceMap::new(FilePathMapping::empty());
        let inputtext = "bbbb BB\ncc CCC\n";
        let selection1 = "     ~~\n      \n";
        let selection2 = "       \n   ~~~\n";
        sm.new_source_file(
            Path::new("blork.rs").to_owned().into(),
            inputtext.to_owned(),
        );
        let span1 = span_from_selection(inputtext, selection1);
        let span2 = span_from_selection(inputtext, selection2);

        assert!(sm.merge_spans(span1, span2).is_none());
    }

    /// Returns the span corresponding to the `n`th occurrence of
    /// `substring` in `source_text`.
    trait SourceMapExtension {
        fn span_substr(
            &self,
            file: &Lrc<SourceFile>,
            source_text: &str,
            substring: &str,
            n: usize,
        ) -> Span;
    }

    impl SourceMapExtension for SourceMap {
        fn span_substr(
            &self,
            file: &Lrc<SourceFile>,
            source_text: &str,
            substring: &str,
            n: usize,
        ) -> Span {
            let mut i = 0;
            let mut hi = 0;
            loop {
                let offset = source_text[hi..].find(substring).unwrap_or_else(|| {
                    panic!(
                        "source_text `{}` does not have {} occurrences of `{}`, only {}",
                        source_text, n, substring, i
                    );
                });
                let lo = hi + offset;
                hi = lo + substring.len();
                if i == n {
                    let span = Span::new(
                        BytePos(lo as u32 + file.start_pos.0),
                        BytePos(hi as u32 + file.start_pos.0),
                        NO_EXPANSION,
                    );
                    assert_eq!(&self.span_to_snippet(span).unwrap()[..], substring);
                    return span;
                }
                i += 1;
            }
        }
    }
}
