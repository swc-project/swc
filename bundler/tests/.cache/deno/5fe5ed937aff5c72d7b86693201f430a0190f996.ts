// Loaded from https://deno.land/x/cliffy@v0.18.0/prompt/select.ts


import { blue, underline } from "./deps.ts";
import { Figures } from "./figures.ts";
import {
  GenericList,
  GenericListKeys,
  GenericListOption,
  GenericListOptions,
  GenericListOptionSettings,
  GenericListSettings,
} from "./_generic_list.ts";
import { GenericPrompt } from "./_generic_prompt.ts";

/** Select key options. */
export type SelectKeys = GenericListKeys;

/** Select option options. */
export type SelectOption = GenericListOption;

/** Select option settings. */
export type SelectOptionSettings = GenericListOptionSettings;

/** Select options type. */
export type SelectValueOptions = (string | SelectOption)[];
/** Select option settings type. */
export type SelectValueSettings = SelectOptionSettings[];

/** Select prompt options. */
export interface SelectOptions extends GenericListOptions<string, string> {
  options: SelectValueOptions;
  keys?: SelectKeys;
}

/** Select prompt settings. */
export interface SelectSettings extends GenericListSettings<string, string> {
  options: SelectValueSettings;
  keys?: SelectKeys;
}

/** Select prompt representation. */
export class Select<S extends SelectSettings = SelectSettings>
  extends GenericList<string, string, S> {
  protected listIndex: number = this.getListIndex(this.settings.default);

  /**
   * Inject prompt value. Can be used for unit tests or pre selections.
   * @param value Input value.
   */
  public static inject(value: string): void {
    GenericPrompt.inject(value);
  }

  /** Execute the prompt and show cursor on end. */
  public static prompt(options: SelectOptions): Promise<string> {
    return new this({
      pointer: blue(Figures.POINTER_SMALL),
      indent: " ",
      listPointer: blue(Figures.POINTER),
      maxRows: 10,
      searchLabel: blue(Figures.SEARCH),
      ...options,
      options: Select.mapOptions(options),
    }).prompt();
  }

  protected static mapOptions(options: SelectOptions): SelectValueSettings {
    return options.options
      .map((item: string | SelectOption) =>
        typeof item === "string" ? { value: item } : item
      )
      .map((item) => this.mapOption(item));
  }

  protected input(): string {
    return underline(blue(this.inputValue));
  }

  /**
   * Render select option.
   * @param item        Select option settings.
   * @param isSelected  Set to true if option is selected.
   */
  protected getListItem(
    item: SelectOptionSettings,
    isSelected?: boolean,
  ): string {
    let line = this.settings.indent;
    line += isSelected ? `${this.settings.listPointer} ` : "  ";
    line += `${
      isSelected
        ? this.highlight(item.name, (val) => val)
        : this.highlight(item.name)
    }`;
    return line;
  }

  /** Get value of selected option. */
  protected getValue(): string {
    return this.options[this.listIndex]?.value ?? this.settings.default;
  }

  /**
   * Validate input value.
   * @param value User input value.
   * @return True on success, false or error message on error.
   */
  protected validate(value: string): boolean | string {
    return typeof value === "string" &&
      value.length > 0 &&
      this.options.findIndex((option: SelectOptionSettings) =>
          option.value === value
        ) !== -1;
  }

  /**
   * Map input value to output value.
   * @param value Input value.
   * @return Output value.
   */
  protected transform(value: string): string {
    return value.trim();
  }

  /**
   * Format output value.
   * @param value Output value.
   */
  protected format(value: string): string {
    return this.getOptionByValue(value)?.name ?? value;
  }
}
