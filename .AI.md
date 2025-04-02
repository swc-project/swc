1. Write performant code. Always prefer performance over other things.
2. Write comments in English.
3. Do not use unstable, nightly only features.
4. When creating Atom instances, it's better to use Cow<str> or &str instead of String. Note that `&str` is better than `Cow<str>` here.
5. Write unit tests for your code.
6. When instructed to fix tests, do not remove or modify existing tests.
7. Write documentation for your code. The documentation should be written in English.
8. If you are not sure about something, ask me.
9. Read the file again if you are modifying it for the second time.
10. If you are adding to the end of the file repeatedly, check the file length each time you write to place the new code in the correct place.
