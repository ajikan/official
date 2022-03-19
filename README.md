# My Personal Website

Recently I discovered a really cool Javascript library called THREE.js and I wanted to explore it. I decided to revamp my personal website by creating a brand new one using this 3D js library. 

## Credits

For the matrix rain effect and sound effects I took the code from the [matrix-vr](https://github.com/pazdera/matrix-vr) project. Please do check out his project as well it's really cool.

Thank you all!

## Development

To get this working on your machine, clone the repo as usual and run `yarn` to install the dependencies. 
Run the following command to start a local server:

```
yarn serve
```

To generate a deployable build, run:

```
yarn build
```
Above command will create a ./dist directory containing all of the .assets/, ./src, and index.html contents.

Finally to deploy the build, run:

```
yarn deploy
```
Above command will copy the contents in .dist/ directory over to the gh-pages branch which is the source for github pages to build from.
 
## Licence

The code in this repo is distributed under the MIT License. See [LICENSE](https://github.com/ajikan/official/blob/master/LICENSE) for details.
