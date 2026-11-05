var value, checked;
value = 1;
do {
    if ((checked = 2) < 0) throw "stop";
    value = checked + 1;
    break;
} while (false);
