# Contributing


### Bugs, Features and Feedback


* Please, create github issues only for feature-requests, bug reports concerning **this package** or the download infrastructure.
* For questions and requests regarding our product "i-views", please [contact us](https://i-views.com/en/contact/)
* Feel free to open issues for **questions and problems you have**, even if they are not bugs
or feature requests.
* The README.md and CONTRIBUTING.md are auto-generated via [thought](https://npmjs.com/package/thought). If you want to (propose) changes anything by creating a pull-request, please change the content of the partials in the `.thought` directory.  

### Coding style

[![standard][standard-image]][standard-url]

This repository uses [`standard`][standard-url] to maintain code style and consistency,
and to avoid style arguments. You can run `npm run format` to apply the coding-style, but
you may need to fix some things manually. Make sure to use the latest version of `standard`.


### Installing & Testing

You can fork and clone the repo from github. Run

* Run `npm install` to install all the dependencies needed to build and run the project.
* Run `npm test` to run unit tests and validate the `standard` coding-style.
* Run `npm coverage` to run coverage tests and write a report into the `coverage` directory.
* Run `npm run thought` to generate the README.md and other markdown files in the repository.

[standard-image]: https://cdn.rawgit.com/feross/standard/master/badge.svg
[standard-url]: https://github.com/feross/standard

### Releasing

This package uses `thoughtful-release` for creating the changelog. It is automatically 
invoked when bumping the package-version with `npm version` along with `thought` to update the documentation.

This only works properly, if you have the EDITOR environment-variable set to point to your favorite editor.
In order to perform the release, please do

```bash
npm run test
npm run coverage

// Manually 
npm version [ a.a.a | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]
npm publish 
git push --tags origin master
```

or with [release-tools](https://npmjs.com/package/release-tools)

```bash
npm run test
npm run coverage
npm_release [ a.a.a | --bugfix | --minor | --major ]
```

