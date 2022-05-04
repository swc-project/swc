/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { LocalizedError } from "../util/LocalizedError";
import { HTime } from "./HTime";
import { HNum } from "./HNum";
import { HDate } from "./HDate";
import { HUri } from "./HUri";
import { HStr } from "./HStr";
import { HRef } from "./HRef";
import { HVal, OptionalHVal, ZINC_NULL } from "./HVal";
import { Scanner } from "../util/Scanner";
import { HDateTime } from "./HDateTime";
import { HMarker } from "./HMarker";
import { HRemove } from "./HRemove";
import { HNa } from "./HNa";
import { HCoord } from "./HCoord";
import { Kind } from "./Kind";
import { HBool } from "./HBool";
import { HXStr } from "./HXStr";
import { HDict, HValObj } from "./HDict";
import { HSymbol } from "./HSymbol";
import { HList } from "./HList";
import { HGrid } from "./HGrid";

/**
 * A Zinc reader.
 *
 * @see https://project-haystack.org/doc/Zinc
 */
export class ZincReader {
    /**
     * The input string to read from.
     *
     * All state for the reader is delegated to this object. This is because the
     * scanner can be shared between readers/lexers accordingly (i.e. haystack filters use some
     * Zinc encoding).
     *
     * No state should ever be stored in the zinc reader directly.
     */
    private readonly scanner: Scanner;

    /**
     * Constructors a new reader.
     *
     * @param input The scanner used for the input.
     */
    public constructor(input: Scanner | string) {
        this.scanner = typeof input === "string" ? new Scanner(input) : input;
    }

    /**
     * Read the input zinc encoded string and return the haystack value for it.
     *
     * @param input The input string or scanner.
     * @returns The haystack value.
     */
    public static readValue(input: Scanner | string): HVal | undefined | null {
        return new ZincReader(input).readValue();
    }

    /**
     * Read the value and return it.
     *
     * @returns The next value.
     */
    public readValue(): HVal | undefined | null {
        while (!this.scanner.isEof()) {
            // Please note, some of this must match up with FilterParser#nextToken()
            switch (this.scanner.current) {
                case " ":
                case "\t":
                case "\n":
                case "\r":
                    this.whiteSpace();
                    continue;
                case '"':
                    return this.string();
                case "`":
                    return this.uri();
                case "@":
                    return this.ref();
                case "^":
                    return this.symbol();
                case "{":
                    return this.dict();
                case "[":
                    return this.list();
                case "<":
                case "v":
                    return this.grid();
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "-":
                    if (this.scanner.next === "I") {
                        return this.numberNegativeInfinity();
                    } else {
                        return this.numberDateTime();
                    }
                case "A":
                case "B":
                case "C":
                case "D":
                case "E":
                case "F":
                case "G":
                case "H":
                case "I":
                case "J":
                case "K":
                case "L":
                case "M":
                case "N":
                case "O":
                case "P":
                case "Q":
                case "R":
                case "S":
                case "T":
                case "U":
                case "V":
                case "W":
                case "X":
                case "Y":
                case "Z":
                    const id = this.id();

                    if (this.scanner.is("(")) {
                        if (id === "C") {
                            return this.coord();
                        } else {
                            return this.xstr(id);
                        }
                    } else if (id === ZINC_NULL) {
                        return null;
                    } else if (id === "NA") {
                        return HNa.make();
                    } else if (id === "M") {
                        return HMarker.make();
                    } else if (id === "R") {
                        return HRemove.make();
                    } else if (id === "T") {
                        return HBool.make(true);
                    } else if (id === "F") {
                        return HBool.make(false);
                    } else if (id === "NaN") {
                        return HNum.make(Number.NaN);
                    } else if (id === "INF") {
                        return HNum.make(Number.POSITIVE_INFINITY);
                    } else {
                        this.throwInvalidCharacter();
                        break;
                    }
                default:
                    this.throwInvalidCharacter();
            }
        }

        throw new LocalizedError({
            message: "Could not find a value",
            lex: "lexerNoValueFound",
            index: this.scanner.index,
        });
    }

    /**
     * Throws an invalid character error.
     *
     * @throws Always throws an invalid character error.
     */
    private throwInvalidCharacter(): void {
        throw new LocalizedError({
            message: "Invalid character",
            lex: "lexerInvalidChar",
            index: this.scanner.index,
        });
    }

    /**
     * Consume any white space characters.
     */
    private whiteSpace(): void {
        while (this.scanner.isWhiteSpace()) {
            this.scanner.consume();
        }
    }

    /**
     * Consume the data stream and return a string value.
     *
     * @returns A string value.
     * @throws If the end of the string can't be found.
     */
    public string(): HStr {
        let str = "";

        this.scanner.expect('"', Kind.Str).consume();

        while (!this.scanner.is('"')) {
            if (this.scanner.isEof()) {
                throw new LocalizedError({
                    message: `Cannot find end of string: ${str}. The end of a string must end with a "`,
                    lex: "lexerCannotFindEndOfString",
                    args: { arg: str },
                    index: this.scanner.index,
                });
            }

            if (this.scanner.is("\\")) {
                str += this.escape(/*escapeStrChars*/ true);
            } else {
                str += this.scanner.current;
            }

            this.scanner.consume();
        }
        this.scanner.consume();

        return HStr.make(str);
    }

    /**
     * Consume the data stream and return an uri value.
     *
     * @returns A uri value.
     * @throws If the end of the uri can't be found if an invalid character is found.
     */
    public uri(): HUri {
        let str = "";

        this.scanner.consume();
        while (!this.scanner.is("`")) {
            if (this.scanner.isEof()) {
                throw new LocalizedError({
                    message: `Cannot find end of URI: ${str}. The end of a URI must end with a \``,
                    lex: "lexerCannotFindEndOfUri",
                    args: { arg: str },
                    index: this.scanner.index,
                });
            }

            if (this.scanner.is("\\")) {
                switch (this.scanner.next) {
                    case ":":
                    case "/":
                    case "?":
                    case "#":
                    case "[":
                    case "]":
                    case "@":
                    case "`":
                    case "\\":
                    case "&":
                    case "=":
                    case ";":
                        str += this.scanner.current;
                        str += this.scanner.next;
                        this.scanner.consume();
                        break;
                    default:
                        str += this.escape(/*escapeStrChars*/ false);
                }
            } else {
                str += this.scanner.current;
            }

            this.scanner.consume();
        }
        this.scanner.consume();

        return HUri.make(str);
    }

    /**
     * Consume the data stream and return an ref value.
     *
     * @returns A ref value.
     * @throws If there's an error parsing the ref.
     */
    public ref(): HRef {
        let str = "";

        this.scanner.consume();

        while (
            this.scanner.isDigit() ||
            this.scanner.isLetter() ||
            this.scanner.is("_") ||
            this.scanner.is(":") ||
            this.scanner.is("-") ||
            this.scanner.is(".") ||
            this.scanner.is("~")
        ) {
            str += this.scanner.current;

            this.scanner.consume();
        }

        // We can't have an empty string as a ref
        if (!str) {
            throw new LocalizedError({
                message: `Empty ref`,
                lex: "lexerEmptyRef",
                args: { arg: str },
                index: this.scanner.index,
            });
        }

        let displayName: string | undefined;

        if (this.scanner.is(" ") && this.scanner.next === '"') {
            this.scanner.consume();
            displayName = this.string().value;
        }

        return HRef.make(str, displayName);
    }

    /**
     * Consume an escape sequence within a string.
     *
     * @returns The unescaped character.
     * @throws If the escape sequence is invalid.
     */
    private escape(escapeStrChars: boolean): string {
        this.scanner.consume(); // \

        if (escapeStrChars) {
            switch (this.scanner.current) {
                case "b":
                    return "\b";
                case "f":
                    return "\f";
                case "n":
                    return "\n";
                case "r":
                    return "\r";
                case "t":
                    return "\t";
                case '"':
                    return '"';
                case "$":
                    return "$";
                case "'":
                    return "'";
                case "`":
                    return "`";
                case "\\":
                    return "\\";
            }
        }

        if (this.scanner.is("u")) {
            let esc = "";

            for (let i = 0; i < 4; ++i) {
                this.scanner.consume();
                esc += this.scanner.current;

                if (!this.scanner.isHex()) {
                    throw new LocalizedError({
                        message: `Invalid unicode escape ${esc}`,
                        lex: "lexerInvalidUnicodeEscape",
                        args: { arg: esc },
                        index: this.scanner.index,
                    });
                }
            }

            return String.fromCharCode(parseInt(esc, 16));
        } else {
            throw new LocalizedError({
                message: `Invalid escape sequence ${this.scanner.current}`,
                lex: "lexerInvalidEscapeSequence",
                args: { arg: this.scanner.current || "" },
                index: this.scanner.index,
            });
        }
    }

    /**
     * Consume the data stream and return a number, date or time value.
     *
     * @returns A number, date, date time or time value.
     * @throws If we don't have a valid number.
     */
    public numberDateTime(): HNum | HDate | HTime | HDateTime {
        // This code was ported from haystack-java. Ideally this code should be reworked
        // to use a back tracking parser design.

        let str = String(this.scanner.current);

        let colons = 0;
        let dashes = 0;
        let unitIndex = 0;
        let exp = false;

        this.scanner.consume();

        while (!this.scanner.isEof()) {
            if (!this.scanner.isDigit()) {
                // If we have an exponent then ensure we have a + or - after it.
                if (exp && (this.scanner.is("+") || this.scanner.is("-"))) {
                    // If we have a dash then keep track of how many.
                } else if (this.scanner.is("-")) {
                    ++dashes;
                    // If we have a colon and the next character is a digit then keep
                    // track of the number of colons.
                } else if (
                    this.scanner.is(":") &&
                    Scanner.isDigit(this.scanner.next)
                ) {
                    ++colons;
                    // If we have an exponent, some colons and a plus character then continue processing.
                } else if ((exp || colons >= 1) && this.scanner.is("+")) {
                    // If we have a period then ensure the next character is a digit.
                } else if (this.scanner.is(".")) {
                    if (!Scanner.isDigit(this.scanner.next)) {
                        break;
                    }
                    // Check to see if we have an exponent.
                } else if (
                    (this.scanner.is("e") || this.scanner.is("E")) &&
                    (this.scanner.next === "-" ||
                        this.scanner.next === "+" ||
                        Scanner.isDigit(this.scanner.next))
                ) {
                    exp = true;
                } else if (
                    // Do we have some units?
                    this.scanner.isLetter() ||
                    this.scanner.is("%") ||
                    this.scanner.is("$") ||
                    this.scanner.is("/") ||
                    String(this.scanner.current).charCodeAt(0) > 128
                ) {
                    if (unitIndex === 0) {
                        unitIndex = str.length;
                    }
                    // Do we have a valid underscore we can ignore?
                } else if (this.scanner.is("_")) {
                    if (unitIndex === 0 && Scanner.isDigit(this.scanner.next)) {
                        this.scanner.consume();
                        continue;
                    } else {
                        if (unitIndex === 0) {
                            unitIndex = str.length;
                        }
                    }
                } else {
                    break;
                }
            }

            str += this.scanner.current;
            this.scanner.consume();
        }

        if (dashes === 2 && colons === 0) {
            return HDate.make(str);
        } else if (dashes === 0 && colons >= 1) {
            // Ensure the hours always has two digits.
            if (str[1] === ":") {
                str = "0" + str;
            }

            // Do we need to add seconds?
            if (colons === 1) {
                str += ":00";
            }

            return HTime.make(str);
        } else if (dashes >= 2) {
            return this.dateTime(str);
        } else {
            let unit: string | undefined;

            // Parse any units.
            if (unitIndex > 0) {
                unit = str.substring(unitIndex);
                str = str.substring(0, unitIndex);
            }

            // If we have a number then attempt to parse it and throw any errors.
            if (isNaN(Number(str))) {
                throw new LocalizedError({
                    message: `Invalid number: ${str}`,
                    lex: "lexerInvalidNumber",
                    args: { arg: str },
                    index: this.scanner.index,
                });
            }

            return HNum.make(Number(str), unit);
        }
    }

    /**
     * Read negative infinity.
     *
     * @returns A number for negative infinity.
     */
    private numberNegativeInfinity(): HNum {
        this.scanner
            .expect("-", Kind.Number)
            .consume()
            .expect("I", Kind.Number)
            .consume()
            .expect("N", Kind.Number)
            .consume()
            .expect("F", Kind.Number)
            .consume();

        return HNum.make(Number.NEGATIVE_INFINITY);
    }

    /**
     * Parse the date time into a value.
     *
     * @param dateTime The date time string.
     * @returns The haystack date time.
     * @throws An error if the date time can't be parsed.
     */
    private dateTime(dateTime: string): HDateTime {
        // xxx timezone
        if (!this.scanner.is(" ") || !Scanner.isUpperCase(this.scanner.next)) {
            if (dateTime[dateTime.length - 1] === "Z") {
                dateTime += " UTC";
            } else {
                throw new LocalizedError({
                    message: `Expecting timezone in date time`,
                    lex: "lexerExpectingTimezone",
                    index: this.scanner.index,
                });
            }
        } else {
            this.scanner.consume();
            dateTime += " ";

            while (
                this.scanner.isLetter() ||
                this.scanner.isDigit() ||
                this.scanner.is("_")
            ) {
                dateTime += this.scanner.current;
                this.scanner.consume();

                while (this.scanner.isDigit()) {
                    dateTime += this.scanner.current;
                    this.scanner.consume();
                }
            }

            // handle GMT+xx or GMT-xx
            if (
                (this.scanner.is("+") || this.scanner.is("-")) &&
                dateTime.endsWith("GMT")
            ) {
                dateTime += this.scanner.current;
                this.scanner.consume();

                while (this.scanner.isDigit()) {
                    dateTime += this.scanner.current;
                    this.scanner.consume();
                }
            }
        }

        try {
            return HDateTime.make(dateTime);
        } catch (err) {
            throw new LocalizedError({
                message: `Invalid date ${dateTime}`,
                lex: "lexerInvalidDate",
                args: { arg: dateTime },
                index: this.scanner.index,
            });
        }
    }

    /**
     * @returns A coordinate value.
     */
    private coord(): HCoord {
        this.scanner.expect("(", Kind.Coord);

        const latitude = this.decimal();
        this.scanner.expect(",", Kind.Coord);

        const longitude = this.decimal();
        this.scanner.expect(")", Kind.Coord).consume();

        try {
            return HCoord.make({ latitude, longitude });
        } catch (err) {
            throw new LocalizedError({
                message: err.message,
                lex: err.message,
                index: this.scanner.index,
            });
        }
    }

    /**
     * @returns A decimal number.
     */
    private decimal(): number {
        let buf = "";
        this.scanner.consume();
        while (
            this.scanner.isDigit() ||
            this.scanner.is(".") ||
            this.scanner.is("-")
        ) {
            buf += this.scanner.current;
            this.scanner.consume();
        }

        const num = Number(buf);

        if (isNaN(num)) {
            throw new LocalizedError({
                message: `Invalid decimal number ${buf}`,
                lex: "lexerInvalidDecimal",
                args: { arg: buf },
                index: this.scanner.index,
            });
        }

        return num;
    }

    /**
     * @returns The id string.
     */
    private id(): string {
        let id = String(this.scanner.current);
        this.scanner.consume();

        while (
            this.scanner.isLetter() ||
            this.scanner.isDigit() ||
            this.scanner.is("_")
        ) {
            id += String(this.scanner.current);
            this.scanner.consume();
        }

        return id;
    }

    /**
     * Returns an xstring.
     *
     * @param type The XStr or Bin type.
     * @returns A haystack xstring.
     */
    private xstr(type: string): HXStr {
        this.scanner.expect("(", Kind.XStr).consume();

        const hvalue = this.string();

        this.scanner.expect(")", Kind.XStr).consume();

        try {
            const value = hvalue.valueOf() as string;
            return HXStr.make(type, value);
        } catch (err) {
            throw new LocalizedError({
                message: err.message,
                lex: err.message,
                index: this.scanner.index,
            });
        }
    }

    /**
     * @returns A dict value
     */
    private dict(): HDict {
        this.scanner.expect("{", Kind.Dict).consume();

        const tags: HValObj = {};
        while (!this.scanner.isEof() && !this.scanner.is("}")) {
            this.scanner.consumeSpace();
            this.tag(tags);

            // Consume any commas between values.
            // https://project-haystack.org/forum/topic/781
            if (this.scanner.consumeSpace().is(",")) {
                this.scanner.consume();
            }
        }

        this.scanner.expect("}", Kind.Dict).consume();

        return HDict.make(tags);
    }

    /**
     * Consume a tag and add it to the tags object.
     *
     * @param tags The tags object.
     */
    private tag(tags: HValObj): void {
        const tagName = this.tagName();
        this.scanner.consumeSpace();

        let hval: HVal | undefined | null = HMarker.make();

        // Is this a marker tag or does it have a value?
        if (this.scanner.is(":")) {
            this.scanner.consume();

            hval = this.readValue();
        }

        // Ignore undefined values decoded from a dict.
        if (hval !== undefined) {
            tags[tagName] = hval;
        }

        this.scanner.consumeSpace();
    }

    /**
     * @returns A tag name.
     */
    public tagName(): string {
        let tagName = "";

        // First letter must be a letter and lower case.
        if (!this.scanner.isLetter() || !this.scanner.isLowerCase()) {
            throw new LocalizedError({
                message: "Invalid tag name",
                lex: "lexerInvalidTagName",
                index: this.scanner.index,
            });
        }

        tagName += this.scanner.current;
        this.scanner.consume();

        // Read the rest of the tag name.
        while (
            this.scanner.isLetter() ||
            this.scanner.isDigit() ||
            this.scanner.is("_")
        ) {
            tagName += this.scanner.current;
            this.scanner.consume();
        }

        return tagName;
    }

    /**
     * @returns A symbol value.
     */
    public symbol(): HSymbol {
        this.scanner.expect("^", Kind.Symbol).consume();

        let symbol = "";
        while (
            this.scanner.isLetter() ||
            this.scanner.isDigit() ||
            this.scanner.is("_") ||
            this.scanner.is(":") ||
            this.scanner.is("-") ||
            this.scanner.is(".") ||
            this.scanner.is("~")
        ) {
            symbol += this.scanner.current;
            this.scanner.consume();
        }

        // We can't have an empty string as a symbol
        if (!symbol) {
            throw new LocalizedError({
                message: `Empty symbol`,
                lex: "lexerEmptySymbol",
                args: { arg: symbol },
                index: this.scanner.index,
            });
        }

        return HSymbol.make(symbol);
    }

    /**
     * @returns A list value.
     */
    private list(): HList {
        const list: OptionalHVal[] = [];

        this.scanner.expect("[", Kind.List).consume();

        while (!this.scanner.isEof() && !this.scanner.is("]")) {
            const hval = this.readValue();

            // Ignore null values.
            if (hval !== undefined) {
                list.push(hval);
            }

            this.scanner.consumeSpace();

            if (!this.scanner.is("]")) {
                this.scanner.expect(",", Kind.List).consume();
            }

            this.scanner.consumeSpace();
        }

        this.scanner.expect("]", Kind.List).consume();

        return HList.make(list);
    }

    /**
     * @returns a grid value.
     */
    private grid(): HGrid {
        const nested = this.scanner.is("<");
        if (nested) {
            this.scanner
                .expect("<", Kind.Grid)
                .consume()
                .expect("<", Kind.Grid)
                .consume()
                .consumeWhiteSpace();
        }

        // Version
        this.scanner
            .expect("v", Kind.Grid)
            .consume()
            .expect("e", Kind.Grid)
            .consume()
            .expect("r", Kind.Grid)
            .consume()
            .consumeSpace()
            .expect(":", Kind.Grid)
            .consume()
            .consumeSpace();

        const version = this.string().value;

        if (!version) {
            throw new LocalizedError({
                message: "Grid does not contain version (ver) in meta data",
                lex: "lexerGridDoesNotContainVersion",
                index: this.scanner.index,
            });
        }

        // Grid meta data
        const meta = this.gridMeta();

        this.scanner.expectAndConsumeNewLine(Kind.Grid);

        // Grid columns
        const columns: { name: string; meta: HDict }[] = [];

        while (!this.scanner.isEof()) {
            this.scanner.consumeSpace();

            const name = this.tagName();
            const meta = this.gridColumnMeta();

            columns.push({
                name,
                meta,
            });

            this.scanner.consumeSpace();

            if (this.scanner.isNewLine()) {
                this.scanner.expectAndConsumeNewLine(Kind.Grid);
                break;
            } else {
                this.scanner.expect(",", Kind.Grid).consume();
            }
        }

        // Please note: eventually it would be best to lazily stream the parsing of a grid
        // rather than do it all at once beforehand. For instance, pass an iterator in for the rows.

        // Grid rows
        const rows: HDict[] = [];

        while (!this.scanner.isEof()) {
            // If we immediately have a newline then break from parsing rows.
            if (this.scanner.isNewLine()) {
                this.scanner.consume();
                break;
            }

            const cells = HDict.make();

            let lastWasValue = false;

            // Grid cells in a row
            let index = 0;
            while (!this.scanner.isEof()) {
                this.scanner.consumeSpace();

                if (this.scanner.isNewLine()) {
                    // If we didn't have a value on the last iteration
                    // then is a blank string or the last value was a comma
                    if (!lastWasValue) {
                        ++index;
                    }

                    this.scanner.expectAndConsumeNewLine(Kind.Grid);
                    break;
                } else if (this.scanner.is(",")) {
                    // Is this comma a separator or a symbol?

                    // If we last read a value then the comma is a separator.
                    if (!lastWasValue) {
                        ++index;
                    }

                    lastWasValue = false;
                    this.scanner.consume();
                } else {
                    // Expect separator
                    if (lastWasValue) {
                        this.scanner.expect(",", Kind.Grid);
                    }

                    lastWasValue = true;

                    const value = this.readValue();

                    if (value !== undefined) {
                        cells.set(columns[index].name, value);
                    }

                    ++index;
                }
            }

            rows.push(cells);

            // End of grid?
            if (nested && this.scanner.consumeSpace().is(">")) {
                break;
            }
        }

        if (nested) {
            // End of grid
            this.scanner
                .consumeWhiteSpace()
                .expect(">", Kind.Grid)
                .consume()
                .expect(">", Kind.Grid)
                .consume();
        }

        // If the grid has no rows and has one empty column then ignore the empty column.
        if (
            !rows.length &&
            columns.length === 1 &&
            columns[0].name === "empty"
        ) {
            columns.splice(0, 1);
        }

        return HGrid.make(
            { meta, columns, rows, version },
            /*skipChecks*/ true
        );
    }

    /**
     * @returns The grid meta data.
     */
    private gridMeta(): HDict {
        let meta: HDict;

        // If there's extra meta data then consume it.
        if (this.scanner.is(" ")) {
            this.scanner.consumeSpace();

            const tags: HValObj = {};
            while (!this.scanner.isEof() && !this.scanner.isNewLine()) {
                this.tag(tags);
            }

            meta = HDict.make(tags);
        } else {
            meta = HDict.make();
        }

        return meta;
    }

    /**
     * @returns The grid column meta data.
     */
    private gridColumnMeta(): HDict {
        let meta: HDict;

        // If there's extra meta data then consume it.
        if (this.scanner.is(" ")) {
            this.scanner.consumeSpace();

            const tags: HValObj = {};
            while (
                !this.scanner.isEof() &&
                !this.scanner.isNewLine() &&
                !this.scanner.is(",")
            ) {
                this.tag(tags);
            }

            meta = HDict.make(tags);
        } else {
            meta = HDict.make();
        }

        return meta;
    }
}
