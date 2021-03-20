// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/toggle.ts


import type { KeyEvent } from "../keycode/key_event.ts";
import { blue, dim, underline } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericPrompt,
  GenericPromptKeys,
  GenericPromptOptions,
  GenericPromptSettings,
} from "./_generic_prompt.ts";

/** Toggle key options. */
export interface ToggleKeys extends GenericPromptKeys {
  active?: string[];
  inactive?: string[];
}

/** Generic prompt options. */
export interface ToggleOptions extends GenericPromptOptions<boolean, string> {
  active?: string;
  inactive?: string;
  keys?: ToggleKeys;
}

/** Toggle prompt settings. */
interface ToggleSettings extends GenericPromptSettings<boolean, string> {
  active: string;
  inactive: string;
  keys: ToggleKeys;
}

/** Toggle prompt representation. */
export class Toggle extends GenericPrompt<boolean, string, ToggleSettings> {
  protected status: string = typeof this.settings.default !== "undefined"
    ? this.format(this.settings.default)
    : "";

  /** Execute the prompt and show cursor on end. */
  public static prompt(
    options: string | ToggleOptions,
  ): Promise<boolean> {
    if (typeof options === "string") {
      options = { message: options };
    }

    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      indent: " ",
      active: "Yes",
      inactive: "No",
      ...options,
      keys: {
        active: ["right", "y", "j", "s", "o"],
        inactive: ["left", "n"],
        ...(options.keys ?? {}),
      },
    }).prompt();
  }

  protected message(): string {
    let message = super.message() + " " + this.settings.pointer + " ";

    if (this.status === this.settings.active) {
      message += dim(this.settings.inactive + " / ") +
        underline(this.settings.active);
    } else if (this.status === this.settings.inactive) {
      message += underline(this.settings.inactive) +
        dim(" / " + this.settings.active);
    } else {
      message += dim(this.settings.inactive + " / " + this.settings.active);
    }

    return message;
  }

  /** Read user input from stdin, handle events and validate user input. */
  protected read(): Promise<boolean> {
    this.tty.cursorHide();
    return super.read();
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case event.sequence === this.settings.inactive[0].toLowerCase():
      case this.isKey(this.settings.keys, "inactive", event):
        this.selectInactive();
        break;
      case event.sequence === this.settings.active[0].toLowerCase():
      case this.isKey(this.settings.keys, "active", event):
        this.selectActive();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  /** Set active. */
  protected selectActive() {
    this.status = this.settings.active;
  }

  /** Set inactive. */
  protected selectInactive() {
    this.status = this.settings.inactive;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return [this.settings.active, this.settings.inactive].indexOf(value) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): boolean | undefined {
    switch (value) {
      case this.settings.active:
        return true;
      case this.settings.inactive:
        return false;
    }
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: boolean): string {
    return value ? this.settings.active : this.settings.inactive;
  }

  /** Get input value. */
  protected getValue(): string {
    return this.status;
  }
}
