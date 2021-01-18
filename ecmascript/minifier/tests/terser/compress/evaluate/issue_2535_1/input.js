if (x() || true || y()) z();
if ((x() || true) && y()) z();
if ((x() && true) || y()) z();
if (x() && true && y()) z();
if (x() || false || y()) z();
if ((x() || false) && y()) z();
if ((x() && false) || y()) z();
if (x() && false && y()) z();
