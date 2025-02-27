// fork from japaragus
// https://github.com/mozilla-spidermonkey/jsparagus/blob/master/crates/parser/src/unicode.rs

const UTF16_MAX: char = '\u{ffff}';

/// U+200C ZERO WIDTH NON-JOINER, abbreviated in the spec as <ZWNJ>.
/// Specially permitted in identifiers.
pub(super) const ZWNJ: char = '\u{200c}';

/// U+200D ZERO WIDTH JOINER, abbreviated as <ZWJ>.
/// Specially permitted in identifiers.
pub(super) const ZWJ: char = '\u{200d}';

/// U+000A LINE FEED, abbreviated in the spec as <LF>.
pub(super) const LF: char = '\u{000A}';

/// U+000D CARRIAGE RETURN, abbreviated in the spec as <CR>.
pub(super) const CR: char = '\u{000D}';

/// U+000C FORM FEED, abbreviated in the spec as <FF>.
pub(super) const FF: char = '\u{000C}';

/// U+0009 CHARACTER TABULATION, abbreviated <TAB>.
pub(super) const TAB: char = '\u{0009}';

/// U+000B VERTICAL TAB, abbreviated <VT>.
pub(super) const VT: char = '\u{000b}';

/// U+2028 LINE SEPARATOR, abbreviated <LS>.
pub(super) const LS: char = '\u{2028}';

/// U+2029 PARAGRAPH SEPARATOR, abbreviated <PS>.
pub(super) const PS: char = '\u{2029}';

pub(super) fn is_id_start(c: char) -> bool {
    if c > UTF16_MAX {
        return is_id_start_non_bmp(c);
    }
    if c < '\u{80}' {
        return is_id_start_ascii(c);
    }
    is_id_start_bmp_non_ascii(c)
}

pub(super) fn is_id_continue(c: char) -> bool {
    if c > UTF16_MAX {
        return is_id_continue_non_bmp(c);
    }
    if c < '\u{80}' {
        return is_id_continue_ascii(c);
    }
    is_id_continue_bmp_non_ascii(c)
}

fn is_id_start_ascii(c: char) -> bool {
    IS_ID_START_TABLE[c as usize]
}

fn is_id_continue_ascii(c: char) -> bool {
    IS_ID_CONTINUE_TABLE[c as usize]
}

fn is_id_start_bmp_non_ascii(c: char) -> bool {
    char_info(c).is_id_start()
}

fn is_id_continue_bmp_non_ascii(c: char) -> bool {
    char_info(c).is_id_continue()
}

/// Returns true if the character is a valid identifier start character.
/// fork from jsparagus
fn is_id_start_non_bmp(c: char) -> bool {
    if ('\u{10000}'..='\u{1000B}').contains(&c) {
        return true;
    }
    if ('\u{1000D}'..='\u{10026}').contains(&c) {
        return true;
    }
    if ('\u{10028}'..='\u{1003A}').contains(&c) {
        return true;
    }
    if ('\u{1003C}'..='\u{1003D}').contains(&c) {
        return true;
    }
    if ('\u{1003F}'..='\u{1004D}').contains(&c) {
        return true;
    }
    if ('\u{10050}'..='\u{1005D}').contains(&c) {
        return true;
    }
    if ('\u{10080}'..='\u{100FA}').contains(&c) {
        return true;
    }
    if ('\u{10140}'..='\u{10174}').contains(&c) {
        return true;
    }
    if ('\u{10280}'..='\u{1029C}').contains(&c) {
        return true;
    }
    if ('\u{102A0}'..='\u{102D0}').contains(&c) {
        return true;
    }
    if ('\u{10300}'..='\u{1031F}').contains(&c) {
        return true;
    }
    if ('\u{1032D}'..='\u{1034A}').contains(&c) {
        return true;
    }
    if ('\u{10350}'..='\u{10375}').contains(&c) {
        return true;
    }
    if ('\u{10380}'..='\u{1039D}').contains(&c) {
        return true;
    }
    if ('\u{103A0}'..='\u{103C3}').contains(&c) {
        return true;
    }
    if ('\u{103C8}'..='\u{103CF}').contains(&c) {
        return true;
    }
    if ('\u{103D1}'..='\u{103D5}').contains(&c) {
        return true;
    }
    if ('\u{10400}'..='\u{1049D}').contains(&c) {
        return true;
    }
    if ('\u{104B0}'..='\u{104D3}').contains(&c) {
        return true;
    }
    if ('\u{104D8}'..='\u{104FB}').contains(&c) {
        return true;
    }
    if ('\u{10500}'..='\u{10527}').contains(&c) {
        return true;
    }
    if ('\u{10530}'..='\u{10563}').contains(&c) {
        return true;
    }
    if ('\u{10570}'..='\u{1057A}').contains(&c) {
        return true;
    }
    if ('\u{1057C}'..='\u{1058A}').contains(&c) {
        return true;
    }
    if ('\u{1058C}'..='\u{10592}').contains(&c) {
        return true;
    }
    if ('\u{10594}'..='\u{10595}').contains(&c) {
        return true;
    }
    if ('\u{10597}'..='\u{105A1}').contains(&c) {
        return true;
    }
    if ('\u{105A3}'..='\u{105B1}').contains(&c) {
        return true;
    }
    if ('\u{105B3}'..='\u{105B9}').contains(&c) {
        return true;
    }
    if ('\u{105BB}'..='\u{105BC}').contains(&c) {
        return true;
    }
    if ('\u{10600}'..='\u{10736}').contains(&c) {
        return true;
    }
    if ('\u{10740}'..='\u{10755}').contains(&c) {
        return true;
    }
    if ('\u{10760}'..='\u{10767}').contains(&c) {
        return true;
    }
    if ('\u{10780}'..='\u{10785}').contains(&c) {
        return true;
    }
    if ('\u{10787}'..='\u{107B0}').contains(&c) {
        return true;
    }
    if ('\u{107B2}'..='\u{107BA}').contains(&c) {
        return true;
    }
    if ('\u{10800}'..='\u{10805}').contains(&c) {
        return true;
    }
    if ('\u{10808}'..='\u{10808}').contains(&c) {
        return true;
    }
    if ('\u{1080A}'..='\u{10835}').contains(&c) {
        return true;
    }
    if ('\u{10837}'..='\u{10838}').contains(&c) {
        return true;
    }
    if ('\u{1083C}'..='\u{1083C}').contains(&c) {
        return true;
    }
    if ('\u{1083F}'..='\u{10855}').contains(&c) {
        return true;
    }
    if ('\u{10860}'..='\u{10876}').contains(&c) {
        return true;
    }
    if ('\u{10880}'..='\u{1089E}').contains(&c) {
        return true;
    }
    if ('\u{108E0}'..='\u{108F2}').contains(&c) {
        return true;
    }
    if ('\u{108F4}'..='\u{108F5}').contains(&c) {
        return true;
    }
    if ('\u{10900}'..='\u{10915}').contains(&c) {
        return true;
    }
    if ('\u{10920}'..='\u{10939}').contains(&c) {
        return true;
    }
    if ('\u{10980}'..='\u{109B7}').contains(&c) {
        return true;
    }
    if ('\u{109BE}'..='\u{109BF}').contains(&c) {
        return true;
    }
    if ('\u{10A00}'..='\u{10A00}').contains(&c) {
        return true;
    }
    if ('\u{10A10}'..='\u{10A13}').contains(&c) {
        return true;
    }
    if ('\u{10A15}'..='\u{10A17}').contains(&c) {
        return true;
    }
    if ('\u{10A19}'..='\u{10A35}').contains(&c) {
        return true;
    }
    if ('\u{10A60}'..='\u{10A7C}').contains(&c) {
        return true;
    }
    if ('\u{10A80}'..='\u{10A9C}').contains(&c) {
        return true;
    }
    if ('\u{10AC0}'..='\u{10AC7}').contains(&c) {
        return true;
    }
    if ('\u{10AC9}'..='\u{10AE4}').contains(&c) {
        return true;
    }
    if ('\u{10B00}'..='\u{10B35}').contains(&c) {
        return true;
    }
    if ('\u{10B40}'..='\u{10B55}').contains(&c) {
        return true;
    }
    if ('\u{10B60}'..='\u{10B72}').contains(&c) {
        return true;
    }
    if ('\u{10B80}'..='\u{10B91}').contains(&c) {
        return true;
    }
    if ('\u{10C00}'..='\u{10C48}').contains(&c) {
        return true;
    }
    if ('\u{10C80}'..='\u{10CB2}').contains(&c) {
        return true;
    }
    if ('\u{10CC0}'..='\u{10CF2}').contains(&c) {
        return true;
    }
    if ('\u{10D00}'..='\u{10D23}').contains(&c) {
        return true;
    }
    if ('\u{10E80}'..='\u{10EA9}').contains(&c) {
        return true;
    }
    if ('\u{10EB0}'..='\u{10EB1}').contains(&c) {
        return true;
    }
    if ('\u{10F00}'..='\u{10F1C}').contains(&c) {
        return true;
    }
    if ('\u{10F27}'..='\u{10F27}').contains(&c) {
        return true;
    }
    if ('\u{10F30}'..='\u{10F45}').contains(&c) {
        return true;
    }
    if ('\u{10F70}'..='\u{10F81}').contains(&c) {
        return true;
    }
    if ('\u{10FB0}'..='\u{10FC4}').contains(&c) {
        return true;
    }
    if ('\u{10FE0}'..='\u{10FF6}').contains(&c) {
        return true;
    }
    if ('\u{11003}'..='\u{11037}').contains(&c) {
        return true;
    }
    if ('\u{11071}'..='\u{11072}').contains(&c) {
        return true;
    }
    if ('\u{11075}'..='\u{11075}').contains(&c) {
        return true;
    }
    if ('\u{11083}'..='\u{110AF}').contains(&c) {
        return true;
    }
    if ('\u{110D0}'..='\u{110E8}').contains(&c) {
        return true;
    }
    if ('\u{11103}'..='\u{11126}').contains(&c) {
        return true;
    }
    if ('\u{11144}'..='\u{11144}').contains(&c) {
        return true;
    }
    if ('\u{11147}'..='\u{11147}').contains(&c) {
        return true;
    }
    if ('\u{11150}'..='\u{11172}').contains(&c) {
        return true;
    }
    if ('\u{11176}'..='\u{11176}').contains(&c) {
        return true;
    }
    if ('\u{11183}'..='\u{111B2}').contains(&c) {
        return true;
    }
    if ('\u{111C1}'..='\u{111C4}').contains(&c) {
        return true;
    }
    if ('\u{111DA}'..='\u{111DA}').contains(&c) {
        return true;
    }
    if ('\u{111DC}'..='\u{111DC}').contains(&c) {
        return true;
    }
    if ('\u{11200}'..='\u{11211}').contains(&c) {
        return true;
    }
    if ('\u{11213}'..='\u{1122B}').contains(&c) {
        return true;
    }
    if ('\u{11280}'..='\u{11286}').contains(&c) {
        return true;
    }
    if ('\u{11288}'..='\u{11288}').contains(&c) {
        return true;
    }
    if ('\u{1128A}'..='\u{1128D}').contains(&c) {
        return true;
    }
    if ('\u{1128F}'..='\u{1129D}').contains(&c) {
        return true;
    }
    if ('\u{1129F}'..='\u{112A8}').contains(&c) {
        return true;
    }
    if ('\u{112B0}'..='\u{112DE}').contains(&c) {
        return true;
    }
    if ('\u{11305}'..='\u{1130C}').contains(&c) {
        return true;
    }
    if ('\u{1130F}'..='\u{11310}').contains(&c) {
        return true;
    }
    if ('\u{11313}'..='\u{11328}').contains(&c) {
        return true;
    }
    if ('\u{1132A}'..='\u{11330}').contains(&c) {
        return true;
    }
    if ('\u{11332}'..='\u{11333}').contains(&c) {
        return true;
    }
    if ('\u{11335}'..='\u{11339}').contains(&c) {
        return true;
    }
    if ('\u{1133D}'..='\u{1133D}').contains(&c) {
        return true;
    }
    if ('\u{11350}'..='\u{11350}').contains(&c) {
        return true;
    }
    if ('\u{1135D}'..='\u{11361}').contains(&c) {
        return true;
    }
    if ('\u{11400}'..='\u{11434}').contains(&c) {
        return true;
    }
    if ('\u{11447}'..='\u{1144A}').contains(&c) {
        return true;
    }
    if ('\u{1145F}'..='\u{11461}').contains(&c) {
        return true;
    }
    if ('\u{11480}'..='\u{114AF}').contains(&c) {
        return true;
    }
    if ('\u{114C4}'..='\u{114C5}').contains(&c) {
        return true;
    }
    if ('\u{114C7}'..='\u{114C7}').contains(&c) {
        return true;
    }
    if ('\u{11580}'..='\u{115AE}').contains(&c) {
        return true;
    }
    if ('\u{115D8}'..='\u{115DB}').contains(&c) {
        return true;
    }
    if ('\u{11600}'..='\u{1162F}').contains(&c) {
        return true;
    }
    if ('\u{11644}'..='\u{11644}').contains(&c) {
        return true;
    }
    if ('\u{11680}'..='\u{116AA}').contains(&c) {
        return true;
    }
    if ('\u{116B8}'..='\u{116B8}').contains(&c) {
        return true;
    }
    if ('\u{11700}'..='\u{1171A}').contains(&c) {
        return true;
    }
    if ('\u{11740}'..='\u{11746}').contains(&c) {
        return true;
    }
    if ('\u{11800}'..='\u{1182B}').contains(&c) {
        return true;
    }
    if ('\u{118A0}'..='\u{118DF}').contains(&c) {
        return true;
    }
    if ('\u{118FF}'..='\u{11906}').contains(&c) {
        return true;
    }
    if ('\u{11909}'..='\u{11909}').contains(&c) {
        return true;
    }
    if ('\u{1190C}'..='\u{11913}').contains(&c) {
        return true;
    }
    if ('\u{11915}'..='\u{11916}').contains(&c) {
        return true;
    }
    if ('\u{11918}'..='\u{1192F}').contains(&c) {
        return true;
    }
    if ('\u{1193F}'..='\u{1193F}').contains(&c) {
        return true;
    }
    if ('\u{11941}'..='\u{11941}').contains(&c) {
        return true;
    }
    if ('\u{119A0}'..='\u{119A7}').contains(&c) {
        return true;
    }
    if ('\u{119AA}'..='\u{119D0}').contains(&c) {
        return true;
    }
    if ('\u{119E1}'..='\u{119E1}').contains(&c) {
        return true;
    }
    if ('\u{119E3}'..='\u{119E3}').contains(&c) {
        return true;
    }
    if ('\u{11A00}'..='\u{11A00}').contains(&c) {
        return true;
    }
    if ('\u{11A0B}'..='\u{11A32}').contains(&c) {
        return true;
    }
    if ('\u{11A3A}'..='\u{11A3A}').contains(&c) {
        return true;
    }
    if ('\u{11A50}'..='\u{11A50}').contains(&c) {
        return true;
    }
    if ('\u{11A5C}'..='\u{11A89}').contains(&c) {
        return true;
    }
    if ('\u{11A9D}'..='\u{11A9D}').contains(&c) {
        return true;
    }
    if ('\u{11AB0}'..='\u{11AF8}').contains(&c) {
        return true;
    }
    if ('\u{11C00}'..='\u{11C08}').contains(&c) {
        return true;
    }
    if ('\u{11C0A}'..='\u{11C2E}').contains(&c) {
        return true;
    }
    if ('\u{11C40}'..='\u{11C40}').contains(&c) {
        return true;
    }
    if ('\u{11C72}'..='\u{11C8F}').contains(&c) {
        return true;
    }
    if ('\u{11D00}'..='\u{11D06}').contains(&c) {
        return true;
    }
    if ('\u{11D08}'..='\u{11D09}').contains(&c) {
        return true;
    }
    if ('\u{11D0B}'..='\u{11D30}').contains(&c) {
        return true;
    }
    if ('\u{11D46}'..='\u{11D46}').contains(&c) {
        return true;
    }
    if ('\u{11D60}'..='\u{11D65}').contains(&c) {
        return true;
    }
    if ('\u{11D67}'..='\u{11D68}').contains(&c) {
        return true;
    }
    if ('\u{11D6A}'..='\u{11D89}').contains(&c) {
        return true;
    }
    if ('\u{11D98}'..='\u{11D98}').contains(&c) {
        return true;
    }
    if ('\u{11EE0}'..='\u{11EF2}').contains(&c) {
        return true;
    }
    if ('\u{11FB0}'..='\u{11FB0}').contains(&c) {
        return true;
    }
    if ('\u{12000}'..='\u{12399}').contains(&c) {
        return true;
    }
    if ('\u{12400}'..='\u{1246E}').contains(&c) {
        return true;
    }
    if ('\u{12480}'..='\u{12543}').contains(&c) {
        return true;
    }
    if ('\u{12F90}'..='\u{12FF0}').contains(&c) {
        return true;
    }
    if ('\u{13000}'..='\u{1342E}').contains(&c) {
        return true;
    }
    if ('\u{14400}'..='\u{14646}').contains(&c) {
        return true;
    }
    if ('\u{16800}'..='\u{16A38}').contains(&c) {
        return true;
    }
    if ('\u{16A40}'..='\u{16A5E}').contains(&c) {
        return true;
    }
    if ('\u{16A60}'..='\u{16A69}').contains(&c) {
        return true;
    }
    if ('\u{16A70}'..='\u{16ABE}').contains(&c) {
        return true;
    }
    if ('\u{16AC0}'..='\u{16AC9}').contains(&c) {
        return true;
    }
    if ('\u{16AD0}'..='\u{16AED}').contains(&c) {
        return true;
    }
    if ('\u{16AF0}'..='\u{16AF4}').contains(&c) {
        return true;
    }
    if ('\u{16B00}'..='\u{16B36}').contains(&c) {
        return true;
    }
    if ('\u{16B40}'..='\u{16B43}').contains(&c) {
        return true;
    }
    if ('\u{16B50}'..='\u{16B59}').contains(&c) {
        return true;
    }
    if ('\u{16B63}'..='\u{16B77}').contains(&c) {
        return true;
    }
    if ('\u{16B7D}'..='\u{16B8F}').contains(&c) {
        return true;
    }
    if ('\u{16E40}'..='\u{16E7F}').contains(&c) {
        return true;
    }
    if ('\u{16F00}'..='\u{16F4A}').contains(&c) {
        return true;
    }
    if ('\u{16F50}'..='\u{16F50}').contains(&c) {
        return true;
    }
    if ('\u{16F93}'..='\u{16F9F}').contains(&c) {
        return true;
    }
    if ('\u{16FE0}'..='\u{16FE1}').contains(&c) {
        return true;
    }
    if ('\u{16FE3}'..='\u{16FE3}').contains(&c) {
        return true;
    }
    if ('\u{17000}'..='\u{187F7}').contains(&c) {
        return true;
    }
    if ('\u{18800}'..='\u{18CD5}').contains(&c) {
        return true;
    }
    if ('\u{18D00}'..='\u{18D08}').contains(&c) {
        return true;
    }
    if ('\u{1AFF0}'..='\u{1AFF3}').contains(&c) {
        return true;
    }
    if ('\u{1AFF5}'..='\u{1AFFB}').contains(&c) {
        return true;
    }
    if ('\u{1AFFD}'..='\u{1AFFE}').contains(&c) {
        return true;
    }
    if ('\u{1B000}'..='\u{1B122}').contains(&c) {
        return true;
    }
    if ('\u{1B150}'..='\u{1B152}').contains(&c) {
        return true;
    }
    if ('\u{1B164}'..='\u{1B167}').contains(&c) {
        return true;
    }
    if ('\u{1B170}'..='\u{1B2FB}').contains(&c) {
        return true;
    }
    if ('\u{1BC00}'..='\u{1BC6A}').contains(&c) {
        return true;
    }
    if ('\u{1BC70}'..='\u{1BC7C}').contains(&c) {
        return true;
    }
    if ('\u{1BC80}'..='\u{1BC88}').contains(&c) {
        return true;
    }
    if ('\u{1BC90}'..='\u{1BC99}').contains(&c) {
        return true;
    }
    if ('\u{1D400}'..='\u{1D454}').contains(&c) {
        return true;
    }
    if ('\u{1D456}'..='\u{1D49C}').contains(&c) {
        return true;
    }
    if ('\u{1D49E}'..='\u{1D49F}').contains(&c) {
        return true;
    }
    if ('\u{1D4A2}'..='\u{1D4A2}').contains(&c) {
        return true;
    }
    if ('\u{1D4A5}'..='\u{1D4A6}').contains(&c) {
        return true;
    }
    if ('\u{1D4A9}'..='\u{1D4AC}').contains(&c) {
        return true;
    }
    if ('\u{1D4AE}'..='\u{1D4B9}').contains(&c) {
        return true;
    }
    if ('\u{1D4BB}'..='\u{1D4BB}').contains(&c) {
        return true;
    }
    if ('\u{1D4BD}'..='\u{1D4C3}').contains(&c) {
        return true;
    }
    if ('\u{1D4C5}'..='\u{1D505}').contains(&c) {
        return true;
    }
    if ('\u{1D507}'..='\u{1D50A}').contains(&c) {
        return true;
    }
    if ('\u{1D50D}'..='\u{1D514}').contains(&c) {
        return true;
    }
    if ('\u{1D516}'..='\u{1D51C}').contains(&c) {
        return true;
    }
    if ('\u{1D51E}'..='\u{1D539}').contains(&c) {
        return true;
    }
    if ('\u{1D53B}'..='\u{1D53E}').contains(&c) {
        return true;
    }
    if ('\u{1D540}'..='\u{1D544}').contains(&c) {
        return true;
    }
    if ('\u{1D546}'..='\u{1D546}').contains(&c) {
        return true;
    }
    if ('\u{1D54A}'..='\u{1D550}').contains(&c) {
        return true;
    }
    if ('\u{1D552}'..='\u{1D6A5}').contains(&c) {
        return true;
    }
    if ('\u{1D6A8}'..='\u{1D6C0}').contains(&c) {
        return true;
    }
    if ('\u{1D6C2}'..='\u{1D6DA}').contains(&c) {
        return true;
    }
    if ('\u{1D6DC}'..='\u{1D6FA}').contains(&c) {
        return true;
    }
    if ('\u{1D6FC}'..='\u{1D714}').contains(&c) {
        return true;
    }
    if ('\u{1D716}'..='\u{1D734}').contains(&c) {
        return true;
    }
    if ('\u{1D736}'..='\u{1D74E}').contains(&c) {
        return true;
    }
    if ('\u{1D750}'..='\u{1D76E}').contains(&c) {
        return true;
    }
    if ('\u{1D770}'..='\u{1D788}').contains(&c) {
        return true;
    }
    if ('\u{1D78A}'..='\u{1D7A8}').contains(&c) {
        return true;
    }
    if ('\u{1D7AA}'..='\u{1D7C2}').contains(&c) {
        return true;
    }
    if ('\u{1D7C4}'..='\u{1D7CB}').contains(&c) {
        return true;
    }
    if ('\u{1DF00}'..='\u{1DF1E}').contains(&c) {
        return true;
    }
    if ('\u{1E100}'..='\u{1E12C}').contains(&c) {
        return true;
    }
    if ('\u{1E137}'..='\u{1E13D}').contains(&c) {
        return true;
    }
    if ('\u{1E14E}'..='\u{1E14E}').contains(&c) {
        return true;
    }
    if ('\u{1E290}'..='\u{1E2AD}').contains(&c) {
        return true;
    }
    if ('\u{1E2C0}'..='\u{1E2EB}').contains(&c) {
        return true;
    }
    if ('\u{1E7E0}'..='\u{1E7E6}').contains(&c) {
        return true;
    }
    if ('\u{1E7E8}'..='\u{1E7EB}').contains(&c) {
        return true;
    }
    if ('\u{1E7ED}'..='\u{1E7EE}').contains(&c) {
        return true;
    }
    if ('\u{1E7F0}'..='\u{1E7FE}').contains(&c) {
        return true;
    }
    if ('\u{1E800}'..='\u{1E8C4}').contains(&c) {
        return true;
    }
    if ('\u{1E900}'..='\u{1E943}').contains(&c) {
        return true;
    }
    if ('\u{1E94B}'..='\u{1E94B}').contains(&c) {
        return true;
    }
    if ('\u{1EE00}'..='\u{1EE03}').contains(&c) {
        return true;
    }
    if ('\u{1EE05}'..='\u{1EE1F}').contains(&c) {
        return true;
    }
    if ('\u{1EE21}'..='\u{1EE22}').contains(&c) {
        return true;
    }
    if ('\u{1EE24}'..='\u{1EE24}').contains(&c) {
        return true;
    }
    if ('\u{1EE27}'..='\u{1EE27}').contains(&c) {
        return true;
    }
    if ('\u{1EE29}'..='\u{1EE32}').contains(&c) {
        return true;
    }
    if ('\u{1EE34}'..='\u{1EE37}').contains(&c) {
        return true;
    }
    if ('\u{1EE39}'..='\u{1EE39}').contains(&c) {
        return true;
    }
    if ('\u{1EE3B}'..='\u{1EE3B}').contains(&c) {
        return true;
    }
    if ('\u{1EE42}'..='\u{1EE42}').contains(&c) {
        return true;
    }
    if ('\u{1EE47}'..='\u{1EE47}').contains(&c) {
        return true;
    }
    if ('\u{1EE49}'..='\u{1EE49}').contains(&c) {
        return true;
    }
    if ('\u{1EE4B}'..='\u{1EE4B}').contains(&c) {
        return true;
    }
    if ('\u{1EE4D}'..='\u{1EE4F}').contains(&c) {
        return true;
    }
    if ('\u{1EE51}'..='\u{1EE52}').contains(&c) {
        return true;
    }
    if ('\u{1EE54}'..='\u{1EE54}').contains(&c) {
        return true;
    }
    if ('\u{1EE57}'..='\u{1EE57}').contains(&c) {
        return true;
    }
    if ('\u{1EE59}'..='\u{1EE59}').contains(&c) {
        return true;
    }
    if ('\u{1EE5B}'..='\u{1EE5B}').contains(&c) {
        return true;
    }
    if ('\u{1EE5D}'..='\u{1EE5D}').contains(&c) {
        return true;
    }
    if ('\u{1EE5F}'..='\u{1EE5F}').contains(&c) {
        return true;
    }
    if ('\u{1EE61}'..='\u{1EE62}').contains(&c) {
        return true;
    }
    if ('\u{1EE64}'..='\u{1EE64}').contains(&c) {
        return true;
    }
    if ('\u{1EE67}'..='\u{1EE6A}').contains(&c) {
        return true;
    }
    if ('\u{1EE6C}'..='\u{1EE72}').contains(&c) {
        return true;
    }
    if ('\u{1EE74}'..='\u{1EE77}').contains(&c) {
        return true;
    }
    if ('\u{1EE79}'..='\u{1EE7C}').contains(&c) {
        return true;
    }
    if ('\u{1EE7E}'..='\u{1EE7E}').contains(&c) {
        return true;
    }
    if ('\u{1EE80}'..='\u{1EE89}').contains(&c) {
        return true;
    }
    if ('\u{1EE8B}'..='\u{1EE9B}').contains(&c) {
        return true;
    }
    if ('\u{1EEA1}'..='\u{1EEA3}').contains(&c) {
        return true;
    }
    if ('\u{1EEA5}'..='\u{1EEA9}').contains(&c) {
        return true;
    }
    if ('\u{1EEAB}'..='\u{1EEBB}').contains(&c) {
        return true;
    }
    if ('\u{20000}'..='\u{2A6DF}').contains(&c) {
        return true;
    }
    if ('\u{2A700}'..='\u{2B738}').contains(&c) {
        return true;
    }
    if ('\u{2B740}'..='\u{2B81D}').contains(&c) {
        return true;
    }
    if ('\u{2B820}'..='\u{2CEA1}').contains(&c) {
        return true;
    }
    if ('\u{2CEB0}'..='\u{2EBE0}').contains(&c) {
        return true;
    }
    if ('\u{2F800}'..='\u{2FA1D}').contains(&c) {
        return true;
    }
    if ('\u{30000}'..='\u{3134A}').contains(&c) {
        return true;
    }
    if ('\u{E0100}'..='\u{E01EF}').contains(&c) {
        return true;
    }
    false
}

/// Returns true if the character is a valid identifier part character.
/// fork from jsparagus
fn is_id_continue_non_bmp(c: char) -> bool {
    if ('\u{10000}'..='\u{1000B}').contains(&c) {
        return true;
    }
    if ('\u{1000D}'..='\u{10026}').contains(&c) {
        return true;
    }
    if ('\u{10028}'..='\u{1003A}').contains(&c) {
        return true;
    }
    if ('\u{1003C}'..='\u{1003D}').contains(&c) {
        return true;
    }
    if ('\u{1003F}'..='\u{1004D}').contains(&c) {
        return true;
    }
    if ('\u{10050}'..='\u{1005D}').contains(&c) {
        return true;
    }
    if ('\u{10080}'..='\u{100FA}').contains(&c) {
        return true;
    }
    if ('\u{10140}'..='\u{10174}').contains(&c) {
        return true;
    }
    if ('\u{101FD}'..='\u{101FD}').contains(&c) {
        return true;
    }
    if ('\u{10280}'..='\u{1029C}').contains(&c) {
        return true;
    }
    if ('\u{102A0}'..='\u{102D0}').contains(&c) {
        return true;
    }
    if ('\u{102E0}'..='\u{102E0}').contains(&c) {
        return true;
    }
    if ('\u{10300}'..='\u{1031F}').contains(&c) {
        return true;
    }
    if ('\u{1032D}'..='\u{1034A}').contains(&c) {
        return true;
    }
    if ('\u{10350}'..='\u{1037A}').contains(&c) {
        return true;
    }
    if ('\u{10380}'..='\u{1039D}').contains(&c) {
        return true;
    }
    if ('\u{103A0}'..='\u{103C3}').contains(&c) {
        return true;
    }
    if ('\u{103C8}'..='\u{103CF}').contains(&c) {
        return true;
    }
    if ('\u{103D1}'..='\u{103D5}').contains(&c) {
        return true;
    }
    if ('\u{10400}'..='\u{1049D}').contains(&c) {
        return true;
    }
    if ('\u{104A0}'..='\u{104A9}').contains(&c) {
        return true;
    }
    if ('\u{104B0}'..='\u{104D3}').contains(&c) {
        return true;
    }
    if ('\u{104D8}'..='\u{104FB}').contains(&c) {
        return true;
    }
    if ('\u{10500}'..='\u{10527}').contains(&c) {
        return true;
    }
    if ('\u{10530}'..='\u{10563}').contains(&c) {
        return true;
    }
    if ('\u{10570}'..='\u{1057A}').contains(&c) {
        return true;
    }
    if ('\u{1057C}'..='\u{1058A}').contains(&c) {
        return true;
    }
    if ('\u{1058C}'..='\u{10592}').contains(&c) {
        return true;
    }
    if ('\u{10594}'..='\u{10595}').contains(&c) {
        return true;
    }
    if ('\u{10597}'..='\u{105A1}').contains(&c) {
        return true;
    }
    if ('\u{105A3}'..='\u{105B1}').contains(&c) {
        return true;
    }
    if ('\u{105B3}'..='\u{105B9}').contains(&c) {
        return true;
    }
    if ('\u{105BB}'..='\u{105BC}').contains(&c) {
        return true;
    }
    if ('\u{10600}'..='\u{10736}').contains(&c) {
        return true;
    }
    if ('\u{10740}'..='\u{10755}').contains(&c) {
        return true;
    }
    if ('\u{10760}'..='\u{10767}').contains(&c) {
        return true;
    }
    if ('\u{10780}'..='\u{10785}').contains(&c) {
        return true;
    }
    if ('\u{10787}'..='\u{107B0}').contains(&c) {
        return true;
    }
    if ('\u{107B2}'..='\u{107BA}').contains(&c) {
        return true;
    }
    if ('\u{10800}'..='\u{10805}').contains(&c) {
        return true;
    }
    if ('\u{10808}'..='\u{10808}').contains(&c) {
        return true;
    }
    if ('\u{1080A}'..='\u{10835}').contains(&c) {
        return true;
    }
    if ('\u{10837}'..='\u{10838}').contains(&c) {
        return true;
    }
    if ('\u{1083C}'..='\u{1083C}').contains(&c) {
        return true;
    }
    if ('\u{1083F}'..='\u{10855}').contains(&c) {
        return true;
    }
    if ('\u{10860}'..='\u{10876}').contains(&c) {
        return true;
    }
    if ('\u{10880}'..='\u{1089E}').contains(&c) {
        return true;
    }
    if ('\u{108E0}'..='\u{108F2}').contains(&c) {
        return true;
    }
    if ('\u{108F4}'..='\u{108F5}').contains(&c) {
        return true;
    }
    if ('\u{10900}'..='\u{10915}').contains(&c) {
        return true;
    }
    if ('\u{10920}'..='\u{10939}').contains(&c) {
        return true;
    }
    if ('\u{10980}'..='\u{109B7}').contains(&c) {
        return true;
    }
    if ('\u{109BE}'..='\u{109BF}').contains(&c) {
        return true;
    }
    if ('\u{10A00}'..='\u{10A03}').contains(&c) {
        return true;
    }
    if ('\u{10A05}'..='\u{10A06}').contains(&c) {
        return true;
    }
    if ('\u{10A0C}'..='\u{10A13}').contains(&c) {
        return true;
    }
    if ('\u{10A15}'..='\u{10A17}').contains(&c) {
        return true;
    }
    if ('\u{10A19}'..='\u{10A35}').contains(&c) {
        return true;
    }
    if ('\u{10A38}'..='\u{10A3A}').contains(&c) {
        return true;
    }
    if ('\u{10A3F}'..='\u{10A3F}').contains(&c) {
        return true;
    }
    if ('\u{10A60}'..='\u{10A7C}').contains(&c) {
        return true;
    }
    if ('\u{10A80}'..='\u{10A9C}').contains(&c) {
        return true;
    }
    if ('\u{10AC0}'..='\u{10AC7}').contains(&c) {
        return true;
    }
    if ('\u{10AC9}'..='\u{10AE6}').contains(&c) {
        return true;
    }
    if ('\u{10B00}'..='\u{10B35}').contains(&c) {
        return true;
    }
    if ('\u{10B40}'..='\u{10B55}').contains(&c) {
        return true;
    }
    if ('\u{10B60}'..='\u{10B72}').contains(&c) {
        return true;
    }
    if ('\u{10B80}'..='\u{10B91}').contains(&c) {
        return true;
    }
    if ('\u{10C00}'..='\u{10C48}').contains(&c) {
        return true;
    }
    if ('\u{10C80}'..='\u{10CB2}').contains(&c) {
        return true;
    }
    if ('\u{10CC0}'..='\u{10CF2}').contains(&c) {
        return true;
    }
    if ('\u{10D00}'..='\u{10D27}').contains(&c) {
        return true;
    }
    if ('\u{10D30}'..='\u{10D39}').contains(&c) {
        return true;
    }
    if ('\u{10E80}'..='\u{10EA9}').contains(&c) {
        return true;
    }
    if ('\u{10EAB}'..='\u{10EAC}').contains(&c) {
        return true;
    }
    if ('\u{10EB0}'..='\u{10EB1}').contains(&c) {
        return true;
    }
    if ('\u{10F00}'..='\u{10F1C}').contains(&c) {
        return true;
    }
    if ('\u{10F27}'..='\u{10F27}').contains(&c) {
        return true;
    }
    if ('\u{10F30}'..='\u{10F50}').contains(&c) {
        return true;
    }
    if ('\u{10F70}'..='\u{10F85}').contains(&c) {
        return true;
    }
    if ('\u{10FB0}'..='\u{10FC4}').contains(&c) {
        return true;
    }
    if ('\u{10FE0}'..='\u{10FF6}').contains(&c) {
        return true;
    }
    if ('\u{11000}'..='\u{11046}').contains(&c) {
        return true;
    }
    if ('\u{11066}'..='\u{11075}').contains(&c) {
        return true;
    }
    if ('\u{1107F}'..='\u{110BA}').contains(&c) {
        return true;
    }
    if ('\u{110C2}'..='\u{110C2}').contains(&c) {
        return true;
    }
    if ('\u{110D0}'..='\u{110E8}').contains(&c) {
        return true;
    }
    if ('\u{110F0}'..='\u{110F9}').contains(&c) {
        return true;
    }
    if ('\u{11100}'..='\u{11134}').contains(&c) {
        return true;
    }
    if ('\u{11136}'..='\u{1113F}').contains(&c) {
        return true;
    }
    if ('\u{11144}'..='\u{11147}').contains(&c) {
        return true;
    }
    if ('\u{11150}'..='\u{11173}').contains(&c) {
        return true;
    }
    if ('\u{11176}'..='\u{11176}').contains(&c) {
        return true;
    }
    if ('\u{11180}'..='\u{111C4}').contains(&c) {
        return true;
    }
    if ('\u{111C9}'..='\u{111CC}').contains(&c) {
        return true;
    }
    if ('\u{111CE}'..='\u{111DA}').contains(&c) {
        return true;
    }
    if ('\u{111DC}'..='\u{111DC}').contains(&c) {
        return true;
    }
    if ('\u{11200}'..='\u{11211}').contains(&c) {
        return true;
    }
    if ('\u{11213}'..='\u{11237}').contains(&c) {
        return true;
    }
    if ('\u{1123E}'..='\u{1123E}').contains(&c) {
        return true;
    }
    if ('\u{11280}'..='\u{11286}').contains(&c) {
        return true;
    }
    if ('\u{11288}'..='\u{11288}').contains(&c) {
        return true;
    }
    if ('\u{1128A}'..='\u{1128D}').contains(&c) {
        return true;
    }
    if ('\u{1128F}'..='\u{1129D}').contains(&c) {
        return true;
    }
    if ('\u{1129F}'..='\u{112A8}').contains(&c) {
        return true;
    }
    if ('\u{112B0}'..='\u{112EA}').contains(&c) {
        return true;
    }
    if ('\u{112F0}'..='\u{112F9}').contains(&c) {
        return true;
    }
    if ('\u{11300}'..='\u{11303}').contains(&c) {
        return true;
    }
    if ('\u{11305}'..='\u{1130C}').contains(&c) {
        return true;
    }
    if ('\u{1130F}'..='\u{11310}').contains(&c) {
        return true;
    }
    if ('\u{11313}'..='\u{11328}').contains(&c) {
        return true;
    }
    if ('\u{1132A}'..='\u{11330}').contains(&c) {
        return true;
    }
    if ('\u{11332}'..='\u{11333}').contains(&c) {
        return true;
    }
    if ('\u{11335}'..='\u{11339}').contains(&c) {
        return true;
    }
    if ('\u{1133B}'..='\u{11344}').contains(&c) {
        return true;
    }
    if ('\u{11347}'..='\u{11348}').contains(&c) {
        return true;
    }
    if ('\u{1134B}'..='\u{1134D}').contains(&c) {
        return true;
    }
    if ('\u{11350}'..='\u{11350}').contains(&c) {
        return true;
    }
    if ('\u{11357}'..='\u{11357}').contains(&c) {
        return true;
    }
    if ('\u{1135D}'..='\u{11363}').contains(&c) {
        return true;
    }
    if ('\u{11366}'..='\u{1136C}').contains(&c) {
        return true;
    }
    if ('\u{11370}'..='\u{11374}').contains(&c) {
        return true;
    }
    if ('\u{11400}'..='\u{1144A}').contains(&c) {
        return true;
    }
    if ('\u{11450}'..='\u{11459}').contains(&c) {
        return true;
    }
    if ('\u{1145E}'..='\u{11461}').contains(&c) {
        return true;
    }
    if ('\u{11480}'..='\u{114C5}').contains(&c) {
        return true;
    }
    if ('\u{114C7}'..='\u{114C7}').contains(&c) {
        return true;
    }
    if ('\u{114D0}'..='\u{114D9}').contains(&c) {
        return true;
    }
    if ('\u{11580}'..='\u{115B5}').contains(&c) {
        return true;
    }
    if ('\u{115B8}'..='\u{115C0}').contains(&c) {
        return true;
    }
    if ('\u{115D8}'..='\u{115DD}').contains(&c) {
        return true;
    }
    if ('\u{11600}'..='\u{11640}').contains(&c) {
        return true;
    }
    if ('\u{11644}'..='\u{11644}').contains(&c) {
        return true;
    }
    if ('\u{11650}'..='\u{11659}').contains(&c) {
        return true;
    }
    if ('\u{11680}'..='\u{116B8}').contains(&c) {
        return true;
    }
    if ('\u{116C0}'..='\u{116C9}').contains(&c) {
        return true;
    }
    if ('\u{11700}'..='\u{1171A}').contains(&c) {
        return true;
    }
    if ('\u{1171D}'..='\u{1172B}').contains(&c) {
        return true;
    }
    if ('\u{11730}'..='\u{11739}').contains(&c) {
        return true;
    }
    if ('\u{11740}'..='\u{11746}').contains(&c) {
        return true;
    }
    if ('\u{11800}'..='\u{1183A}').contains(&c) {
        return true;
    }
    if ('\u{118A0}'..='\u{118E9}').contains(&c) {
        return true;
    }
    if ('\u{118FF}'..='\u{11906}').contains(&c) {
        return true;
    }
    if ('\u{11909}'..='\u{11909}').contains(&c) {
        return true;
    }
    if ('\u{1190C}'..='\u{11913}').contains(&c) {
        return true;
    }
    if ('\u{11915}'..='\u{11916}').contains(&c) {
        return true;
    }
    if ('\u{11918}'..='\u{11935}').contains(&c) {
        return true;
    }
    if ('\u{11937}'..='\u{11938}').contains(&c) {
        return true;
    }
    if ('\u{1193B}'..='\u{11943}').contains(&c) {
        return true;
    }
    if ('\u{11950}'..='\u{11959}').contains(&c) {
        return true;
    }
    if ('\u{119A0}'..='\u{119A7}').contains(&c) {
        return true;
    }
    if ('\u{119AA}'..='\u{119D7}').contains(&c) {
        return true;
    }
    if ('\u{119DA}'..='\u{119E1}').contains(&c) {
        return true;
    }
    if ('\u{119E3}'..='\u{119E4}').contains(&c) {
        return true;
    }
    if ('\u{11A00}'..='\u{11A3E}').contains(&c) {
        return true;
    }
    if ('\u{11A47}'..='\u{11A47}').contains(&c) {
        return true;
    }
    if ('\u{11A50}'..='\u{11A99}').contains(&c) {
        return true;
    }
    if ('\u{11A9D}'..='\u{11A9D}').contains(&c) {
        return true;
    }
    if ('\u{11AB0}'..='\u{11AF8}').contains(&c) {
        return true;
    }
    if ('\u{11C00}'..='\u{11C08}').contains(&c) {
        return true;
    }
    if ('\u{11C0A}'..='\u{11C36}').contains(&c) {
        return true;
    }
    if ('\u{11C38}'..='\u{11C40}').contains(&c) {
        return true;
    }
    if ('\u{11C50}'..='\u{11C59}').contains(&c) {
        return true;
    }
    if ('\u{11C72}'..='\u{11C8F}').contains(&c) {
        return true;
    }
    if ('\u{11C92}'..='\u{11CA7}').contains(&c) {
        return true;
    }
    if ('\u{11CA9}'..='\u{11CB6}').contains(&c) {
        return true;
    }
    if ('\u{11D00}'..='\u{11D06}').contains(&c) {
        return true;
    }
    if ('\u{11D08}'..='\u{11D09}').contains(&c) {
        return true;
    }
    if ('\u{11D0B}'..='\u{11D36}').contains(&c) {
        return true;
    }
    if ('\u{11D3A}'..='\u{11D3A}').contains(&c) {
        return true;
    }
    if ('\u{11D3C}'..='\u{11D3D}').contains(&c) {
        return true;
    }
    if ('\u{11D3F}'..='\u{11D47}').contains(&c) {
        return true;
    }
    if ('\u{11D50}'..='\u{11D59}').contains(&c) {
        return true;
    }
    if ('\u{11D60}'..='\u{11D65}').contains(&c) {
        return true;
    }
    if ('\u{11D67}'..='\u{11D68}').contains(&c) {
        return true;
    }
    if ('\u{11D6A}'..='\u{11D8E}').contains(&c) {
        return true;
    }
    if ('\u{11D90}'..='\u{11D91}').contains(&c) {
        return true;
    }
    if ('\u{11D93}'..='\u{11D98}').contains(&c) {
        return true;
    }
    if ('\u{11DA0}'..='\u{11DA9}').contains(&c) {
        return true;
    }
    if ('\u{11EE0}'..='\u{11EF6}').contains(&c) {
        return true;
    }
    if ('\u{11FB0}'..='\u{11FB0}').contains(&c) {
        return true;
    }
    if ('\u{12000}'..='\u{12399}').contains(&c) {
        return true;
    }
    if ('\u{12400}'..='\u{1246E}').contains(&c) {
        return true;
    }
    if ('\u{12480}'..='\u{12543}').contains(&c) {
        return true;
    }
    if ('\u{12F90}'..='\u{12FF0}').contains(&c) {
        return true;
    }
    if ('\u{13000}'..='\u{1342E}').contains(&c) {
        return true;
    }
    if ('\u{14400}'..='\u{14646}').contains(&c) {
        return true;
    }
    if ('\u{16800}'..='\u{16A38}').contains(&c) {
        return true;
    }
    if ('\u{16A40}'..='\u{16A5E}').contains(&c) {
        return true;
    }
    if ('\u{16A60}'..='\u{16A69}').contains(&c) {
        return true;
    }
    if ('\u{16A70}'..='\u{16ABE}').contains(&c) {
        return true;
    }
    if ('\u{16AC0}'..='\u{16AC9}').contains(&c) {
        return true;
    }
    if ('\u{16AD0}'..='\u{16AED}').contains(&c) {
        return true;
    }
    if ('\u{16AF0}'..='\u{16AF4}').contains(&c) {
        return true;
    }
    if ('\u{16B00}'..='\u{16B36}').contains(&c) {
        return true;
    }
    if ('\u{16B40}'..='\u{16B43}').contains(&c) {
        return true;
    }
    if ('\u{16B50}'..='\u{16B59}').contains(&c) {
        return true;
    }
    if ('\u{16B63}'..='\u{16B77}').contains(&c) {
        return true;
    }
    if ('\u{16B7D}'..='\u{16B8F}').contains(&c) {
        return true;
    }
    if ('\u{16E40}'..='\u{16E7F}').contains(&c) {
        return true;
    }
    if ('\u{16F00}'..='\u{16F4A}').contains(&c) {
        return true;
    }
    if ('\u{16F4F}'..='\u{16F87}').contains(&c) {
        return true;
    }
    if ('\u{16F8F}'..='\u{16F9F}').contains(&c) {
        return true;
    }
    if ('\u{16FE0}'..='\u{16FE1}').contains(&c) {
        return true;
    }
    if ('\u{16FE3}'..='\u{16FE4}').contains(&c) {
        return true;
    }
    if ('\u{16FF0}'..='\u{16FF1}').contains(&c) {
        return true;
    }
    if ('\u{17000}'..='\u{187F7}').contains(&c) {
        return true;
    }
    if ('\u{18800}'..='\u{18CD5}').contains(&c) {
        return true;
    }
    if ('\u{18D00}'..='\u{18D08}').contains(&c) {
        return true;
    }
    if ('\u{1AFF0}'..='\u{1AFF3}').contains(&c) {
        return true;
    }
    if ('\u{1AFF5}'..='\u{1AFFB}').contains(&c) {
        return true;
    }
    if ('\u{1AFFD}'..='\u{1AFFE}').contains(&c) {
        return true;
    }
    if ('\u{1B000}'..='\u{1B122}').contains(&c) {
        return true;
    }
    if ('\u{1B150}'..='\u{1B152}').contains(&c) {
        return true;
    }
    if ('\u{1B164}'..='\u{1B167}').contains(&c) {
        return true;
    }
    if ('\u{1B170}'..='\u{1B2FB}').contains(&c) {
        return true;
    }
    if ('\u{1BC00}'..='\u{1BC6A}').contains(&c) {
        return true;
    }
    if ('\u{1BC70}'..='\u{1BC7C}').contains(&c) {
        return true;
    }
    if ('\u{1BC80}'..='\u{1BC88}').contains(&c) {
        return true;
    }
    if ('\u{1BC90}'..='\u{1BC99}').contains(&c) {
        return true;
    }
    if ('\u{1BC9D}'..='\u{1BC9E}').contains(&c) {
        return true;
    }
    if ('\u{1CF00}'..='\u{1CF2D}').contains(&c) {
        return true;
    }
    if ('\u{1CF30}'..='\u{1CF46}').contains(&c) {
        return true;
    }
    if ('\u{1D165}'..='\u{1D169}').contains(&c) {
        return true;
    }
    if ('\u{1D16D}'..='\u{1D172}').contains(&c) {
        return true;
    }
    if ('\u{1D17B}'..='\u{1D182}').contains(&c) {
        return true;
    }
    if ('\u{1D185}'..='\u{1D18B}').contains(&c) {
        return true;
    }
    if ('\u{1D1AA}'..='\u{1D1AD}').contains(&c) {
        return true;
    }
    if ('\u{1D242}'..='\u{1D244}').contains(&c) {
        return true;
    }
    if ('\u{1D400}'..='\u{1D454}').contains(&c) {
        return true;
    }
    if ('\u{1D456}'..='\u{1D49C}').contains(&c) {
        return true;
    }
    if ('\u{1D49E}'..='\u{1D49F}').contains(&c) {
        return true;
    }
    if ('\u{1D4A2}'..='\u{1D4A2}').contains(&c) {
        return true;
    }
    if ('\u{1D4A5}'..='\u{1D4A6}').contains(&c) {
        return true;
    }
    if ('\u{1D4A9}'..='\u{1D4AC}').contains(&c) {
        return true;
    }
    if ('\u{1D4AE}'..='\u{1D4B9}').contains(&c) {
        return true;
    }
    if ('\u{1D4BB}'..='\u{1D4BB}').contains(&c) {
        return true;
    }
    if ('\u{1D4BD}'..='\u{1D4C3}').contains(&c) {
        return true;
    }
    if ('\u{1D4C5}'..='\u{1D505}').contains(&c) {
        return true;
    }
    if ('\u{1D507}'..='\u{1D50A}').contains(&c) {
        return true;
    }
    if ('\u{1D50D}'..='\u{1D514}').contains(&c) {
        return true;
    }
    if ('\u{1D516}'..='\u{1D51C}').contains(&c) {
        return true;
    }
    if ('\u{1D51E}'..='\u{1D539}').contains(&c) {
        return true;
    }
    if ('\u{1D53B}'..='\u{1D53E}').contains(&c) {
        return true;
    }
    if ('\u{1D540}'..='\u{1D544}').contains(&c) {
        return true;
    }
    if ('\u{1D546}'..='\u{1D546}').contains(&c) {
        return true;
    }
    if ('\u{1D54A}'..='\u{1D550}').contains(&c) {
        return true;
    }
    if ('\u{1D552}'..='\u{1D6A5}').contains(&c) {
        return true;
    }
    if ('\u{1D6A8}'..='\u{1D6C0}').contains(&c) {
        return true;
    }
    if ('\u{1D6C2}'..='\u{1D6DA}').contains(&c) {
        return true;
    }
    if ('\u{1D6DC}'..='\u{1D6FA}').contains(&c) {
        return true;
    }
    if ('\u{1D6FC}'..='\u{1D714}').contains(&c) {
        return true;
    }
    if ('\u{1D716}'..='\u{1D734}').contains(&c) {
        return true;
    }
    if ('\u{1D736}'..='\u{1D74E}').contains(&c) {
        return true;
    }
    if ('\u{1D750}'..='\u{1D76E}').contains(&c) {
        return true;
    }
    if ('\u{1D770}'..='\u{1D788}').contains(&c) {
        return true;
    }
    if ('\u{1D78A}'..='\u{1D7A8}').contains(&c) {
        return true;
    }
    if ('\u{1D7AA}'..='\u{1D7C2}').contains(&c) {
        return true;
    }
    if ('\u{1D7C4}'..='\u{1D7CB}').contains(&c) {
        return true;
    }
    if ('\u{1D7CE}'..='\u{1D7FF}').contains(&c) {
        return true;
    }
    if ('\u{1DA00}'..='\u{1DA36}').contains(&c) {
        return true;
    }
    if ('\u{1DA3B}'..='\u{1DA6C}').contains(&c) {
        return true;
    }
    if ('\u{1DA75}'..='\u{1DA75}').contains(&c) {
        return true;
    }
    if ('\u{1DA84}'..='\u{1DA84}').contains(&c) {
        return true;
    }
    if ('\u{1DA9B}'..='\u{1DA9F}').contains(&c) {
        return true;
    }
    if ('\u{1DAA1}'..='\u{1DAAF}').contains(&c) {
        return true;
    }
    if ('\u{1DF00}'..='\u{1DF1E}').contains(&c) {
        return true;
    }
    if ('\u{1E000}'..='\u{1E006}').contains(&c) {
        return true;
    }
    if ('\u{1E008}'..='\u{1E018}').contains(&c) {
        return true;
    }
    if ('\u{1E01B}'..='\u{1E021}').contains(&c) {
        return true;
    }
    if ('\u{1E023}'..='\u{1E024}').contains(&c) {
        return true;
    }
    if ('\u{1E026}'..='\u{1E02A}').contains(&c) {
        return true;
    }
    if ('\u{1E100}'..='\u{1E12C}').contains(&c) {
        return true;
    }
    if ('\u{1E130}'..='\u{1E13D}').contains(&c) {
        return true;
    }
    if ('\u{1E140}'..='\u{1E149}').contains(&c) {
        return true;
    }
    if ('\u{1E14E}'..='\u{1E14E}').contains(&c) {
        return true;
    }
    if ('\u{1E290}'..='\u{1E2AE}').contains(&c) {
        return true;
    }
    if ('\u{1E2C0}'..='\u{1E2F9}').contains(&c) {
        return true;
    }
    if ('\u{1E7E0}'..='\u{1E7E6}').contains(&c) {
        return true;
    }
    if ('\u{1E7E8}'..='\u{1E7EB}').contains(&c) {
        return true;
    }
    if ('\u{1E7ED}'..='\u{1E7EE}').contains(&c) {
        return true;
    }
    if ('\u{1E7F0}'..='\u{1E7FE}').contains(&c) {
        return true;
    }
    if ('\u{1E800}'..='\u{1E8C4}').contains(&c) {
        return true;
    }
    if ('\u{1E8D0}'..='\u{1E8D6}').contains(&c) {
        return true;
    }
    if ('\u{1E900}'..='\u{1E94B}').contains(&c) {
        return true;
    }
    if ('\u{1E950}'..='\u{1E959}').contains(&c) {
        return true;
    }
    if ('\u{1EE00}'..='\u{1EE03}').contains(&c) {
        return true;
    }
    if ('\u{1EE05}'..='\u{1EE1F}').contains(&c) {
        return true;
    }
    if ('\u{1EE21}'..='\u{1EE22}').contains(&c) {
        return true;
    }
    if ('\u{1EE24}'..='\u{1EE24}').contains(&c) {
        return true;
    }
    if ('\u{1EE27}'..='\u{1EE27}').contains(&c) {
        return true;
    }
    if ('\u{1EE29}'..='\u{1EE32}').contains(&c) {
        return true;
    }
    if ('\u{1EE34}'..='\u{1EE37}').contains(&c) {
        return true;
    }
    if ('\u{1EE39}'..='\u{1EE39}').contains(&c) {
        return true;
    }
    if ('\u{1EE3B}'..='\u{1EE3B}').contains(&c) {
        return true;
    }
    if ('\u{1EE42}'..='\u{1EE42}').contains(&c) {
        return true;
    }
    if ('\u{1EE47}'..='\u{1EE47}').contains(&c) {
        return true;
    }
    if ('\u{1EE49}'..='\u{1EE49}').contains(&c) {
        return true;
    }
    if ('\u{1EE4B}'..='\u{1EE4B}').contains(&c) {
        return true;
    }
    if ('\u{1EE4D}'..='\u{1EE4F}').contains(&c) {
        return true;
    }
    if ('\u{1EE51}'..='\u{1EE52}').contains(&c) {
        return true;
    }
    if ('\u{1EE54}'..='\u{1EE54}').contains(&c) {
        return true;
    }
    if ('\u{1EE57}'..='\u{1EE57}').contains(&c) {
        return true;
    }
    if ('\u{1EE59}'..='\u{1EE59}').contains(&c) {
        return true;
    }
    if ('\u{1EE5B}'..='\u{1EE5B}').contains(&c) {
        return true;
    }
    if ('\u{1EE5D}'..='\u{1EE5D}').contains(&c) {
        return true;
    }
    if ('\u{1EE5F}'..='\u{1EE5F}').contains(&c) {
        return true;
    }
    if ('\u{1EE61}'..='\u{1EE62}').contains(&c) {
        return true;
    }
    if ('\u{1EE64}'..='\u{1EE64}').contains(&c) {
        return true;
    }
    if ('\u{1EE67}'..='\u{1EE6A}').contains(&c) {
        return true;
    }
    if ('\u{1EE6C}'..='\u{1EE72}').contains(&c) {
        return true;
    }
    if ('\u{1EE74}'..='\u{1EE77}').contains(&c) {
        return true;
    }
    if ('\u{1EE79}'..='\u{1EE7C}').contains(&c) {
        return true;
    }
    if ('\u{1EE7E}'..='\u{1EE7E}').contains(&c) {
        return true;
    }
    if ('\u{1EE80}'..='\u{1EE89}').contains(&c) {
        return true;
    }
    if ('\u{1EE8B}'..='\u{1EE9B}').contains(&c) {
        return true;
    }
    if ('\u{1EEA1}'..='\u{1EEA3}').contains(&c) {
        return true;
    }
    if ('\u{1EEA5}'..='\u{1EEA9}').contains(&c) {
        return true;
    }
    if ('\u{1EEAB}'..='\u{1EEBB}').contains(&c) {
        return true;
    }
    if ('\u{1FBF0}'..='\u{1FBF9}').contains(&c) {
        return true;
    }
    if ('\u{20000}'..='\u{2A6DF}').contains(&c) {
        return true;
    }
    if ('\u{2A700}'..='\u{2B738}').contains(&c) {
        return true;
    }
    if ('\u{2B740}'..='\u{2B81D}').contains(&c) {
        return true;
    }
    if ('\u{2B820}'..='\u{2CEA1}').contains(&c) {
        return true;
    }
    if ('\u{2CEB0}'..='\u{2EBE0}').contains(&c) {
        return true;
    }
    if ('\u{2F800}'..='\u{2FA1D}').contains(&c) {
        return true;
    }
    if ('\u{30000}'..='\u{3134A}').contains(&c) {
        return true;
    }
    if ('\u{E0100}'..='\u{E01EF}').contains(&c) {
        return true;
    }
    false
}

/// Character is valid identifier start table.
/// fork from jsparagus
const IS_ID_START_TABLE: &[bool] = &[
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true, true, true, false, false, false, false, false,
    false, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true, true, true, true, true, false, false, false,
    false, false,
];

pub const IS_ID_CONTINUE_TABLE: &[bool] = &[
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, false, false, false, false,
    false, false, false, false, false, false, false, false, false, true, true, true, true, true,
    true, true, true, true, true, false, false, false, false, false, false, false, true, true,
    true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true, false, false, false, false, true, false, true,
    true, true, true, true, true, true, true, true, true, true, true, true, true, true, true, true,
    true, true, true, true, true, true, true, true, true, false, false, false, false, false,
];

const FLAG_ID_START: u8 = 1;
const FLAG_ID_CONTINUE: u8 = 2;

pub struct CharInfo {
    flags: u8,
}

impl CharInfo {
    pub fn is_id_start(&self) -> bool {
        self.flags & FLAG_ID_START != 0
    }

    pub fn is_id_continue(&self) -> bool {
        self.flags & FLAG_ID_CONTINUE != 0
    }
}

pub const CHAR_INFO_TABLE: &[CharInfo] = &[
    CharInfo { flags: 0 },
    CharInfo { flags: 2 },
    CharInfo { flags: 3 },
];

const SHIFT: usize = 4;

pub fn char_info(c: char) -> &'static CharInfo {
    let code = c as usize;
    let index = INDEX1[code >> SHIFT] as usize;
    let index = INDEX2[(index << SHIFT) + (code & ((1 << SHIFT) - 1))] as usize;

    &CHAR_INFO_TABLE[index]
}

pub const INDEX1: &[u8] = &[
    0, 0, 0, 1, 2, 3, 2, 4, 0, 0, 5, 6, 7, 8, 7, 8, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 9, 10, 11, 0, 12, 12, 12, 12, 12, 12, 12, 13, 14, 7, 15, 7,
    7, 7, 7, 16, 7, 7, 7, 7, 7, 7, 7, 7, 17, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 2, 7, 18, 7, 7, 19, 20,
    12, 21, 22, 7, 23, 24, 0, 25, 7, 7, 26, 12, 27, 28, 7, 7, 7, 7, 7, 29, 30, 31, 0, 32, 7, 12,
    33, 7, 7, 7, 7, 7, 34, 35, 36, 7, 26, 37, 7, 38, 39, 0, 7, 40, 4, 7, 41, 42, 7, 7, 43, 12, 44,
    12, 45, 7, 7, 46, 12, 47, 48, 2, 49, 50, 51, 52, 53, 54, 48, 55, 56, 50, 51, 57, 58, 59, 60,
    61, 62, 15, 51, 63, 64, 65, 48, 66, 67, 50, 51, 63, 68, 69, 48, 70, 71, 72, 73, 74, 75, 76, 60,
    0, 77, 78, 51, 79, 80, 81, 48, 0, 82, 78, 51, 83, 80, 84, 48, 85, 86, 78, 7, 87, 88, 89, 48,
    90, 91, 92, 7, 93, 94, 95, 60, 96, 2, 7, 7, 97, 98, 1, 0, 0, 99, 7, 100, 101, 102, 103, 0, 0,
    65, 104, 1, 105, 106, 7, 107, 20, 108, 109, 12, 110, 111, 0, 0, 0, 7, 7, 26, 112, 1, 113, 114,
    115, 116, 117, 7, 7, 118, 7, 7, 119, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 120, 121, 7, 7, 120, 7, 7, 122, 123, 8, 7, 7, 7, 123, 7, 7, 7, 124, 125, 126, 7, 0, 7, 7, 7,
    7, 7, 127, 2, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 128, 7, 2, 4, 7, 7, 7, 7, 129, 19, 7, 130, 7, 131, 7, 132, 133,
    134, 7, 7, 7, 135, 12, 136, 1, 0, 137, 1, 7, 7, 7, 7, 7, 19, 7, 7, 138, 7, 7, 7, 7, 139, 7,
    140, 141, 141, 60, 7, 142, 143, 7, 7, 144, 7, 145, 25, 0, 0, 7, 146, 7, 7, 7, 147, 12, 148, 1,
    1, 149, 21, 150, 0, 0, 0, 151, 7, 7, 135, 152, 1, 153, 154, 155, 7, 156, 36, 7, 7, 34, 154, 7,
    7, 135, 157, 158, 36, 7, 142, 19, 7, 7, 159, 0, 160, 161, 162, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 12, 12, 12, 12, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 127, 7, 7, 127, 163, 7,
    142, 7, 7, 7, 164, 165, 166, 107, 165, 0, 0, 0, 167, 168, 169, 0, 170, 0, 107, 0, 0, 0, 110,
    171, 168, 172, 173, 174, 175, 176, 0, 7, 7, 19, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 177, 178, 7, 7, 118, 7, 7, 7, 179, 167, 7, 180, 181, 181, 181, 181, 12, 12, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    182, 0, 183, 184, 2, 7, 7, 7, 7, 185, 2, 7, 7, 7, 7, 119, 186, 7, 7, 2, 7, 7, 7, 7, 140, 0, 7,
    7, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 107, 0, 0, 0, 0, 7, 7, 142, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 107, 7, 187, 0, 7, 7, 188, 189, 7, 190, 7, 7, 7, 7, 7, 126, 0, 191, 192,
    7, 7, 7, 7, 7, 193, 7, 7, 7, 4, 194, 0, 192, 195, 7, 196, 0, 7, 7, 7, 197, 198, 7, 7, 135, 199,
    1, 12, 200, 36, 7, 201, 7, 202, 154, 7, 107, 45, 7, 7, 203, 204, 1, 205, 206, 7, 7, 207, 208,
    209, 1, 7, 210, 7, 7, 7, 211, 212, 213, 26, 214, 215, 216, 181, 7, 7, 119, 145, 7, 7, 7, 7, 7,
    7, 7, 217, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    197, 7, 218, 7, 7, 144, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 142, 7, 7, 7, 7, 7, 7, 145, 0, 0, 180, 219, 51, 220,
    221, 7, 7, 7, 7, 7, 7, 10, 0, 222, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
    7, 142, 0, 7, 7, 7, 7, 192, 7, 7, 223, 0, 0, 144, 12, 0, 12, 224, 225, 0, 0, 226, 7, 7, 7, 7,
    7, 7, 7, 107, 0, 1, 2, 3, 2, 4, 227, 7, 7, 7, 7, 140, 228, 229, 0, 0,
];

pub const INDEX2: &[u8] = &[
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
    0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 2, 2, 2, 2, 0, 2,
    0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
    0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2,
    2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2,
    1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
    1, 1, 1, 1, 1, 2, 2, 1, 1, 0, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 2,
    2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0, 2, 0, 0, 1, 0, 0,
    2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
    1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2,
    2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2,
    2, 0, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 1, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 2, 0,
    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0,
    0, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 0, 1, 0, 1, 1,
    1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 2, 0,
    0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 1, 2, 1, 1,
    1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2,
    1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 0, 2,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2,
    2, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 0, 2, 0, 2, 2, 0, 0, 0, 2, 2, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0,
    2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2,
    2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 2, 1, 1,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 2, 2, 2, 0, 0, 2, 0, 0,
    2, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 0, 1, 2, 1, 1,
    0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1,
    1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2,
    2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0,
    2, 2, 2, 2, 2, 0, 2, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0,
    1, 1, 1, 1, 1, 0, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1,
    1, 2, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0, 0,
    2, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2,
    2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2,
    2, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 2, 0, 0, 0, 0, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2,
    1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2,
    2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 2, 0, 2, 0, 2,
    2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0,
    2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0,
    0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 1,
    1, 1, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 0,
    0, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1,
    0, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 1, 1, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0, 0, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2,
    2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2,
    2, 2, 0, 2, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2,
    2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 0, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 2, 1, 1, 1, 2, 2, 1, 2, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1,
    2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 0, 0,
    0, 0, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0,
    0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0,
    2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 1, 2,
    2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 0, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1,
    2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
    0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 2, 0, 0, 0,
];
