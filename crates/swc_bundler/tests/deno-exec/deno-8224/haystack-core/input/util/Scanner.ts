import { LocalizedError } from "./LocalizedError";

/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

const A_CHAR_CODE = "a".charCodeAt(0);
const Z_CHAR_CODE = "z".charCodeAt(0);
const UPPER_A_CHAR_CODE = "A".charCodeAt(0);
const UPPER_Z_CHAR_CODE = "Z".charCodeAt(0);
const ZERO_CHAR_CODE = "0".charCodeAt(0);
const NINE_CHAR_CODE = "9".charCodeAt(0);

/**
 * Scans an input text string for character symbols.
 *
 * This scanner provides a reference to the current and next characters
 * when parsing a string.
 */
export class Scanner {
    /**
     * The input string to read from.
     */
    public readonly input: string;

    /**
     * The current character read from the input.
     */
    public current: string | null = null;

    /**
     * The next character read from the input.
     */
    public next: string | null = null;

    /**
     * The current character index from the input.
     */
    public index = 0;

    /**
     * Constructors a new lexer.
     *
     * @param input The input haystack filter string to process.
     */
    public constructor(input: string) {
        this.input = input;

        // Prime the scanner.
        this.update();
    }

    /**
     * Consume the next character.
     *
     * @returns The scanner instance.
     */
    public consume(): this {
        ++this.index;
        this.update();
        return this;
    }

    /**
     * Expect a new line character and consume it.
     *
     * This will handle carriage return line feeds as well.
     *
     * @param id The expected id.
     * @returns The scanner instance.
     * @throws An error if a newline isn't found.
     */
    public expectAndConsumeNewLine(id: string): this {
        // Handle carriage return line feeds as well.
        if (this.current === "\r" && this.next === "\n") {
            this.consume();
        }
        this.expect("\n", id);
        this.consume();
        return this;
    }

    /**
     * Expect the current character or throw an error.
     *
     * @param expected The expected character.
     * @param id The expected id.
     * @returns The scanner instance.
     * @throws An error if the two values don't match.
     */
    public expect(expected: string, id: string): this {
        if (this.current !== expected) {
            this.throwExpectedError(expected, id);
        }
        return this;
    }

    /**
     * Throw an error for an expected value.
     *
     * @param expected The expected character.
     * @param id The expected id.
     * @throws Always throws an expected error.
     */
    private throwExpectedError(expected: string, id: string): void {
        throw new LocalizedError({
            message: `Expected ${expected} for ${id}`,
            lex: "lexerExpected",
            args: { arg0: expected, arg1: id },
            index: this.index,
        });
    }

    /**
     * Update character references.
     */
    private update(): void {
        this.current =
            this.index >= this.input.length ? null : this.input[this.index];

        this.next =
            this.index + 1 >= this.input.length
                ? null
                : this.input[this.index + 1];
    }

    /**
     * Return true if the specified character matches the current character.
     *
     * @param c The character to test.
     * @returns True if there's a match.
     */
    public is(c: string | null): boolean {
        return this.current === c;
    }

    /**
     * Return true if the end of the data stream has been reached.
     *
     * @returns True if EOF.
     */
    public isEof(): boolean {
        return this.current === null;
    }

    /**
     * Consume any space characters.
     *
     * This does not consume all different types of white space - just space characters.
     * @returns The scanner instance.
     */
    public consumeSpace(): this {
        while (this.current === " ") {
            this.consume();
        }
        return this;
    }

    /**
     * Consume any white space characters.
     * @returns The scanner instance.
     */
    public consumeWhiteSpace(): this {
        while (this.isWhiteSpace()) {
            this.consume();
        }
        return this;
    }

    /**
     * Return true if the current character is a valid letter (a-z and A-Z).
     *
     * @returns True if valid letter.
     */
    public isLetter(): boolean {
        return Scanner.isLetter(this.current);
    }

    /**
     * Return true if the current character is a newline.
     *
     * @returns True if the current character is a new line.
     */
    public isNewLine(): boolean {
        return Scanner.isNewLine(this.current);
    }

    /**
     * Return true if the character is a newline.
     *
     * @param c The character to test.
     * @returns True if the character is a new line.
     */
    public static isNewLine(c: string | null): boolean {
        return c === "\n" || c === "\r";
    }

    /**
     * Return true if the character is a valid letter (a-z and A-Z).
     *
     * @param c The character to test.
     * @returns True if valid letter.
     */
    public static isLetter(c: string | null): boolean {
        if (typeof c !== "string") {
            return false;
        }

        const code = c.charCodeAt(0);

        return (
            (code >= A_CHAR_CODE && code <= Z_CHAR_CODE) ||
            (code >= UPPER_A_CHAR_CODE && code <= UPPER_Z_CHAR_CODE)
        );
    }

    /**
     * Return true if the current character is a valid digit.
     *
     * @returns True if valid number.
     */
    public isDigit(): boolean {
        return Scanner.isDigit(this.current);
    }

    /**
     * Return true if the character is a valid digit.
     *
     * @param c The character to test.
     * @returns True if valid number.
     */
    public static isDigit(c: string | null): boolean {
        if (typeof c !== "string") {
            return false;
        }

        const code = c.charCodeAt(0);
        return code >= ZERO_CHAR_CODE && code <= NINE_CHAR_CODE;
    }

    /**
     * Return true if the current character is considered white space.
     *
     * @returns True if white space.
     */
    public isWhiteSpace(): boolean {
        return Scanner.isWhiteSpace(this.current);
    }

    /**
     * Return true if the character is considered white space.
     *
     * @param c The character to test.
     * @returns True if white space.
     */
    public static isWhiteSpace(c: string | null): boolean {
        return c === " " || c === "\t" || c === "\r" || c === "\n";
    }

    /**
     * Return true if the current character is a valid hex character
     *
     * @returns True if this is a hex character.
     */
    public isHex(): boolean {
        return Scanner.isHex(this.current);
    }

    /**
     * Return true if the character is a valid hex character
     *
     * @param c The charcter to test.
     * @returns True if this is a hex character.
     */
    public static isHex(c: string | null): boolean {
        switch (c) {
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
            case "a":
            case "b":
            case "c":
            case "d":
            case "e":
            case "f":
            case "A":
            case "B":
            case "C":
            case "D":
            case "E":
            case "F":
                return true;
            default:
                return false;
        }
    }

    /**
     * Return true if the current character is a string and is upper case.
     *
     * @returns True if upper case.
     */
    public isUpperCase(): boolean {
        return Scanner.isUpperCase(this.current);
    }

    /**
     * Return true if the character is a string and is upper case.
     *
     * @param c The character to test.
     * @returns True if upper case.
     */
    public static isUpperCase(c: string | null): boolean {
        if (!c) {
            return false;
        }

        return c.toUpperCase() === c;
    }

    /**
     * Return true if the current character is a string and is lower case.
     *
     * @returns True if lower case.
     */
    public isLowerCase(): boolean {
        return Scanner.isLowerCase(this.current);
    }

    /**
     * Return true if the character is a string and is lower case.
     *
     * @param c The character to test.
     * @returns True if lower case.
     */
    public static isLowerCase(c: string | null): boolean {
        if (!c) {
            return false;
        }

        return c.toUpperCase() !== c;
    }
}
