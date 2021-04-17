// CSS definition for CSS modules.
//
// NOTE: `typescript-plugin-css-modules` will not work without CSS type
//  definition, because Typescript cannot `import` CSS file.
//  See: https://github.com/mrmckeb/typescript-plugin-css-modules#custom-definitions

declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.sass" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.less" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.styl" {
  const classes: { [key: string]: string };
  export default classes;
}
