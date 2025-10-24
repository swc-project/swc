export enum CHAR {
    foo = 1,        // ✅ Regular enum member

    '\t' = 0x09,    // ✅ String literal
    "\n" = 0x0A,    // ✅ String literal

    ['\v'] = 0x0B,  // ✅ String literal within brackets
    ["\f"] = 0x0C,  // ✅ String literal within brackets
    [`\r`] = 0x0D,  // ✅ Template literal (no substitution) within brackets
}