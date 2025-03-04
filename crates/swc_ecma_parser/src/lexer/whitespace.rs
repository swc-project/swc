/// Returns true if it's done
pub(super) type ByteHandler = Option<for<'aa> fn(&mut SkipWhitespace<'aa>) -> u32>;

/// Lookup table for whitespace
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    ___, ___, ___, ___, ___, ___, ___, ___, ___, SPC, NLN, SPC, SPC, NLN, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    SPC, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 2
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 3
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 4
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 5
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 6
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 7
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 8
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 9
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // A
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // B
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // C
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // D
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // E
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // F
];

/// Stop
const ___: ByteHandler = None;

/// Newline
const NLN: ByteHandler = Some(|skip| {
    skip.newline = true;

    1
});

/// Space
const SPC: ByteHandler = Some(|_| 1);

/// Unicode
const UNI: ByteHandler = Some(|skip| {
    // 더 효율적인 유니코드 문자 처리를 위해 바이트 패턴 직접 확인
    let bytes = skip.input.as_bytes();
    let i = skip.offset as usize;

    // 가용 바이트 수 확인
    let remaining_bytes = bytes.len() - i;
    if remaining_bytes < 1 {
        return 0;
    }

    // 처음 바이트로 UTF-8 문자 길이 예측
    let first_byte = unsafe { *bytes.get_unchecked(i) };
    let char_len = if first_byte < 128 {
        1
    } else if first_byte < 224 {
        if remaining_bytes < 2 {
            return 0;
        }
        2
    } else if first_byte < 240 {
        if remaining_bytes < 3 {
            return 0;
        }
        3
    } else {
        if remaining_bytes < 4 {
            return 0;
        }
        4
    };

    // 흔한 유니코드 공백 문자에 대한 빠른 경로
    // UTF-8 바이트 패턴으로 직접 확인
    if char_len == 3 {
        // LSEP (U+2028) - Line Separator: E2 80 A8
        if first_byte == 0xe2
            && unsafe { *bytes.get_unchecked(i + 1) } == 0x80
            && unsafe { *bytes.get_unchecked(i + 2) } == 0xa8
        {
            skip.newline = true;
            return 3;
        }

        // PSEP (U+2029) - Paragraph Separator: E2 80 A9
        if first_byte == 0xe2
            && unsafe { *bytes.get_unchecked(i + 1) } == 0x80
            && unsafe { *bytes.get_unchecked(i + 2) } == 0xa9
        {
            skip.newline = true;
            return 3;
        }
    }

    // 빠른 경로로 처리되지 않은 경우 일반적인 방법으로 처리
    let s = unsafe {
        // Safety: `skip.offset`는 항상 유효함
        skip.input.get_unchecked(skip.offset as usize..)
    };

    let c = unsafe {
        // Safety: 바이트 핸들러는 `skip.input`이 비어있지 않을 때만 호출됨
        s.chars().next().unwrap_unchecked()
    };

    match c {
        // 바이트 순서 표시 (BOM)
        '\u{feff}' => {}
        // 이미 위에서 처리된 줄바꿈 문자들
        '\u{2028}' | '\u{2029}' => {
            skip.newline = true;
        }
        // 다른 공백 문자들
        _ if c.is_whitespace() => {}
        // 공백 문자가 아님
        _ => return 0,
    }

    c.len_utf8() as u32
});

/// API is taked from oxc by Boshen (https://github.com/Boshen/oxc/pull/26)
pub(super) struct SkipWhitespace<'a> {
    pub input: &'a str,

    /// Total offset
    pub offset: u32,

    /// Found newline
    pub newline: bool,
}

impl SkipWhitespace<'_> {
    #[inline(always)]
    pub fn scan(&mut self) {
        let bytes = self.input.as_bytes();
        let len = bytes.len();
        let mut pos = self.offset as usize;

        // 최적화: 입력이 비어있는 경우 바로 반환
        if pos >= len {
            return;
        }

        loop {
            // 최적화 1: 연속된 공백 (가장 흔한 경우) 한 번에 처리
            let mut byte = unsafe { *bytes.get_unchecked(pos) };

            // 스페이스 문자 연속 처리 (매우 흔한 케이스)
            if byte == b' ' {
                pos += 1;
                // 반복적으로 스페이스 건너뛰기 (한 번에 여러 공백 처리)
                while pos < len && unsafe { *bytes.get_unchecked(pos) } == b' ' {
                    pos += 1;
                }

                // 입력 끝에 도달했는지 확인
                if pos >= len {
                    break;
                }

                // 현재 바이트 다시 가져오기
                byte = unsafe { *bytes.get_unchecked(pos) };
            }

            // 최적화 2: 다른 일반적인 공백 문자 처리
            match byte {
                b'\n' => {
                    pos += 1;
                    self.newline = true;

                    if pos >= len {
                        break;
                    }
                    continue;
                }
                b'\t' => {
                    pos += 1;

                    if pos >= len {
                        break;
                    }
                    continue;
                }
                b'\r' => {
                    pos += 1;

                    // CR+LF 시퀀스 처리 (Windows 줄바꿈)
                    if pos < len && unsafe { *bytes.get_unchecked(pos) } == b'\n' {
                        pos += 1;
                        self.newline = true;
                    } else {
                        self.newline = true; // 단독 CR도 줄바꿈으로 처리
                    }

                    if pos >= len {
                        break;
                    }
                    continue;
                }
                // 핸들러 사용이 필요한 경우
                _ => {
                    // 임시로 offset 업데이트
                    self.offset = pos as u32;

                    // 핸들러 테이블 사용
                    let handler = unsafe { BYTE_HANDLERS.get_unchecked(byte as usize) };

                    match handler {
                        Some(handler) => {
                            let delta = handler(self);
                            if delta == 0 {
                                // 공백이 아닌 문자 발견
                                // offset은 이미 업데이트됨
                                return;
                            }
                            pos = self.offset as usize + delta as usize;

                            if pos >= len {
                                break;
                            }
                        }
                        None => {
                            // 공백이 아닌 문자 발견
                            // offset은 이미 업데이트됨
                            return;
                        }
                    }
                }
            }
        }

        // 최종 위치로 offset 업데이트
        self.offset = pos as u32;
    }
}
