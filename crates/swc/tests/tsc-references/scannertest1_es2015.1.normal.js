///<reference path='References.ts' />
class CharacterInfo {
    static isDecimalDigit(c) {
        return c >= CharacterCodes._0 && c <= CharacterCodes._9;
    }
    static isHexDigit(c) {
        return isDecimalDigit(c) || c >= CharacterCodes.A && c <= CharacterCodes.F || c >= CharacterCodes.a && c <= CharacterCodes.f;
    }
    static hexValue(c) {
        Debug.assert(isHexDigit(c));
        return isDecimalDigit(c) ? c - CharacterCodes._0 : c >= CharacterCodes.A && c <= CharacterCodes.F ? c - CharacterCodes.A + 10 : c - CharacterCodes.a + 10;
    }
}
