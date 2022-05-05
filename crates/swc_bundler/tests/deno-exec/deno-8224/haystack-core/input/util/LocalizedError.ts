/*
 * Copyright (c) 2019, J2 Innovations. All Rights Reserved
 */

/**
 * An error that has some localized information attached to it.
 *
 * This error has extra meta data associated with the error that can be
 * translated into different locales.
 */
export class LocalizedError extends Error {
    readonly #lex: string;
    readonly #args?: Record<string, string | number>;
    readonly #index?: number;

    /**
     * Constructs a new parse error.
     *
     * @param options.message The error message hard coded in english.
     * @param options.lex The lexicon key used to translate the message.
     * @param options.args Optional arguments used when translating the lexicon key.
     * @param options.index Optional index number that may be used by any parsers to show position.
     */
    public constructor({
        message,
        lex,
        args,
        index,
    }: {
        message: string;
        lex: string;
        args?: Record<string, string | number>;
        index?: number;
    }) {
        super(message);
        this.#lex = lex;
        this.#args = args;
        this.#index = index;
    }

    /**
     * @returns The lexicon key associated with the error. If the looked up
     * lexicon key has '%s', these will be replaced by arguments from in `args`.
     */
    public get lex(): string {
        return this.#lex;
    }

    /**
     * @returns The arguments associated with the lexicon key to create a localized
     * error message.
     */
    public get args(): Record<string, string | number> {
        return this.#args ?? {};
    }

    /**
     * @returns The index number of the character from the input originally
     * associated with the error. Please note, this may return undefined if
     * no line number was originally associated with the error.
     */
    public get index(): number | undefined {
        return this.#index;
    }
}
