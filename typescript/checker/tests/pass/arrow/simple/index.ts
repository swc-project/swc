let validate: (x: unknown) => any = x =>
  x === "yes" || x === "no" ? x : "idk";
