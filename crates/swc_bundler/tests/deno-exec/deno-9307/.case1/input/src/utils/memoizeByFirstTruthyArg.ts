export const memoizeByTruthyFirstArg = (
  cb: (first: any, ...other: any[]) => any,
) => {
  const cache = new Map<any, any>();
  return (first: any, ...other: any[]): any => {
    if (!first) return cb(first, ...other);
    if (cache.has(first)) return cache.get(first);
    const res = cb(first, ...other);
    cache.set(first, res);
    return res;
  };
};
