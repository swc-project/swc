const sizes = {
  A4: { width: '21cm', height: '29.7cm' },
  Letter: { width: '8.5in', height: '11in' }
};

export function printSize(paper) {
  const { width, height } = sizes[paper];
  console.log({ width, height });
}
