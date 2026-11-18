import { foo } from "foo";
import bar from "bar";
import * as baz from "baz";

foo = 1;
bar = 2;
baz = 3;

foo++;
foo--;

++bar;
--bar;


foo += 10;
bar -= 10;
baz *= 10;
foo /= 10;
bar %= 10;

baz <<= 10;
foo >>= 10;

bar >>>= 10;

baz |= 10;
foo ^= 10;
bar &= 10;
baz **= 10;

foo &&= 10;
bar ||= 10;

baz ??= 10;
