# i-views Bower resolver

A iviews artifact resolver for Bower.
 
## Usage:

The module has to be added to your `package.json` as a devDependency:
```
devDependencies: {
    "iviews-bower-resolver": "^1.0.0"
}
```

Now include `iviews-bower-resolver` in your`.bowerrc` file to tell Bower that it should use this resolver for the dependencies
defined in `bower.json`:

```
{
  "resolvers": [
    "iviews-bower-resolver"
  ]
}
```

Then add a reference to an i-views dependency in your `bower.json`. The version is specified by the reference part, e.g. `#5.0.4`.
If no version is given then the latest version will be automatically downloaded by Bower.

```
"dependencies": {
    "repo": "iviews://viewconfigmapper#5.0.4"
}
```

## Development
The base url to the public server which hosts the components is defined in `src/resolver.js`.

## Tests
A sample Bower project is available at `bower-test`. Install the components using `bower update`.