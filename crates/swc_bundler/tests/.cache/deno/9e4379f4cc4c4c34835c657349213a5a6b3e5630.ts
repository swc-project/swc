// Loaded from https://deno.land/x/cliffy@v0.18.0/keycode/key_event.ts


/** KeyEvent options. */
export interface IKey {
  name?: string;
  sequence?: string;
  ctrl: boolean;
  meta: boolean;
  shift: boolean;
}

/** KeyEvent representation. */
export class KeyEvent {
  protected constructor(
    public readonly name: string | undefined,
    public readonly sequence: string | undefined,
    public readonly ctrl = false,
    public readonly meta = false,
    public readonly shift = false,
  ) {}

  /**
   * Create new KeyEvent.
   * @param key KeyEvent options.
   */
  public static from(key: IKey): KeyEvent {
    return new this(
      key.name,
      key.sequence,
      key.ctrl,
      key.meta,
      key.shift,
    );
  }
}
