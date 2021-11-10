// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/_generic_list.ts


import type { KeyEvent } from "../keycode/key_event.ts";
import {
  GenericInput,
  GenericInputKeys,
  GenericInputPromptOptions,
  GenericInputPromptSettings,
} from "./_generic_input.ts";
import { blue, bold, dim, stripColor, yellow } from "./deps.ts";
import { Figures } from "./figures.ts";
import { distance } from "../_utils/distance.ts";

/** Select key options. */
export interface GenericListKeys extends GenericInputKeys {
  previous?: string[];
  next?: string[];
  previousPage?: string[];
  nextPage?: string[];
}

/** Generic list option options. */
export interface GenericListOption {
  value: string;
  name?: string;
  disabled?: boolean;
}

/** Generic list option settings. */
export interface GenericListOptionSettings extends GenericListOption {
  name: string;
  value: string;
  disabled: boolean;
}

export type GenericListValueOptions = (string | GenericListOption)[];
export type GenericListValueSettings = GenericListOptionSettings[];

type UnsupportedInputOptions = "suggestions" | "list";

/** Generic list prompt options. */
export interface GenericListOptions<T, V>
  extends Omit<GenericInputPromptOptions<T, V>, UnsupportedInputOptions> {
  options: GenericListValueOptions;
  keys?: GenericListKeys;
  indent?: string;
  listPointer?: string;
  searchIcon?: string;
  maxRows?: number;
  searchLabel?: string;
  search?: boolean;
  info?: boolean;
}

/** Generic list prompt settings. */
export interface GenericListSettings<T, V>
  extends GenericInputPromptSettings<T, V> {
  options: GenericListValueSettings;
  keys?: GenericListKeys;
  indent: string;
  listPointer: string;
  maxRows: number;
  searchLabel: string;
  search?: boolean;
  info?: boolean;
}

/** Generic list prompt representation. */
export abstract class GenericList<T, V, S extends GenericListSettings<T, V>>
  extends GenericInput<T, V, S> {
  protected options: S["options"] = this.settings.options;
  protected listIndex: number = this.getListIndex();
  protected listOffset: number = this.getPageOffset(this.listIndex);

  /**
   * Create list separator.
   * @param label Separator label.
   */
  public static separator(label = "------------"): GenericListOption {
    return { value: label, disabled: true };
  }

  /**
   * Set list option defaults.
   * @param option List option.
   */
  protected static mapOption(
    option: GenericListOption,
  ): GenericListOptionSettings {
    return {
      value: option.value,
      name: typeof option.name === "undefined" ? option.value : option.name,
      disabled: !!option.disabled,
    };
  }

  constructor(settings: S) {
    super({
      ...settings,
      keys: {
        previous: settings.search ? ["up"] : ["up", "u", "8"],
        next: settings.search ? ["down"] : ["down", "d", "2"],
        previousPage: ["pageup"],
        nextPage: ["pagedown"],
        ...(settings.keys ?? {}),
      },
    });
  }

  protected match(): void {
    const input: string = this.getCurrentInputValue().toLowerCase();
    if (!input.length) {
      this.options = this.settings.options.slice();
    } else {
      this.options = this.settings.options
        .filter((option: GenericListOptionSettings) =>
          match(option.name) ||
          (option.name !== option.value && match(option.value))
        )
        .sort((a: GenericListOptionSettings, b: GenericListOptionSettings) =>
          distance(a.name, input) - distance(b.name, input)
        );
    }
    this.listIndex = Math.max(
      0,
      Math.min(this.options.length - 1, this.listIndex),
    );
    this.listOffset = Math.max(
      0,
      Math.min(
        this.options.length - this.getListHeight(),
        this.listOffset,
      ),
    );

    function match(value: string): boolean {
      return stripColor(value)
        .toLowerCase()
        .includes(input);
    }
  }

  protected message(): string {
    let message = `${this.settings.indent}${yellow("?")} ` +
      bold(this.settings.message) +
      this.defaults();
    if (this.settings.search) {
      message += " " + this.settings.searchLabel + " ";
    }
    this.cursor.x = stripColor(message).length + this.inputIndex + 1;
    return message + this.input();
  }

  /** Render options. */
  protected body(): string | Promise<string> {
    return this.getList() + this.getInfo();
  }

  protected getInfo(): string {
    if (!this.settings.info) {
      return "";
    }
    const selected: number = this.listIndex + 1;
    const actions: Array<[string, Array<string>]> = [
      ["Next", [Figures.ARROW_DOWN]],
      ["Previous", [Figures.ARROW_UP]],
      ["Next Page", [Figures.PAGE_DOWN]],
      ["Previous Page", [Figures.PAGE_UP]],
      ["Submit", [Figures.ENTER]],
    ];

    return "\n" + this.settings.indent + blue(Figures.INFO) +
      bold(` ${selected}/${this.options.length} `) +
      actions
        .map((cur) => `${cur[0]}: ${bold(cur[1].join(" "))}`)
        .join(", ");
  }

  /** Render options list. */
  protected getList(): string {
    const list: Array<string> = [];
    const height: number = this.getListHeight();
    for (let i = this.listOffset; i < this.listOffset + height; i++) {
      list.push(
        this.getListItem(
          this.options[i],
          this.listIndex === i,
        ),
      );
    }
    if (!list.length) {
      list.push(
        this.settings.indent + dim("  No matches..."),
      );
    }
    return list.join("\n");
  }

  /**
   * Render option.
   * @param item        Option.
   * @param isSelected  Set to true if option is selected.
   */
  protected abstract getListItem(
    item: GenericListOptionSettings,
    isSelected?: boolean,
  ): string;

  /** Get options row height. */
  protected getListHeight(): number {
    return Math.min(
      this.options.length,
      this.settings.maxRows || this.options.length,
    );
  }

  protected getListIndex(value?: string) {
    return typeof value === "undefined"
      ? this.options.findIndex((item: GenericListOptionSettings) =>
        !item.disabled
      ) || 0
      : this.options.findIndex((item: GenericListOptionSettings) =>
        item.value === value
      ) || 0;
  }

  protected getPageOffset(index: number) {
    if (index === 0) {
      return 0;
    }
    const height: number = this.getListHeight();
    return Math.floor(index / height) * height;
  }

  /**
   * Find option by value.
   * @param value Value of the option.
   */
  protected getOptionByValue(
    value: string,
  ): GenericListOptionSettings | undefined {
    return this.options.find((option) => option.value === value);
  }

  /** Read user input. */
  protected read(): Promise<boolean> {
    if (!this.settings.search) {
      this.tty.cursorHide();
    }
    return super.read();
  }

  /**
   * Handle user input event.
   * @param event Key event.
   */
  protected async handleEvent(event: KeyEvent): Promise<void> {
    switch (true) {
      case this.isKey(this.settings.keys, "previous", event):
        this.selectPrevious();
        break;
      case this.isKey(this.settings.keys, "next", event):
        this.selectNext();
        break;
      case this.isKey(this.settings.keys, "nextPage", event):
        this.selectNextPage();
        break;
      case this.isKey(this.settings.keys, "previousPage", event):
        this.selectPreviousPage();
        break;
      default:
        await super.handleEvent(event);
    }
  }

  protected moveCursorLeft(): void {
    if (this.settings.search) {
      super.moveCursorLeft();
    }
  }

  protected moveCursorRight(): void {
    if (this.settings.search) {
      super.moveCursorRight();
    }
  }

  protected deleteChar(): void {
    if (this.settings.search) {
      super.deleteChar();
    }
  }

  protected deleteCharRight(): void {
    if (this.settings.search) {
      super.deleteCharRight();
      this.match();
    }
  }

  protected addChar(char: string): void {
    if (this.settings.search) {
      super.addChar(char);
      this.match();
    }
  }

  /** Select previous option. */
  protected selectPrevious(): void {
    if (this.options.length < 2) {
      return;
    }
    if (this.listIndex > 0) {
      this.listIndex--;
      if (this.listIndex < this.listOffset) {
        this.listOffset--;
      }
      if (this.options[this.listIndex].disabled) {
        this.selectPrevious();
      }
    } else {
      this.listIndex = this.options.length - 1;
      this.listOffset = this.options.length - this.getListHeight();
      if (this.options[this.listIndex].disabled) {
        this.selectPrevious();
      }
    }
  }

  /** Select next option. */
  protected selectNext(): void {
    if (this.options.length < 2) {
      return;
    }
    if (this.listIndex < this.options.length - 1) {
      this.listIndex++;
      if (this.listIndex >= this.listOffset + this.getListHeight()) {
        this.listOffset++;
      }
      if (this.options[this.listIndex].disabled) {
        this.selectNext();
      }
    } else {
      this.listIndex = this.listOffset = 0;
      if (this.options[this.listIndex].disabled) {
        this.selectNext();
      }
    }
  }

  /** Select previous page. */
  protected selectPreviousPage(): void {
    if (this.options?.length) {
      const height: number = this.getListHeight();
      if (this.listOffset >= height) {
        this.listIndex -= height;
        this.listOffset -= height;
      } else if (this.listOffset > 0) {
        this.listIndex -= this.listOffset;
        this.listOffset = 0;
      }
    }
  }

  /** Select next page. */
  protected selectNextPage(): void {
    if (this.options?.length) {
      const height: number = this.getListHeight();
      if (this.listOffset + height + height < this.options.length) {
        this.listIndex += height;
        this.listOffset += height;
      } else if (this.listOffset + height < this.options.length) {
        const offset = this.options.length - height;
        this.listIndex += offset - this.listOffset;
        this.listOffset = offset;
      }
    }
  }
}
