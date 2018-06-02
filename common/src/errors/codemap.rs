use rustc_data_structures::sync::Lrc;
use rustc_errors::CodeMapper;
use std::cell::{Ref, RefCell};
use std::io::{self, Read};
use std::path::{Path, PathBuf};
use std::{env, fs};
use syntax_pos::*;

pub struct CodeMap {
    files: RefCell<Vec<Lrc<FileMap>>>,
    file_loader: Box<FileLoader>,
    path_mapping: FilePathMapping,
}

impl CodeMap {
    pub fn new(path_mapping: FilePathMapping) -> Self {
        Self::with_file_loader(box RealFileLoader, path_mapping)
    }

    pub fn with_file_loader(file_loader: Box<FileLoader>, path_mapping: FilePathMapping) -> Self {
        CodeMap {
            files: Default::default(),
            file_loader,
            path_mapping,
        }
    }

    pub fn path_mapping(&self) -> &FilePathMapping {
        &self.path_mapping
    }

    pub fn file_exists(&self, path: &Path) -> bool {
        self.file_loader.file_exists(path)
    }

    pub fn load_file(&self, path: &Path) -> io::Result<Lrc<FileMap>> {
        let src = self.file_loader.read_file(path)?;
        let filename = path.to_owned().into();
        Ok(self.new_filemap(filename, src))
    }

    pub fn load_file_and_lines(&self, path: &Path) -> io::Result<Lrc<FileMap>> {
        let src = self.file_loader.read_file(path)?;
        let filename = path.to_owned().into();
        Ok(self.new_filemap_and_lines(filename, src))
    }

    pub fn files(&self) -> Ref<Vec<Lrc<FileMap>>> {
        self.files.borrow()
    }

    fn next_start_pos(&self) -> usize {
        let files = self.files.borrow();
        match files.last() {
            None => 0,
            // Add one so there is some space between files. This lets us distinguish
            // positions in the codemap, even in the presence of zero-length files.
            Some(last) => last.end_pos.to_usize() + 1,
        }
    }

    /// Creates a new filemap without setting its line information. If you don't
    /// intend to set the line information yourself, you should use
    /// new_filemap_and_lines.
    pub fn new_filemap(&self, filename: FileName, src: String) -> Lrc<FileMap> {
        let start_pos = self.next_start_pos();
        let mut files = self.files.borrow_mut();

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
        let filemap = Lrc::new(FileMap::new(
            filename,
            was_remapped,
            unmapped_path,
            src,
            Pos::from_usize(start_pos),
        ));

        files.push(filemap.clone());

        filemap
    }

    /// Creates a new filemap and sets its line information.
    pub fn new_filemap_and_lines(&self, filename: FileName, src: String) -> Lrc<FileMap> {
        // TODO
        let fm = self.new_filemap(filename, src.clone());
        let mut byte_pos: u32 = fm.start_pos.0;
        for line in src.lines() {
            // register the start of this line
            fm.next_line(BytePos(byte_pos));

            // update byte_pos to include this line and the \n at the end
            byte_pos += line.len() as u32 + 1;
        }
        fm
    }

    /// Lookup source information about a BytePos
    pub fn lookup_char_pos(&self, pos: BytePos) -> Loc {
        let chpos = self.bytepos_to_file_charpos(pos);
        match self.lookup_line(pos) {
            Ok(FileMapAndLine { fm: f, line: a }) => {
                let line = a + 1; // Line numbers start at 1
                let linebpos = (*f.lines.borrow())[a];
                let linechpos = self.bytepos_to_file_charpos(linebpos);
                let col = chpos - linechpos;

                let col_display = {
                    let non_narrow_chars = f.non_narrow_chars.borrow();
                    let start_width_idx = non_narrow_chars
                        .binary_search_by_key(&linebpos, |x| x.pos())
                        .unwrap_or_else(|x| x);
                    let end_width_idx = non_narrow_chars
                        .binary_search_by_key(&pos, |x| x.pos())
                        .unwrap_or_else(|x| x);
                    let special_chars = end_width_idx - start_width_idx;
                    let non_narrow: usize = non_narrow_chars[start_width_idx..end_width_idx]
                        .into_iter()
                        .map(|x| x.width())
                        .sum();
                    col.0 - special_chars + non_narrow
                };
                // debug!(
                //     "byte pos {:?} is on the line at byte pos {:?}",
                //     pos, linebpos
                // );
                // debug!(
                //     "char pos {:?} is on the line at char pos {:?}",
                //     chpos, linechpos
                // );
                // debug!("byte is on line: {}", line);
                assert!(chpos >= linechpos);
                Loc {
                    file: f,
                    line,
                    col,
                    col_display,
                }
            }
            Err(f) => {
                let col_display = {
                    let non_narrow_chars = f.non_narrow_chars.borrow();
                    let end_width_idx = non_narrow_chars
                        .binary_search_by_key(&pos, |x| x.pos())
                        .unwrap_or_else(|x| x);
                    let non_narrow: usize = non_narrow_chars[0..end_width_idx]
                        .into_iter()
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

    // If the relevant filemap is empty, we don't return a line number.
    pub fn lookup_line(&self, pos: BytePos) -> Result<FileMapAndLine, Lrc<FileMap>> {
        let idx = self.lookup_filemap_idx(pos);

        let files = self.files.borrow();
        let f = (*files)[idx].clone();

        match f.lookup_line(pos) {
            Some(line) => Ok(FileMapAndLine { fm: f, line }),
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
        if self.files.borrow().is_empty() && sp.source_equal(&DUMMY_SP) {
            return "no-location".to_string();
        }

        let lo = self.lookup_char_pos_adj(sp.lo());
        let hi = self.lookup_char_pos_adj(sp.hi());
        return (format!(
            "{}:{}:{}: {}:{}",
            lo.filename,
            lo.line,
            lo.col.to_usize() + 1,
            hi.line,
            hi.col.to_usize() + 1
        )).to_string();
    }

    pub fn span_to_filename(&self, sp: Span) -> FileName {
        self.lookup_char_pos(sp.lo()).file.name.clone()
    }

    pub fn span_to_unmapped_path(&self, sp: Span) -> FileName {
        self.lookup_char_pos(sp.lo())
            .file
            .unmapped_path
            .clone()
            .expect("CodeMap::span_to_unmapped_path called for imported FileMap?")
    }

    pub fn is_multiline(&self, sp: Span) -> bool {
        let lo = self.lookup_char_pos(sp.lo());
        let hi = self.lookup_char_pos(sp.hi());
        lo.line != hi.line
    }

    pub fn span_to_lines(&self, sp: Span) -> FileLinesResult {
        // debug!("span_to_lines(sp={:?})", sp);

        if sp.lo() > sp.hi() {
            return Err(SpanLinesError::IllFormedSpan(sp));
        }

        let lo = self.lookup_char_pos(sp.lo());
        // debug!("span_to_lines: lo={:?}", lo);
        let hi = self.lookup_char_pos(sp.hi());
        // debug!("span_to_lines: hi={:?}", hi);

        if lo.file.start_pos != hi.file.start_pos {
            return Err(SpanLinesError::DistinctSources(DistinctSources {
                begin: (lo.file.name.clone(), lo.file.start_pos),
                end: (hi.file.name.clone(), hi.file.start_pos),
            }));
        }
        assert!(hi.line >= lo.line);

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

    pub fn span_to_snippet(&self, sp: Span) -> Result<String, SpanSnippetError> {
        if sp.lo() > sp.hi() {
            return Err(SpanSnippetError::IllFormedSpan(sp));
        }

        let local_begin = self.lookup_byte_offset(sp.lo());
        let local_end = self.lookup_byte_offset(sp.hi());

        if local_begin.fm.start_pos != local_end.fm.start_pos {
            return Err(SpanSnippetError::DistinctSources(DistinctSources {
                begin: (local_begin.fm.name.clone(), local_begin.fm.start_pos),
                end: (local_end.fm.name.clone(), local_end.fm.start_pos),
            }));
        } else {
            let start_index = local_begin.pos.to_usize();
            let end_index = local_end.pos.to_usize();
            let source_len = (local_begin.fm.end_pos - local_begin.fm.start_pos).to_usize();

            if start_index > end_index || end_index > source_len {
                return Err(SpanSnippetError::MalformedForCodemap(
                    MalformedCodemapPositions {
                        name: local_begin.fm.name.clone(),
                        source_len,
                        begin_pos: local_begin.pos,
                        end_pos: local_end.pos,
                    },
                ));
            }

            if let Some(ref src) = local_begin.fm.src {
                return Ok((&src[start_index..end_index]).to_string());
            } else {
                return Err(SpanSnippetError::SourceNotAvailable {
                    filename: local_begin.fm.name.clone(),
                });
            }
        }
    }

    /// Given a `Span`, try to get a shorter span ending before the first
    /// occurrence of `c` `char`
    pub fn span_until_char(&self, sp: Span, c: char) -> Span {
        match self.span_to_snippet(sp) {
            Ok(snippet) => {
                let snippet = snippet.split(c).nth(0).unwrap_or("").trim_right();
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

    pub fn def_span(&self, sp: Span) -> Span {
        self.span_until_char(sp, '{')
    }

    pub fn get_filemap(&self, filename: &FileName) -> Option<Lrc<FileMap>> {
        for fm in self.files.borrow().iter() {
            if *filename == fm.name {
                return Some(fm.clone());
            }
        }
        None
    }

    /// For a global BytePos compute the local offset within the containing
    /// FileMap
    pub fn lookup_byte_offset(&self, bpos: BytePos) -> FileMapAndBytePos {
        let idx = self.lookup_filemap_idx(bpos);
        let fm = (*self.files.borrow())[idx].clone();
        let offset = bpos - fm.start_pos;
        FileMapAndBytePos { fm, pos: offset }
    }

    /// Converts an absolute BytePos to a CharPos relative to the filemap.
    pub fn bytepos_to_file_charpos(&self, bpos: BytePos) -> CharPos {
        let idx = self.lookup_filemap_idx(bpos);
        let files = self.files.borrow();
        let map = &(*files)[idx];

        // The number of extra bytes due to multibyte chars in the FileMap
        let mut total_extra_bytes = 0;

        for mbc in map.multibyte_chars.borrow().iter() {
            // debug!("{}-byte char at {:?}", mbc.bytes, mbc.pos);
            if mbc.pos < bpos {
                // every character is at least one byte, so we only
                // count the actual extra bytes.
                total_extra_bytes += mbc.bytes - 1;
                // We should never see a byte position in the middle of a
                // character
                assert!(bpos.to_usize() >= mbc.pos.to_usize() + mbc.bytes);
            } else {
                break;
            }
        }

        assert!(map.start_pos.to_usize() + total_extra_bytes <= bpos.to_usize());
        CharPos(bpos.to_usize() - map.start_pos.to_usize() - total_extra_bytes)
    }

    // Return the index of the filemap (in self.files) which contains pos.
    pub fn lookup_filemap_idx(&self, pos: BytePos) -> usize {
        let files = self.files.borrow();
        let files = &*files;
        let count = files.len();

        // Binary search for the filemap.
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

        assert!(
            a < count,
            "position {} does not resolve to a source location",
            pos.to_usize()
        );

        return a;
    }

    fn ensure_filemap_source_present(&self, file_map: Lrc<FileMap>) -> bool {
        file_map.add_external_src(|| match file_map.name {
            FileName::Real(ref name) => self.file_loader.read_file(name).ok(),
            _ => None,
        })
    }
    pub fn count_lines(&self) -> usize {
        self.files().iter().fold(0, |a, f| a + f.count_lines())
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

impl CodeMapper for CodeMap {
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
        if self.span_to_filename(sp.clone()).is_macros() {
            let v = sp.macro_backtrace();
            if let Some(use_site) = v.last() {
                return use_site.call_site;
            }
        }
        sp
    }
    fn ensure_filemap_source_present(&self, file_map: Lrc<FileMap>) -> bool {
        self.ensure_filemap_source_present(file_map)
    }
    /// No op.
    fn doctest_offset_line(&self, orig: usize) -> usize {
        orig
    }
}
