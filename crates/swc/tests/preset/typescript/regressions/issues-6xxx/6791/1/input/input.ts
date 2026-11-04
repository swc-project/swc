import { test } from "test";

enum Test {
    "Hello" = "World!",
}

test(Test["Hello"])
