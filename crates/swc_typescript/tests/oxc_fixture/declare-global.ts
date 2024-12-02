function MyFunction() {
  return 'here is my function'
}

declare global {
  interface Window {
    MyFunction: typeof MyFunction
  }
}

export {}
