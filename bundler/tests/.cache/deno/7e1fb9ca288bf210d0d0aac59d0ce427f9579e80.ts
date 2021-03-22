// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/input.ts


import { GenericPrompt } from "./_generic_prompt.ts";
import {
  GenericSuggestions,
  GenericSuggestionsKeys,
  GenericSuggestionsOptions,
  GenericSuggestionsSettings,
} from "./_generic_suggestions.ts";
import { blue } from "./deps.ts";
import { Figures } from "./figures.ts";

export type InputKeys = GenericSuggestionsKeys;

/** Input prompt options. */
export interface InputOptions
  extends GenericSuggestionsOptions<string, string> {
  minLength?: number;
  maxLength?: number;
  keys?: InputKeys;
}

/** Input prompt settings. */
interface InputSettings extends GenericSuggestionsSettings<string, string> {
  minLength: number;
  maxLength: number;
  keys?: InputKeys;
}

/** Input prompt representation. */
export class Input extends GenericSuggestions<string, string, InputSettings> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(options: string | InputOptions): Promise<string> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      indent: " ",
      listPointer: blue(Figures.POINTER),
      maxRows: 8,
      minLength: 0,
      maxLength: Infinity,
      ...options,
    }).prompt();
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  /** Get input input. */
  protected getValue(): string {
    return this.inputValue;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    if (typeof value !== "string") {
      return false;
    }
    if (value.length < this.settings.minLength) {
      return `Value must be longer then ${this.settings.minLength} but has a length of ${value.length}.`;
    }
    if (value.length > this.settings.maxLength) {
      return `Value can't be longer then ${this.settings.maxLength} but has a length of ${value.length}.`;
    }
    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string | undefined {
    return value.trim();
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string): string {
    return value;
  }
}
