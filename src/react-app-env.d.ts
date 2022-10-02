/// <reference types="react-scripts" />
/// <reference types="gtag.js" />
/// <reference types="bootstrap" />

declare module '*.svg' {
  const content: any
  export default content
}

declare namespace JSX {
  interface ExtendedButton
    extends React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    > {
    customAttribute?: string
  }

  interface IntrinsicElements {
    button: ExtendedButton
  }
}
