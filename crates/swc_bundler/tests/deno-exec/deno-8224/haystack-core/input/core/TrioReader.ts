/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

import { Scanner } from "../util/Scanner";
import { HDict, HValObj } from "./HDict";
import { ZincReader } from "./ZincReader";
import { LocalizedError } from "../util/LocalizedError";
import { HMarker } from "./HMarker";
import { HStr } from "./HStr";
import { HVal, valueIsKind } from "./HVal";
import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { Kind } from "./Kind";

/**
 * An identifier string used in generating error messages.
 */
const TRIO = "Trio";

/**
 * An iterator for reading dicts from a Trio file.
 */
export class TrioDictIterator implements Iterator<HDict> {
    private readonly $reader: TrioReader;

    public constructor(reader: TrioReader) {
        this.$reader = reader;
    }

    public next(): IteratorResult<HDict> {
        const dict = this.$reader.readDict();

        return {
            done: !dict,
            value: dict ? (dict as HDict) : HDict.make(),
        };
    }
}

/**
 * Reads Trio formatted text.
 *
 * ```typescript
 * // Read a trio file's dicts...
 * for (let dict of TrioReader.readAllDicts(trioStr)) {
 *   // Do something with the dict.
 * }
 *
 * // Read a trio file as a grid...
 * const gridWithSites = TrioReader.readGrid(trioStr).filter('site')
 *
 * // Alternatively use the reader as an iterator...
 * for (let dict of new TrioReader(trioStr)) {
 *   // Do something with the dict.
 * }
 * ```
 *
 * @see https://project-haystack.org/doc/Trio
 */
export class TrioReader implements Iterable<HDict> {
    /**
     * The input string to read from.
     *
     * All state for the reader is delegated to this object. This is because the
     * scanner can be shared between readers/lexers accordingly.
     *
     * No state should ever be stored in the zinc reader directly.
     */
    private readonly scanner: Scanner;

    /**
     * The underlying zinc reader.
     */
    private readonly zinc: ZincReader;

    /**
     * Constructors a new reader.
     *
     * @param input The scanner used for the input.
     */
    public constructor(input: Scanner | string) {
        this.scanner = typeof input === "string" ? new Scanner(input) : input;
        this.zinc = new ZincReader(this.scanner);
    }

    /**
     * Read the next dict or return undefined if at the end of the stream.
     *
     * @returns The next dict.
     * @throws Error if there's a problem reading the trio file.
     */
    public readDict(): HDict | undefined {
        let tags: HValObj | undefined = undefined;
        let endOfDict = false;

        // Please note, this must match up with ZincLexer#nextToken()
        while (!this.scanner.isEof() && !endOfDict) {
            switch (this.scanner.current) {
                case " ":
                case "\t":
                case "\n":
                case "\r":
                    this.scanner.consumeWhiteSpace();
                    break;
                case "-":
                    // Marks the end of a dict
                    this.consumeSeparator();

                    // Only make the end of a dict if we've read at least one tag.
                    if (tags) {
                        endOfDict = true;
                    }
                    break;
                case "/":
                    // Consume the whole line because this is a comment and we
                    // want to ignore it.
                    this.consumeLine();
                    break;
                case "a":
                case "b":
                case "c":
                case "d":
                case "e":
                case "f":
                case "g":
                case "h":
                case "i":
                case "j":
                case "k":
                case "l":
                case "m":
                case "n":
                case "o":
                case "p":
                case "q":
                case "r":
                case "s":
                case "t":
                case "u":
                case "v":
                case "w":
                case "x":
                case "y":
                case "z":
                    tags = tags || {};
                    this.tag(tags);
                    break;
                default:
                    throw new LocalizedError({
                        message: `Invalid character: ${this.scanner.current}`,
                        lex: "lexerInvalidChar",
                        args: { arg: String(this.scanner.current) },
                        index: this.scanner.index,
                    });
            }
        }

        return tags ? HDict.make(tags) : undefined;
    }

    /**
     * Iterate the reader's dicts.
     */
    public [Symbol.iterator](): Iterator<HDict> {
        return new TrioDictIterator(this);
    }

    /**
     * Read all the dicts from the reader.
     *
     * @returns All the dicts in an array.
     */
    public readAllDicts(): HDict[] {
        return [...this];
    }

    /**
     * Read a trio file and return an array of dicts.
     *
     * @param input The trio input.
     * @returns An array of dicts.
     */
    public static readAllDicts(input: string): HDict[] {
        return new TrioReader(input).readAllDicts();
    }

    /**
     * Read all the dicts into a grid.
     *
     * @returns The grid.
     */
    public readGrid(): HGrid {
        return HGrid.make({ rows: this.readAllDicts() });
    }

    /**
     * Read a trio file and return a grid.
     *
     * @param input The trio input.
     * @returns A grid.
     */
    public static readGrid(input: string): HGrid {
        return new TrioReader(input).readGrid();
    }

    /**
     * Consume any separators.
     */
    private consumeSeparator(): void {
        while (this.scanner.current === "-") {
            this.scanner.consume();
        }
    }

    /**
     * Consume the whole line of text until there's a new line.
     */
    private consumeLine(): void {
        while (!this.scanner.isEof() && !this.scanner.isNewLine()) {
            this.scanner.consume();
        }
    }

    /**
     * Read a tag and add it to the dict.
     *
     * @param dict The dict to add the tag too.
     */
    private tag(tags: HValObj): void {
        const tagName = this.zinc.tagName();

        this.scanner.consumeSpace();

        let hval: HVal | undefined | null = HMarker.make();

        if (this.scanner.is(":")) {
            this.scanner.consume().consumeSpace();

            if (this.scanner.isNewLine()) {
                hval = HStr.make(this.multiLineStringList().join("\n"));
            } else if (
                this.scanner.is("[") &&
                Scanner.isNewLine(this.scanner.next)
            ) {
                hval = this.multiLineList();
            } else {
                hval = this.lineValue();
            }
        }

        if (hval === undefined) {
            throw new LocalizedError({
                message: "Could not find a value",
                lex: "lexerNoValueFound",
                index: this.scanner.index,
            });
        }

        tags[tagName] = hval;
    }

    /**
     * Read a value from single line in a trio file.
     *
     * @returns A haystack value or undefined if null.
     * @throws An error if the string isn't a value.
     */
    private lineValue(): HVal | undefined | null {
        let hval: HVal | undefined | null;

        let line = "";

        // Read the whole line of text.
        while (!this.scanner.isEof() && !this.scanner.isNewLine()) {
            line += this.scanner.current || "";

            this.scanner.consume();
        }

        // Detect decoding a grid.
        if (line.startsWith("Zinc:") && this.scanner.isNewLine()) {
            line = "<<" + this.multiLineStringList().join("\n");

            if (!line.endsWith("\n")) {
                line += "\n";
            }

            line += ">>";
        }

        try {
            // Attempt to decode it as a zinc string.
            hval = new ZincReader(line).readValue();
        } catch (err) {
            // If it's not a valid haystack value then fallback to a haystack string
            // if we're able too. Otherwise throw an error.
            hval = HStr.make(line);
        }

        return hval;
    }

    /**
     * Read a multi-line string list.
     *
     * @returns A multi line string list.
     * @throws An error if the string can't be read.
     */
    private multiLineStringList(): string[] {
        this.scanner.expectAndConsumeNewLine(TRIO);

        const lines: string[] = [];

        while (!this.scanner.isEof()) {
            // If there's no double space then break
            if (!this.scanner.is(" ") && this.scanner.next !== " ") {
                break;
            }

            this.scanner.consumeSpace();

            let str = "";
            while (!this.scanner.isEof() && !this.scanner.isNewLine()) {
                str += this.scanner.current;

                this.scanner.consume();
            }

            lines.push(str);

            this.scanner.consumeSpace();

            if (this.scanner.isNewLine()) {
                this.scanner.expectAndConsumeNewLine(TRIO);
            }
        }

        return lines;
    }

    /**
     * Read a list from multiple lines.
     *
     * Originally specified here https://project-haystack.org/forum/topic/781
     *
     * @returns A list of values.
     * @throws An error if the list can't be read.
     */
    private multiLineList(): HList {
        this.scanner.expect("[", TRIO).consume();

        const multiLineStr = this.multiLineStringList()
            // Remove any comments
            .filter((str) => !str.startsWith("//"))
            .join("\n");

        // Read a multi-line string. Remove all new lines and parse it as normal Zinc.
        const str = "[" + multiLineStr.replace(/\r?\n|\r/g, " ");

        const hval = new ZincReader(str).readValue() as HList;

        if (!valueIsKind<HList>(hval, Kind.List)) {
            throw new LocalizedError({
                message: "Expected list",
                lex: "lexerExpectedList",
                index: this.scanner.index,
            });
        }

        return hval;
    }
}
