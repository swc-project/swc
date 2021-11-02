///<reference path='References.ts' />
class CharacterInfo {
    static isDecimalDigit(c) {
        return c >= CharacterCodes._0 && c <= CharacterCodes._9;
    }
    static isHexDigit(c1) {
        return isDecimalDigit(c1) || c1 >= CharacterCodes.A && c1 <= CharacterCodes.F || c1 >= CharacterCodes.a && c1 <= CharacterCodes.f;
    }
    static hexValue(c2) {
        Debug.assert(isHexDigit(c2));
        return isDecimalDigit(c2) ? c2 - CharacterCodes._0 : c2 >= CharacterCodes.A && c2 <= CharacterCodes.F ? c2 - CharacterCodes.A + 10 : c2 - CharacterCodes.a + 10;
    }
}
