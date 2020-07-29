use super::*;
use either::Either;

impl<'a, I: Input> Lexer<'a, I> {
    pub(super) fn read_jsx_token(&mut self) -> LexResult<Option<Token>> {
        debug_assert!(self.syntax.jsx());

        let mut chunk_start = self.input.cur_pos();
        let mut out = String::new();

        loop {
            let cur = match self.input.cur() {
                Some(c) => c,
                None => {
                    let start = self.state.start;
                    self.error(start, SyntaxError::UnterminatedJSXContents)?
                }
            };
            let cur_pos = self.input.cur_pos();

            match cur {
                '<' | '{' => {
                    //
                    if cur_pos == self.state.start {
                        if cur == '<' && self.state.is_expr_allowed {
                            self.input.bump();
                            return Ok(Token::JSXTagStart).map(Some);
                        }
                        return self.read_token();
                    }
                    out.push_str(self.input.slice(chunk_start, cur_pos));

                    return Ok(Token::JSXText { raw: out.into() }).map(Some);
                }

                '&' => {
                    out.push_str(self.input.slice(chunk_start, cur_pos));
                    out.push(self.read_jsx_entity()?);

                    chunk_start = self.input.cur_pos();
                }

                _ => {
                    if cur.is_line_break() {
                        out.push_str(self.input.slice(chunk_start, cur_pos));
                        match self.read_jsx_new_line(true)? {
                            Either::Left(s) => out.push_str(s),
                            Either::Right(c) => out.push(c),
                        }
                        chunk_start = cur_pos;
                    } else {
                        self.input.bump()
                    }
                }
            }
        }
    }

    pub(super) fn read_jsx_entity(&mut self) -> LexResult<char> {
        debug_assert!(self.syntax.jsx());

        fn from_code(s: &str, radix: u32) -> LexResult<char> {
            // TODO(kdy1): unwrap -> Err
            let c = char::from_u32(
                u32::from_str_radix(s, radix).expect("failed to parse string as number"),
            )
            .expect("failed to parse number as char");

            Ok(c)
        }

        fn is_hex(s: &str) -> bool {
            s.chars().all(|c| c.is_digit(16))
        }

        fn is_dec(s: &str) -> bool {
            s.chars().all(|c| c.is_digit(10))
        }

        let mut s = String::new();

        let c = self.input.cur();
        debug_assert_eq!(c, Some('&'));
        self.input.bump();

        let start_pos = self.input.cur_pos();

        for _ in 0..10 {
            let c = match self.input.cur() {
                Some(c) => c,
                None => break,
            };
            self.input.bump();

            if c == ';' {
                if s.starts_with('#') {
                    if s[1..].starts_with('x') {
                        if is_hex(&s[2..]) {
                            return from_code(&s[2..], 16);
                        }
                    } else if is_dec(&s[1..]) {
                        return from_code(&s[1..], 10);
                    }
                } else if let Some(entity) = xhtml(&s) {
                    return Ok(entity);
                }
                break;
            }

            s.push(c)
        }

        self.input.reset_to(start_pos);
        Ok('&')
    }

    pub(super) fn read_jsx_new_line(
        &mut self,
        normalize_crlf: bool,
    ) -> LexResult<Either<&'static str, char>> {
        debug_assert!(self.syntax.jsx());

        let ch = self.input.cur().unwrap();
        self.input.bump();

        let out = if ch == '\r' && self.input.cur() == Some('\n') {
            self.input.bump();
            Either::Left(if normalize_crlf { "\n" } else { "\r\n" })
        } else {
            Either::Right(ch)
        };
        let cur_pos = self.input.cur_pos();
        self.state.cur_line += 1;
        self.state.line_start = cur_pos;

        Ok(out)
    }

    pub(super) fn read_jsx_str(&mut self, quote: char) -> LexResult<Token> {
        debug_assert!(self.syntax.jsx());

        self.input.bump(); // `quote`
        let mut has_escape = false;
        let mut out = String::new();
        let mut chunk_start = self.input.cur_pos();
        loop {
            let ch = match self.input.cur() {
                Some(c) => c,
                None => {
                    let start = self.state.start;
                    self.error(start, SyntaxError::UnterminatedStrLit)?
                }
            };

            let cur_pos = self.input.cur_pos();

            if ch == '\\' {
                has_escape = true;
                out.push_str(self.input.slice(chunk_start, cur_pos));
                if let Some(s) = self.read_escaped_char(&mut Raw(None))? {
                    out.extend(s);
                }
                chunk_start = self.input.cur_pos();
                continue;
            }

            if ch == quote {
                break;
            }
            if ch == '&' {
                out.push_str(self.input.slice(chunk_start, cur_pos));
                out.push(self.read_jsx_entity()?);
                chunk_start = self.input.cur_pos();
            } else if ch.is_line_break() {
                out.push_str(self.input.slice(chunk_start, cur_pos));
                match self.read_jsx_new_line(false)? {
                    Either::Left(s) => out.push_str(s),
                    Either::Right(c) => out.push(c),
                }
                chunk_start = cur_pos;
            } else {
                self.input.bump();
            }
        }
        let cur_pos = self.input.cur_pos();
        out.push_str(self.input.slice(chunk_start, cur_pos));
        self.input.bump();
        Ok(Token::Str {
            value: out.into(),
            has_escape,
        })
    }

    /// Read a JSX identifier (valid tag or attribute name).
    ///
    /// Optimized version since JSX identifiers can"t contain
    /// escape characters and so can be read as single slice.
    /// Also assumes that first character was already checked
    /// by isIdentifierStart in readToken.
    pub(super) fn read_jsx_word(&mut self) -> LexResult<Token> {
        debug_assert!(self.syntax.jsx());
        debug_assert!(self.input.cur().is_some());
        debug_assert!(self.input.cur().unwrap().is_ident_start());

        let mut first = true;
        let slice = self.input.uncons_while(|c| {
            if first {
                first = false;
                c.is_ident_start()
            } else {
                c.is_ident_part() || c == '-'
            }
        });

        Ok(Token::JSXName { name: slice.into() })
    }
}

macro_rules! xhtml {
    (
        $(
            $i:ident : $s:expr,
        )*
    ) => {
        fn xhtml(s: &str) -> Option<char> {
            match s{
                $(stringify!($i) => Some($s),)*
                _ => None,
            }
        }
    };
}

xhtml!(
    quot: '\u{0022}',
    amp: '&',
    apos: '\u{0027}',
    lt: '<',
    gt: '>',
    nbsp: '\u{00A0}',
    iexcl: '\u{00A1}',
    cent: '\u{00A2}',
    pound: '\u{00A3}',
    curren: '\u{00A4}',
    yen: '\u{00A5}',
    brvbar: '\u{00A6}',
    sect: '\u{00A7}',
    uml: '\u{00A8}',
    copy: '\u{00A9}',
    ordf: '\u{00AA}',
    laquo: '\u{00AB}',
    not: '\u{00AC}',
    shy: '\u{00AD}',
    reg: '\u{00AE}',
    macr: '\u{00AF}',
    deg: '\u{00B0}',
    plusmn: '\u{00B1}',
    sup2: '\u{00B2}',
    sup3: '\u{00B3}',
    acute: '\u{00B4}',
    micro: '\u{00B5}',
    para: '\u{00B6}',
    middot: '\u{00B7}',
    cedil: '\u{00B8}',
    sup1: '\u{00B9}',
    ordm: '\u{00BA}',
    raquo: '\u{00BB}',
    frac14: '\u{00BC}',
    frac12: '\u{00BD}',
    frac34: '\u{00BE}',
    iquest: '\u{00BF}',
    Agrave: '\u{00C0}',
    Aacute: '\u{00C1}',
    Acirc: '\u{00C2}',
    Atilde: '\u{00C3}',
    Auml: '\u{00C4}',
    Aring: '\u{00C5}',
    AElig: '\u{00C6}',
    Ccedil: '\u{00C7}',
    Egrave: '\u{00C8}',
    Eacute: '\u{00C9}',
    Ecirc: '\u{00CA}',
    Euml: '\u{00CB}',
    Igrave: '\u{00CC}',
    Iacute: '\u{00CD}',
    Icirc: '\u{00CE}',
    Iuml: '\u{00CF}',
    ETH: '\u{00D0}',
    Ntilde: '\u{00D1}',
    Ograve: '\u{00D2}',
    Oacute: '\u{00D3}',
    Ocirc: '\u{00D4}',
    Otilde: '\u{00D5}',
    Ouml: '\u{00D6}',
    times: '\u{00D7}',
    Oslash: '\u{00D8}',
    Ugrave: '\u{00D9}',
    Uacute: '\u{00DA}',
    Ucirc: '\u{00DB}',
    Uuml: '\u{00DC}',
    Yacute: '\u{00DD}',
    THORN: '\u{00DE}',
    szlig: '\u{00DF}',
    agrave: '\u{00E0}',
    aacute: '\u{00E1}',
    acirc: '\u{00E2}',
    atilde: '\u{00E3}',
    auml: '\u{00E4}',
    aring: '\u{00E5}',
    aelig: '\u{00E6}',
    ccedil: '\u{00E7}',
    egrave: '\u{00E8}',
    eacute: '\u{00E9}',
    ecirc: '\u{00EA}',
    euml: '\u{00EB}',
    igrave: '\u{00EC}',
    iacute: '\u{00ED}',
    icirc: '\u{00EE}',
    iuml: '\u{00EF}',
    eth: '\u{00F0}',
    ntilde: '\u{00F1}',
    ograve: '\u{00F2}',
    oacute: '\u{00F3}',
    ocirc: '\u{00F4}',
    otilde: '\u{00F5}',
    ouml: '\u{00F6}',
    divide: '\u{00F7}',
    oslash: '\u{00F8}',
    ugrave: '\u{00F9}',
    uacute: '\u{00FA}',
    ucirc: '\u{00FB}',
    uuml: '\u{00FC}',
    yacute: '\u{00FD}',
    thorn: '\u{00FE}',
    yuml: '\u{00FF}',
    OElig: '\u{0152}',
    oelig: '\u{0153}',
    Scaron: '\u{0160}',
    scaron: '\u{0161}',
    Yuml: '\u{0178}',
    fnof: '\u{0192}',
    circ: '\u{02C6}',
    tilde: '\u{02DC}',
    Alpha: '\u{0391}',
    Beta: '\u{0392}',
    Gamma: '\u{0393}',
    Delta: '\u{0394}',
    Epsilon: '\u{0395}',
    Zeta: '\u{0396}',
    Eta: '\u{0397}',
    Theta: '\u{0398}',
    Iota: '\u{0399}',
    Kappa: '\u{039A}',
    Lambda: '\u{039B}',
    Mu: '\u{039C}',
    Nu: '\u{039D}',
    Xi: '\u{039E}',
    Omicron: '\u{039F}',
    Pi: '\u{03A0}',
    Rho: '\u{03A1}',
    Sigma: '\u{03A3}',
    Tau: '\u{03A4}',
    Upsilon: '\u{03A5}',
    Phi: '\u{03A6}',
    Chi: '\u{03A7}',
    Psi: '\u{03A8}',
    Omega: '\u{03A9}',
    alpha: '\u{03B1}',
    beta: '\u{03B2}',
    gamma: '\u{03B3}',
    delta: '\u{03B4}',
    epsilon: '\u{03B5}',
    zeta: '\u{03B6}',
    eta: '\u{03B7}',
    theta: '\u{03B8}',
    iota: '\u{03B9}',
    kappa: '\u{03BA}',
    lambda: '\u{03BB}',
    mu: '\u{03BC}',
    nu: '\u{03BD}',
    xi: '\u{03BE}',
    omicron: '\u{03BF}',
    pi: '\u{03C0}',
    rho: '\u{03C1}',
    sigmaf: '\u{03C2}',
    sigma: '\u{03C3}',
    tau: '\u{03C4}',
    upsilon: '\u{03C5}',
    phi: '\u{03C6}',
    chi: '\u{03C7}',
    psi: '\u{03C8}',
    omega: '\u{03C9}',
    thetasym: '\u{03D1}',
    upsih: '\u{03D2}',
    piv: '\u{03D6}',
    ensp: '\u{2002}',
    emsp: '\u{2003}',
    thinsp: '\u{2009}',
    zwnj: '\u{200C}',
    zwj: '\u{200D}',
    lrm: '\u{200E}',
    rlm: '\u{200F}',
    ndash: '\u{2013}',
    mdash: '\u{2014}',
    lsquo: '\u{2018}',
    rsquo: '\u{2019}',
    sbquo: '\u{201A}',
    ldquo: '\u{201C}',
    rdquo: '\u{201D}',
    bdquo: '\u{201E}',
    dagger: '\u{2020}',
    Dagger: '\u{2021}',
    bull: '\u{2022}',
    hellip: '\u{2026}',
    permil: '\u{2030}',
    prime: '\u{2032}',
    Prime: '\u{2033}',
    lsaquo: '\u{2039}',
    rsaquo: '\u{203A}',
    oline: '\u{203E}',
    frasl: '\u{2044}',
    euro: '\u{20AC}',
    image: '\u{2111}',
    weierp: '\u{2118}',
    real: '\u{211C}',
    trade: '\u{2122}',
    alefsym: '\u{2135}',
    larr: '\u{2190}',
    uarr: '\u{2191}',
    rarr: '\u{2192}',
    darr: '\u{2193}',
    harr: '\u{2194}',
    crarr: '\u{21B5}',
    lArr: '\u{21D0}',
    uArr: '\u{21D1}',
    rArr: '\u{21D2}',
    dArr: '\u{21D3}',
    hArr: '\u{21D4}',
    forall: '\u{2200}',
    part: '\u{2202}',
    exist: '\u{2203}',
    empty: '\u{2205}',
    nabla: '\u{2207}',
    isin: '\u{2208}',
    notin: '\u{2209}',
    ni: '\u{220B}',
    prod: '\u{220F}',
    sum: '\u{2211}',
    minus: '\u{2212}',
    lowast: '\u{2217}',
    radic: '\u{221A}',
    prop: '\u{221D}',
    infin: '\u{221E}',
    ang: '\u{2220}',
    and: '\u{2227}',
    or: '\u{2228}',
    cap: '\u{2229}',
    cup: '\u{222A}',
    int: '\u{222B}',
    there4: '\u{2234}',
    sim: '\u{223C}',
    cong: '\u{2245}',
    asymp: '\u{2248}',
    ne: '\u{2260}',
    equiv: '\u{2261}',
    le: '\u{2264}',
    ge: '\u{2265}',
    sub: '\u{2282}',
    sup: '\u{2283}',
    nsub: '\u{2284}',
    sube: '\u{2286}',
    supe: '\u{2287}',
    oplus: '\u{2295}',
    otimes: '\u{2297}',
    perp: '\u{22A5}',
    sdot: '\u{22C5}',
    lceil: '\u{2308}',
    rceil: '\u{2309}',
    lfloor: '\u{230A}',
    rfloor: '\u{230B}',
    lang: '\u{2329}',
    rang: '\u{232A}',
    loz: '\u{25CA}',
    spades: '\u{2660}',
    clubs: '\u{2663}',
    hearts: '\u{2665}',
    diams: '\u{2666}',
);
