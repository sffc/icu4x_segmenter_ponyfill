# Intl.Segmenter Ponyfill based on ICU4X

This repository contains an [Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) implementation based on [ICU4X](https://icu4x.unicode.org/).

ICU4X is a Rust project; this package uses WebAssembly to use it in JS in both Node.js and browser environments.

## Performance

The ICU4X-based segmentation ponyfill outperforms Node.js, as shown below (performance creating 100'076 segments):

| Node Version | ECMA Performance | ICU4X Ponyfill Performance |
|---|---|---|
| 22 | 35 ms | 7 ms |
| 20 | 35 ms | 7 ms |
| 18 | 29536 ms | 12 ms |

To reproduce these numbers, run `grapheme.mjs`.

## Features and Limitations

In order to expedite shipping this project, this project does not yet implement all features of Intl.Segmenter. However, ICU4X supports these features, so adding them to this project should involve running tools and writing JS wrapper code:

- [x] Grapheme Break
- [ ] Word Break
- [ ] Sentence Break
- [ ] [`IntlSegmentsPrototype.containing()`](https://tc39.es/ecma402/#sec-%intlsegmentsprototype%.containing)
- [ ] [resolvedOptions](https://tc39.es/ecma402/#sec-intl.segmenter.prototype.resolvedoptions)

## Examples

```javascript
import { SegmenterImplICU4X } from "icu4x_segmenter_ponyfill";

const string = "𑄃𑄨𑄁𑄢𑄨𑄎𑄨";

let segmenter = new SegmenterImplICU4X(undefined, { granularity: "grapheme" });
let collectedSegments = [];
for (let segment of segmenter.segment(string)) {
    collectedSegments.push(segment.index);
}

console.log(collectedSegments);
```

## Copyright & Licenses

Copyright © 2023 Unicode, Inc. Unicode and the Unicode Logo are registered trademarks of Unicode, Inc. in the United States and other countries.

The project is released under [LICENSE](./LICENSE).

A CLA is required to contribute to this project - please refer to the [CONTRIBUTING.md](https://github.com/unicode-org/.github/blob/main/.github/CONTRIBUTING.md) file (or start a Pull Request) for more information.
