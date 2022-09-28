const l = id("something");
leak(l == null ? bar : l);
