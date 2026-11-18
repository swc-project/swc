class LeadingOnly {
  constructor() {
    /* 1.1 Leading */ super();
  }
}

class TrailingOnly {
  constructor() {
    super /* 2.1 Trailing */
      ();
  }
}

class LeadingAndTrailing {
  constructor() {
    /* 3.1 Leading */ super /* 3.2 Trailing */
      ();
  }
}
