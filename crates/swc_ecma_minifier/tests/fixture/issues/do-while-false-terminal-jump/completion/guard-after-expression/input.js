var value;
value = 1;
do {
    value = 2;
    if ((value = 3) < 0) throw "stop";
    continue;
} while (false);
