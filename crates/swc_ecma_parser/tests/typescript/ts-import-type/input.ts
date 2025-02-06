type Vite = typeof import("vite", {
  with: {
      "resolution-mode": "import"
  }
});
type Vite2 = typeof import("vite",);
type Vite3 = typeof import("vite");
