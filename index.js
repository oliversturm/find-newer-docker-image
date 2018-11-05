const axios = require('axios');
const { greaterTags } = require('./compare');

if (process.argv.length !== 4) {
  console.error(`Syntax: find-newer-docker-image <repository> <tag-with-version>
  
  The repository must be accessible on the Docker Hub.

  Tag should be something like these:
  
    4.9.8-php7.2-apache
    jessie-20181010`);

  process.exit(1);
}

const repo = process.argv[2];
const tag = process.argv[3];

const tagUrl = `https://registry.hub.docker.com/v1/repositories/${repo}/tags`;

axios
  .get(tagUrl)
  .then(res => {
    if (res.status !== 200) {
      console.error('Server error: ', `${res.statusText} (${res.status})`);
      process.exit(3);
    }

    const tags = greaterTags(tag, res.data.map(e => e.name));
    if (tags && tags.length) {
      for (const t of tags) console.log(t);
    }
  })
  .catch(err => {
    console.error('Error: ', err);
    process.exit(2);
  });
