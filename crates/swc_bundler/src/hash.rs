use std::io;

use anyhow::{Context, Error};
use crc::{Crc, Digest, CRC_64_ECMA_182};
use swc_common::{sync::Lrc, BytePos, SourceMap, Span};
use swc_ecma_ast::{EsVersion, Module};
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};

pub(crate) fn calc_hash(cm: Lrc<SourceMap>, m: &Module) -> Result<String, Error> {
    let crc = Crc::<u64>::new(&CRC_64_ECMA_182);
    let digest = crc.digest();
    let mut buf = Hasher { digest };

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm,
            comments: None,
            wr: Box::new(&mut buf) as Box<dyn WriteJs>,
        };

        emitter
            .emit_module(m)
            .context("failed to emit module to calculate hash")?;
    }
    //

    let result = buf.digest.finalize();
    Ok(radix_fmt::radix(result, 36).to_string())
}

struct Hasher<'a> {
    digest: Digest<'a, u64>,
}

impl Hasher<'_> {
    fn w(&mut self, s: &str) {
        self.digest.update(s.as_bytes());
    }
}

impl WriteJs for &mut Hasher<'_> {
    fn increase_indent(&mut self) -> io::Result<()> {
        Ok(())
    }

    fn decrease_indent(&mut self) -> io::Result<()> {
        Ok(())
    }

    fn write_semi(&mut self, _: Option<Span>) -> io::Result<()> {
        self.w(";");
        Ok(())
    }

    fn write_space(&mut self) -> io::Result<()> {
        self.w(" ");
        Ok(())
    }

    fn write_keyword(&mut self, _: Option<Span>, s: &'static str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_operator(&mut self, _: Option<Span>, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_param(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_property(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_line(&mut self) -> io::Result<()> {
        self.w("\n");
        Ok(())
    }

    fn write_lit(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_comment(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_str_lit(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_str(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_symbol(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_punct(&mut self, _: Option<Span>, s: &'static str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        false
    }

    #[inline]
    fn add_srcmap(&mut self, _: BytePos) -> io::Result<()> {
        Ok(())
    }
}
