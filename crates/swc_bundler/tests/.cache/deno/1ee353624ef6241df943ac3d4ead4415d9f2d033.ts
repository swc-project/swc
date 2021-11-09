// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/_generic_input.ts


import type { KeyEvent } from "../keycode/key_event.ts";
import {
  GenericPrompt,
  GenericPromptKeys,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";
import { blue, dim, stripColor, underline } from "./deps.ts";

/** Input keys options. */
export interface GenericInputKeys extends GenericPromptKeys {
  moveCursorLeft?: string[];
  moveCursorRight?: string[];
  deleteCharLeft?: string[];
  deleteCharRight?: string[];
}

/** Generic input prompt options. */
export interface GenericInputPromptOptions<T, V>
  extends GenericPromptOptions<T, V> {
  keys?: GenericInputKeys;
}

/** Generic input prompt settings. */
export interface GenericInputPromptSettings<T, V>
  extends GenericPromptSettings<T, V> {
  keys?: GenericInputKeys;
}

/** Generic input prompt representation. */
export abstract class GenericInput<
  T,
  V,
  S extends GenericInputPromptSettings<T, V>,
> extends GenericPrompt<T, V, S> {
  protected inputValue = "";
  protected inputIndex = 0;

  /**
   * Prompt constructor.
   * @param settings Prompt settings.
   */
  protected constructor(settings: S) {
    super({
      ...settings,
      keys: {
        moveCursorLeft: ["left"],
        moveCursorRight: ["right"],
        deleteCharLeft: ["backspace"],
        deleteCharRight: ["delete"],
        ...(settings.keys ?? {}),
      },
    });
  }

  protected getCurrentInputValue(): string {
    return this.inputValue;
  }

  protected message(): string {
    const message: string = super.message() + " " + this.settings.pointer + " ";
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  protected input(): string {
    return underline(this.inputValue);
  }

  protected highlight(
    value: string | number,
    color1: (val: string) => string = dim,
    color2: (val: string) => string = blue,
  ): string {
    value = value.toString();
    const inputLowerCase = this.getCurrentInputValue().toLowerCase();
    const valueLowerCase = value.toLowerCase();
    const index = valueLowerCase.indexOf(inputLowerCase);
    const matched: string = value.slice(index, index + inputLowerCase.length);
    return index >= 0
      ? color1(value.slice(0, index)) + color2(matched) +
        color1(value.slice(index + inputLowerCase.length))
      : value;
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case event.name === "c" && event.ctrl:
        this.clear();
        this.tty.cursorShow();
        Deno.exit(0);
        return;
      case this.isKey(this.settings.keys, "moveCursorLeft", event):
        this.moveCursorLeft();
        break;
      case this.isKey(this.settings.keys, "moveCursorRight", event):
        this.moveCursorRight();
        break;
      case this.isKey(this.settings.keys, "deleteCharRight", event):
        this.deleteCharRight();
        break;
      case this.isKey(this.settings.keys, "deleteCharLeft", event):
        this.deleteChar();
        break;
      case this.isKey(this.settings.keys, "submit", event):
        await this.submit();
        break;
      default:
        if (event.sequence && !event.meta && !event.ctrl) {
          this.addChar(event.sequence);
        }
    }
  }

  /** Add character to current input. */
  protected addChar(char: string): void {
    this.inputValue = this.inputValue.slice(0, this.inputIndex) + char +
      this.inputValue.slice(this.inputIndex);
    this.inputIndex++;
  }

  /** Move prompt cursor left. */
  protected moveCursorLeft(): void {
    if (this.inputIndex > 0) {
      this.inputIndex--;
    }
  }

  /** Move prompt cursor right. */
  protected moveCursorRight(): void {
    if (this.inputIndex < this.inputValue.length) {
      this.inputIndex++;
    }
  }

  /** Delete char left. */
  protected deleteChar(): void {
    if (this.inputIndex > 0) {
      this.inputIndex--;
      this.deleteCharRight();
    }
  }

  /** Delete char right. */
  protected deleteCharRight(): void {
    if (this.inputIndex < this.inputValue.length) {
      this.inputValue = this.inputValue.slice(0, this.inputIndex) +
        this.inputValue.slice(this.inputIndex + 1);
    }
  }
}
