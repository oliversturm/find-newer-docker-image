# find-newer-docker-image

A command line tool to find newer versions of images on the Docker Hub.

Docker has tags, not really versions - unless they are used as such. For server maintenance purposes, it is useful to be able to retrieve tags for a given repository that are newer than the image tag I'm using right now.

## Installing

Use npm to install:

```shell
> npm install -g find-newer-docker-image
```

You need a reasonably current version of node (I was on v8.11.3) to support ECMA Script syntax used by the code. Please create an issue if you'd like to be able to use older node versions and I'll see about babel-compiling the package.

## Running

The command requires two parameters: a repository name that's accessible on Docker Hub, and the tag of the image you're using at the moment. It finds and lists all tags that are considered newer than yours.

```shell
> find-newer-docker-image wordpress 4.9.7-php7.0-apache
4.9.7-php7.1-apache
4.9.7-php7.2-apache
4.9.8-php7.0-apache
4.9.8-php7.1-apache
4.9.8-php7.2-apache
```

## How It Works

The tool separates the tag into parts. For example, consider `4.9.7-php7.0-apache`: the parts are `4.9.7`, `php`, `7.0` and `apache`. Using the complete list of available tags on the repository `wordpress` (in the example above), those tags are then filtered out that match your own tag in all the text parts, have no lower versions in any of the number fields than the one you are already using, and have at least one higher number in a number field than yours. Magic, eh? :)

## License

Copyright 2018 Oliver Sturm <oliver@oliversturm.com>. [MIT License](https://opensource.org/licenses/MIT) applies.
