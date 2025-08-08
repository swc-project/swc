const A = {
	get state(): number {
		return 0;
	},
};

const B = {
	set state(v: string) {
		// do something
	},
};

const C = {
	get state(): number {
		return 0;
	},
	set state(v: number) {
		// do something
	},
};

const D = {
	get state(): number {
		return 0;
	},
	set state(v: string) {
		// do something
	},
};

const E = {
	get state() {
		return A;
	},
	set state(v) {
		// do something
	},
};

const ObjectMethods = {
	a() {
		return 0;
	},
	b(): number {},
	c() {},
};

const ObjectKeys = {
	a: 0,
	["b"]: 1,
	[`c`]: 2,
	[3]: 3,
	[-3]: 4,
	[4n]: 5,
};

type family =
  '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif'
const family: family =
  '-apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif'
const theme = {
  'font-family': family as family
} as const

const X = {
  'async': 1,
  'await': 2,
}

const Y = {
  0: 0,
  [1]: 1,
  ["2"]: 2,
  set 3(v: number) {},
  set [4](v: number) {},
  set ["5"](v: number) {},
};


const exoticKeys = {
  // --- WORKING KEYS ---
  "a": "latin",                          // latin
  "é": "latin-1 supplement",             // latin-1 supplement
  "ø": "extended latin",                 // extended latin
  "Ж": "cyrillic",                       // cyrillic
  "你": "chinese",                        // chinese
  "あ": "japanese",                       // japanese
  "한": "korean",                         // korean
  "a\u0301": "zalgo/combining",          // zalgo (a + combining acute accent)

  // --- NON-WORKING KEYS ---
  "😃": "emoji",                         // emoji
  "👍🏻": "emoji with skin tone",          // emoji + skin tone
  "👨‍👩‍👧‍👦": "emoji sequence",                // emoji sequence (family)
  "±": "math symbol",                    // math symbol
  "€": "currency",                       // currency
  "“": "curly quote",                    // curly quote
  "\u0000": "null byte",                 // null byte (not expected to work)
  "\\": "backslash",                     // backslash (unique error)
};
