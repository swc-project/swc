// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/number.ts


import type { KeyEvent } from "../keycode/key_event.ts";
import { GenericPrompt } from "./_generic_prompt.ts";
import {
  GenericSuggestions,
  GenericSuggestionsKeys,
  GenericSuggestionsOptions,
  GenericSuggestionsSettings,
} from "./_generic_suggestions.ts";
import { parseNumber } from "./_utils.ts";
import { blue } from "./deps.ts";
import { Figures } from "./figures.ts";

/** Number key options. */
export interface NumberKeys extends GenericSuggestionsKeys {
  increaseValue?: string[];
  decreaseValue?: string[];
}

/** Number prompt options. */
export interface NumberOptions
  extends GenericSuggestionsOptions<number, string> {
  min?: number;
  max?: number;
  float?: boolean;
  round?: number;
  keys?: NumberKeys;
}

/** Number prompt settings. */
interface NumberSettings extends GenericSuggestionsSettings<number, string> {
  min: number;
  max: number;
  float: boolean;
  round: number;
  keys?: NumberKeys;
}

/** Number prompt representation. */
export class Number extends GenericSuggestions<number, string, NumberSettings> {
  /** Execute the prompt and show cursor on end. */
  public static prompt(options: string | NumberOptions): Promise<number> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      indent: " ",
      listPointer: blue(Figures.POINTER),
      maxRows: 8,
      min: -Infinity,
      max: Infinity,
      float: false,
      round: 2,
      ...options,
      keys: {
        increaseValue: ["up", "u", "+"],
        decreaseValue: ["down", "d", "-"],
        ...(options.keys ?? {}),
      },
    }).prompt();
  }

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case this.settings.suggestions &&
        this.isKey(this.settings.keys, "next", event):
        if (this.settings.list) {
          this.selectPreviousSuggestion();
        } else {
          this.selectNextSuggestion();
        }
        break;
      case this.settings.suggestions &&
        this.isKey(this.settings.keys, "previous", event):
        if (this.settings.list) {
          this.selectNextSuggestion();
        } else {
          this.selectPreviousSuggestion();
        }
        break;
      case this.isKey(this.settings.keys, "increaseValue", event):
        this.increaseValue();
        break;
      case this.isKey(this.settings.keys, "decreaseValue", event):
        this.decreaseValue();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  /** Increase input number. */
  public increaseValue() {
    this.manipulateIndex(false);
  }

  /** Decrease input number. */
  public decreaseValue() {
    this.manipulateIndex(true);
  }

  /** Decrease/increase input number. */
  protected manipulateIndex(decrease?: boolean) {
    if (this.inputValue[this.inputIndex] === "-") {
      this.inputIndex++;
    }

    if (
      this.inputValue.length && (this.inputIndex > this.inputValue.length - 1)
    ) {
      this.inputIndex--;
    }

    const decimalIndex: number = this.inputValue.indexOf(".");
    const [abs, dec] = this.inputValue.split(".");

    if (dec && this.inputIndex === decimalIndex) {
      this.inputIndex--;
    }

    const inDecimal: boolean = decimalIndex !== -1 &&
      this.inputIndex > decimalIndex;
    let value: string = (inDecimal ? dec : abs) || "0";
    const oldLength: number = this.inputValue.length;
    const index: number = inDecimal
      ? this.inputIndex - decimalIndex - 1
      : this.inputIndex;
    const increaseValue = Math.pow(10, value.length - index - 1);

    value = (parseInt(value) + (decrease ? -increaseValue : increaseValue))
      .toString();

    this.inputValue = !dec
      ? value
      : (this.inputIndex > decimalIndex ? abs + "." + value
      : value + "." + dec);

    if (this.inputValue.length > oldLength) {
      this.inputIndex++;
    } else if (
      this.inputValue.length < oldLength &&
      this.inputValue[this.inputIndex - 1] !== "-"
    ) {
      this.inputIndex--;
    }

    this.inputIndex = Math.max(
      0,
      Math.min(this.inputIndex, this.inputValue.length - 1),
    );
  }

  /**
   * Add char to input.
   * @param char Char.
   */
  protected addChar(char: string): void {
    if (isNumeric(char)) {
      super.addChar(char);
    } else if (
      this.settings.float &&
      char === "." &&
      this.inputValue.indexOf(".") === -1 &&
      (this.inputValue[0] === "-" ? this.inputIndex > 1 : this.inputIndex > 0)
    ) {
      super.addChar(char);
    }
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    if (!isNumeric(value)) {
      return false;
    }

    const val: number = parseFloat(value);

    if (val > this.settings.max) {
      return `Value must be lower or equal than ${this.settings.max}`;
    }

    if (val < this.settings.min) {
      return `Value must be greater or equal than ${this.settings.min}`;
    }

    return true;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): number | undefined {
    const val: number = parseFloat(value);

    if (this.settings.float) {
      return parseFloat(val.toFixed(this.settings.round));
    }

    return val;
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: number): string {
    return value.toString();
  }

  /** Get input input. */
  protected getValue(): string {
    return this.inputValue;
  }
}

function isNumeric(value: string | number): value is (number | string) {
  return typeof value === "number" || (!!value && !isNaN(parseNumber(value)));
}
