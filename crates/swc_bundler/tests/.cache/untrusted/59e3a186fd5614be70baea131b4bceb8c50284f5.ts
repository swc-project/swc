// Loaded from https://raw.githubusercontent.com/deno-postgres/deno-postgres/master/query/array_parser.ts


// Based of https://github.com/bendrucker/postgres-array
// Copyright (c) Ben Drucker <bvdrucker@gmail.com> (bendrucker.me). MIT License.

/** Incorrectly parsed data types default to null */
type ArrayResult<T> = Array<T | null | ArrayResult<T>>;
type Transformer<T> = (value: string) => T;

function defaultValue(value: string): string {
  return value;
}

export function parseArray(source: string): ArrayResult<string>;
export function parseArray<T>(
  source: string,
  transform: Transformer<T>,
): ArrayResult<T>;
export function parseArray(source: string, transform = defaultValue) {
  return new ArrayParser(source, transform).parse();
}

class ArrayParser<T> {
  position = 0;
  entries: ArrayResult<T> = [];
  recorded: string[] = [];
  dimension = 0;

  constructor(
    public source: string,
    public transform: Transformer<T>,
  ) {}

  isEof(): boolean {
    return this.position >= this.source.length;
  }

  nextCharacter() {
    const character = this.source[this.position++];
    if (character === "\\") {
      return {
        value: this.source[this.position++],
        escaped: true,
      };
    }
    return {
      value: character,
      escaped: false,
    };
  }

  record(character: string): void {
    this.recorded.push(character);
  }

  newEntry(includeEmpty = false): void {
    let entry;
    if (this.recorded.length > 0 || includeEmpty) {
      entry = this.recorded.join("");
      if (entry === "NULL" && !includeEmpty) {
        entry = null;
      }
      if (entry !== null) entry = this.transform(entry);
      this.entries.push(entry);
      this.recorded = [];
    }
  }

  consumeDimensions(): void {
    if (this.source[0] === "[") {
      while (!this.isEof()) {
        const char = this.nextCharacter();
        if (char.value === "=") break;
      }
    }
  }

  /**
   * Arrays can contain items separated by semicolon (such as boxes)
   * and commas
   * 
   * This checks if there is an instance of a semicolon on the top level
   * of the array. If it were to be found, the separator will be
   * a semicolon, otherwise it will default to a comma
   */
  getSeparator() {
    if (/;(?![^(]*\))/.test(this.source.substr(1, this.source.length - 1))) {
      return ";";
    }
    return ",";
  }

  parse(nested = false): ArrayResult<T> {
    const separator = this.getSeparator();
    let character, parser, quote;
    this.consumeDimensions();
    while (!this.isEof()) {
      character = this.nextCharacter();
      if (character.value === "{" && !quote) {
        this.dimension++;
        if (this.dimension > 1) {
          parser = new ArrayParser(
            this.source.substr(this.position - 1),
            this.transform,
          );
          this.entries.push(parser.parse(true));
          this.position += parser.position - 2;
        }
      } else if (character.value === "}" && !quote) {
        this.dimension--;
        if (!this.dimension) {
          this.newEntry();
          if (nested) return this.entries;
        }
      } else if (character.value === '"' && !character.escaped) {
        if (quote) this.newEntry(true);
        quote = !quote;
      } else if (character.value === separator && !quote) {
        this.newEntry();
      } else {
        this.record(character.value);
      }
    }
    if (this.dimension !== 0) {
      throw new Error("array dimension not balanced");
    }
    return this.entries;
  }
}
