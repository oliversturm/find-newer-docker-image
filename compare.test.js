const { suite, test } = require('mocha');
const { assert } = require('chai');

const { greaterTags } = require('./compare');

suite('compare', function() {
  test('multiple semantic', function() {
    const currentTag = '4.9.8-php7.1-apache';
    const tags = [
      '4.9.8-php7.0-apache', // lower version
      '4.9.7-php7.1-apache', // lower version
      '4.9.7-php7.2-apache', // lower version
      '4.9.10-php7.1-apache', // greater version
      '5-php7.1-apache', // greater version
      '4.9.8-php7.2-apache', // greater version
      '4.9.8-php7.2-other', // unrelated
      'xx-4.9.8-php7.2-apache', // unrelated
      'altogether-different' // unrelated
    ];

    const result = greaterTags(currentTag, tags);
    assert.deepEqual(result, [
      '4.9.10-php7.1-apache', // greater number
      '5-php7.1-apache', // greater number
      '4.9.8-php7.2-apache' // greater number
    ]);
  });

  test('date-style numbers', function() {
    const currentTag = 'jessie-20181010';
    const tags = [
      'jessie-20180910', // lower version
      'jessie-20181011', // greater version
      'jessie-20181212-slim' // unrelated
    ];

    const result = greaterTags(currentTag, tags);
    assert.deepEqual(result, ['jessie-20181011']);
  });
  // jessie-20180625
});
