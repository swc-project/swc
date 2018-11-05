var a = !b && (!// should not touch this one
    (!c || // should not touch this one
    (!c || d) && (!// should not touch this one
    (!c || d) &&
    (!e || // should not touch this one
    (!c || d) &&
    (!e || f) && // should not touch this one
    (!c || d) &&
    (!e || f) &&
    g();
