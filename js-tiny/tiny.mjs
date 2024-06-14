// This file is part of ICU4X. For terms of use, please see the file
// called LICENSE at the top level of the ICU4X source tree
// (online at: https://github.com/unicode-org/icu4x/blob/main/LICENSE ).

// ICU4X uses fetch when available, but fetch in Node.js is broken,
// so delete the function to force the wasm to be loaded via the fs module.
// See <https://github.com/rust-diplomat/diplomat/issues/283>.
delete globalThis.fetch;

import {ICU4XDataProvider, ICU4XGraphemeClusterSegmenter } from './lib/index.mjs';

const icu4xSegmenter = ICU4XGraphemeClusterSegmenter.create(ICU4XDataProvider.create_compiled());

function getIcu4xSegments(string) {
    let breakIterator = icu4xSegmenter.segment_utf16(string);
    let i = breakIterator.next(), j;
    let collectedSegments = [];
    while ((j = breakIterator.next()) !== -1) {
        collectedSegments.push(i);
        i = j;
    }
    return collectedSegments;
}

function getEcmaSegments(string) {
    let ecmaSegmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    let collectedSegments = [];
    for (let segment of ecmaSegmenter.segment(string)) {
        collectedSegments.push(segment.index);
    }
    return collectedSegments;
}

const shortString = "𑄃𑄨𑄁𑄢𑄨𑄎𑄨";

console.log(getIcu4xSegments(shortString));
console.log(getEcmaSegments(shortString));

let strings = [
    "𑄚𑄱 𑄉𑄧𑄟𑄴 𑄃𑄢𑄧𑄝𑄩",
    "𑄃𑄧𑄌𑄴𑄑𑄳𑄢𑄨𑄠𑄚𑄴 𑄎𑄢𑄴𑄟𑄚𑄴",
    "𑄥𑄪𑄃𑄨𑄌𑄴 𑄦𑄭 𑄎𑄢𑄴𑄟𑄚𑄴",
    "𑄃𑄧𑄌𑄴𑄑𑄳𑄢𑄬𑄣𑄨𑄠𑄧 𑄃𑄨𑄁𑄢𑄬𑄎𑄨",
    "𑄇𑄚𑄓𑄩𑄠𑄧 𑄃𑄨𑄁𑄢𑄬𑄎𑄨",
    "𑄝𑄳𑄢𑄨𑄑𑄨𑄌𑄴 𑄃𑄨𑄁𑄢𑄬𑄎𑄨",
    "𑄃𑄟𑄬𑄢𑄨𑄇𑄢𑄴 𑄃𑄨𑄁𑄢𑄎𑄨",
    "𑄣𑄳𑄠𑄑𑄨𑄚𑄴 𑄃𑄟𑄬𑄢𑄨𑄇𑄚𑄴 𑄥𑄳𑄛𑄳𑄠𑄚𑄨𑄌𑄴",
    "𑄄𑄅𑄢𑄮𑄛𑄩𑄠𑄧 𑄥𑄳𑄛𑄳𑄠𑄚𑄨𑄌𑄴",
    "𑄟𑄳𑄠𑄇𑄴𑄥𑄨𑄇𑄚𑄴 𑄥𑄳𑄛𑄳𑄠𑄚𑄨𑄌𑄴",
    "𑄇𑄚𑄓𑄩𑄠𑄧 𑄜𑄧𑄢𑄥𑄨",
    "𑄥𑄪𑄃𑄨𑄌𑄴 𑄜𑄧𑄢𑄥𑄨",
    "𑄣𑄮𑄥𑄳𑄠𑄇𑄴𑄥𑄧𑄚𑄴",
    "𑄜𑄳𑄣𑄬𑄟𑄨𑄌𑄴",
    "𑄝𑄳𑄢𑄎𑄨𑄣𑄬𑄢𑄴 𑄛𑄧𑄢𑄴𑄖𑄪𑄉𑄨𑄎𑄴",
    "𑄃𑄨𑄃𑄪𑄢𑄮𑄛𑄬𑄢𑄴 𑄛𑄧𑄢𑄴𑄖𑄪𑄉𑄨𑄎𑄴",
    "𑄟𑄧𑄣𑄴𑄘𑄞𑄨𑄠𑄧",
    "𑄇𑄧𑄋𑄴𑄉𑄮 𑄥𑄱𑄦𑄨𑄣𑄨",
    "𑄅𑄪𑄎𑄪𑄅𑄪𑄏𑄫 𑄌𑄩𑄚",
    "𑄢𑄨𑄘𑄨𑄥𑄪𑄘𑄮𑄟𑄴 𑄌𑄩𑄚"
];

let bigString = "";
for (let i=0; i<100; i++) {
    for (let string of strings) {
        bigString += string + " ";
    }
}

console.log("Big string length:", bigString.length);

let time0 = new Date().valueOf();
console.log("ICU4X Segments:", getIcu4xSegments(bigString).length);
let time1 = new Date().valueOf();
console.log("ECMA Segments:", getEcmaSegments(bigString).length);
let time2 = new Date().valueOf();

console.log("ICU4X Speed:", time1 - time0);
console.log("ECMA Speed:", time2 - time1);
