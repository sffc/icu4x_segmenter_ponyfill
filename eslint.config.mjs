import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    ignores: ["icu4x/**/*.mjs"],
  },
  {
    languageOptions: { globals: globals.browser },
  },
  pluginJs.configs.recommended,
];