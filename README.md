# @i-views/bower-resolver 

[![NPM version](https://badge.fury.io/js/@i-views/bower-resolver.svg)](http://badge.fury.io/js/@i-views/bower-resolver)


> bower-resolver for downloading software by i-views

# About i-views

<a href="https://i-views.com">
    <img src="http://documentation.i-views.com/5.0/assets/img/i-views-logo.svg" width="200" align="right">
</a>

[intelligent views gmbh](https://i-views.com) (i-views) is one of the leading providers of semantic
technologies and applications in the German-speaking region.  The company, which started
out in 1997 as a spin-off of the Fraunhofer  Society, has over 30 employees and is based
in Darmstadt, Germany. The  company produces the i-views Smart Data Engine, which provides
customers  with an easy and flexible way of creating smart data networks, thus  increasing the value of
their data.

If you want to know more about i-views, please have a look at the following web-sites:

* Tryout-Version and demo: https://i-views.com/de/smart-data-engine/demo-tryout/
* Technical Whitepaper: https://i-views.com/de/technical-whitepaper-download/
* Documentation (german): https://i-views.com/de/smart-data-engine/dokumentation/


# Purpose

In addition the our core-product, we provide a web-frontend called the `viewconfigmapper` that can be used and configured with our backend. The `@i-views/bower-resolver` helps you download and use this frontend in your own projects.

Please note that while the `@i-views/bower-resolver` is released under the MIT-License, most of the packages it downloads are under a propriatery license.


# Installation

```
npm install --save-dev @i-views/bower-resolver
```

Make sure that the following files in your project are similar to what is shown here:

## .bowerrc

Include `@i-views/bower-resolver` in your`.bowerrc` file to tell Bower that it should use this resolver for the dependencies defined in `bower.json`:

```
{
  "resolvers": [
    "@i-views/bower-resolver"
  ]
}
```

## bower.json

Add a reference to an i-views dependency in your `bower.json`. The version is specified by the reference part, e.g. `#5.0.4`.
If no version is given then the latest version will be automatically downloaded by Bower.

```json
{
  "name": "example-project",
  "dependencies": {
    "viewconfigmapper": "iviews://viewconfigmapper#5.0.4"
  },
  "license": "MIT"
}
```

When you run

```
bower install
```

the resolver will download the `viewconfigmapper` from the i-views download servers. 




# License

`@i-views/bower-resolver` is published under the MIT-license.

See [LICENSE.md](LICENSE.md) for details.


 
# Contributing guidelines

See [CONTRIBUTING.md](CONTRIBUTING.md).