// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/confirm.ts


import { GenericPrompt } from "./_generic_prompt.ts";
import {
  GenericSuggestions,
  GenericSuggestionsKeys,
  GenericSuggestionsOptions,
  GenericSuggestionsSettings,
} from "./_generic_suggestions.ts";
import { blue, dim } from "./deps.ts";
import { Figures } from "./figures.ts";

export type ConfirmKeys = GenericSuggestionsKeys;

type UnsupportedInputOptions = "suggestions" | "list" | "info";

/** Confirm prompt options. */
export interface ConfirmOptions
  extends
    Omit<GenericSuggestionsOptions<boolean, string>, UnsupportedInputOptions> {
  active?: string;
  inactive?: string;
  keys?: ConfirmKeys;
}

/** Confirm prompt settings. */
interface ConfirmSettings extends GenericSuggestionsSettings<boolean, string> {
  active: string;
  inactive: string;
  keys?: ConfirmKeys;
}

/** Confirm prompt representation. */
export class Confirm
  extends GenericSuggestions<boolean, string, ConfirmSettings> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(
    options: string | ConfirmOptions,
  ): Promise<boolean> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      indent: " ",
      listPointer: blue(Figures.POINTER),
      maxRows: 8,
      active: "Yes",
      inactive: "No",
      ...options,
      suggestions: [
        options.active ?? "Yes",
        options.inactive ?? "No",
      ],
      list: false,
      info: false,
    }).prompt();
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  protected defaults(): string {
    let defaultMessage = "";

    if (this.settings.default === true) {
      defaultMessage += this.settings.active[0].toUpperCase() + "/" +
        this.settings.inactive[0].toLowerCase();
    } else if (this.settings.default === false) {
      defaultMessage += this.settings.active[0].toLowerCase() + "/" +
        this.settings.inactive[0].toUpperCase();
    } else {
      defaultMessage += this.settings.active[0].toLowerCase() + "/" +
        this.settings.inactive[0].toLowerCase();
    }

    return defaultMessage ? dim(` (${defaultMessage})`) : "";
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
    return typeof value === "string" &&
      [
          this.settings.active[0].toLowerCase(),
          this.settings.active.toLowerCase(),
          this.settings.inactive[0].toLowerCase(),
          this.settings.inactive.toLowerCase(),
        ].indexOf(value.toLowerCase()) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): boolean | undefined {
    switch (value.toLowerCase()) {
      case this.settings.active[0].toLowerCase():
      case this.settings.active.toLowerCase():
        return true;
      case this.settings.inactive[0].toLowerCase():
      case this.settings.inactive.toLowerCase():
        return false;
    }
    return;
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: boolean): string {
    return value ? this.settings.active : this.settings.inactive;
  }
}
