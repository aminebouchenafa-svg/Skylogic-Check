/// <reference types="vite/client" />

declare module '*.png?inline' {
  const dataUrl: string
  export default dataUrl
}
