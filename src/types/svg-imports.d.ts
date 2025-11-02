// Allow importing SVGs as URLs with the `?url` suffix (Vite)
declare module '*.svg?url' {
  const src: string;
  export default src;
}

// Also allow plain svg imports if needed elsewhere
declare module '*.svg' {
  const content: string;
  export default content;
}
