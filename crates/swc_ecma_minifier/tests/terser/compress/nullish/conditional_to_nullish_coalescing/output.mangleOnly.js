const a = id("something");
leak(a == null ? bar : a);
