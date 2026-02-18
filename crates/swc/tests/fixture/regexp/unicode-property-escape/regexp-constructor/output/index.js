var re1 = RegExp("\\p{ID_Start}", "u");
var re2 = RegExp("\\P{Lowercase_Letter}", "u");
var re3 = new RegExp("abc", "g");
var re4 = RegExp(`\\p{ID_Start}`, "u");
var re5 = RegExp("\\p{ID_Start}", `u`);
var re6 = RegExp(`\\p{ID_Start}`);
var re7 = new RegExp(`\\p{ID_Start}${"x"}`, "u");
var re8 = RegExp("\\p{ID_Start}", "");
