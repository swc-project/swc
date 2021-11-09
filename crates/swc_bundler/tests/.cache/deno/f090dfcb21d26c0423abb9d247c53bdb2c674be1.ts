// Loaded from https://deno.land/x/cliffy@v0.12.1/packages/flags/lib/utils.ts


/**
 * Fill string with given char until the string has a specified length.
 *
 * @param count The length until the string will be filled.
 * @param str   The string to fill.
 * @param char  The char to fill the string with.
 */
export function fill( count: number, str: string = '', char: string = ' ' ) {

    while ( str.length < count ) {
        str += char;
    }

    return str;
}
