const XRegExp = require('xregexp');
const compareVer = require('compare-ver');

const re = XRegExp(
  `(?<num>(\\d\\.?)+) | 
   (?<txt>[^\\d.-]+)`,
  'x'
);

const parse = t => {
  const result = [];
  let pos = 0,
    match;

  while ((match = XRegExp.exec(t, re, pos, false))) {
    if (match.num) result.push({ type: 'num', value: match.num });
    if (match.txt) result.push({ type: 'txt', value: match.txt });
    pos = match.index + match[0].length;
  }

  return result;
};

const compTable = {
  num: (l, r) => {
    // compare-version doesn't think that 5 is a valid version -
    // it wants 5.0
    const extend = v => (/^\d+$/.test(v) ? `${v}.0` : v);
    const left = extend(l.value),
      right = extend(r.value);
    const res = compareVer.gt(left, right);
    if (res === -1) return 'leftIsSmaller';
    else if (res === 1) return 'leftIsGreater';
    else return 'equal';
  },
  txt: (l, r) => (l.value === r.value ? 'equal' : 'not equal')
};

const compare = (l, r) => {
  if (l.length !== r.length) return 'unrelated';
  return l
    .map((lv, index) => {
      const rv = r[index];
      if (lv.type !== rv.type) return 'unrelated';
      else return compTable[lv.type](lv, rv);
    })
    .reduce((r, v) => {
      if (r === 'unrelated') return r;
      if (v === 'equal') return r;
      if (v === 'unrelated' || v === 'not equal') return 'unrelated';
      // this is a strange one if you assume that 'compare' is a general
      // purpose comparison function - it's not, and for this purpose
      // any individual value that is found to be smaller than its
      // counterpart breaks the deal
      if (r === 'leftIsSmaller') return r;
      return v;
    }, 'equal');
};

const isGreater = (ot, t) => {
  const tInfo = parse(t);
  const otInfo = parse(ot);
  return compare(otInfo, tInfo) === 'leftIsGreater';
};

function* greaterTagsGen(tag, tags) {
  for (const otherTag of tags) {
    if (isGreater(otherTag, tag)) yield otherTag;
  }
}

const greaterTags = (tag, tags) => Array.from(greaterTagsGen(tag, tags));

module.exports = { greaterTags };
