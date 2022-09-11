var a = !b && // should not touch this one
(!c || d) && (!e || f) && g();
