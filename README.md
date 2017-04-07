# i-views Bower resolver

A iviews artifact resolver for Bower.
 
## Usage:

Include "iviews-bower-resolver" in your .bowerrc:

```
{
  "resolvers": [
    "iviews-bower-resolver"
  ]
}
```

Then add a reference to a hg repo in your bower.json. The version is specified by the reference part, e.g. `#5.0.4`.
If no version is given then the latest version will be downloaded by Bower.

```
"dependencies": {
    "repo": "iviews://viewconfigmapper#5.0.4"
}
```


## Tests
A sample Bower project is available at `bower-test`. Install the components using `bower update`.