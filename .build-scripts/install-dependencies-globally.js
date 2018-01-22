#!/usr/bin/env node

const {
  NODE_ENV,
} = process.env;

(function installDependenciesGlobally() {
  const packageJson = require('../package.json');
  const dependencies = (NODE_ENV === 'production') ?
    packageJson.dependencies :
    Object.assign({},
      packageJson.dependencies,
      packageJson.devDependencies
    );
  const dependenciesNameList = Object.keys(dependencies);
  const dependenciesList =
    dependenciesNameList.map((dependency) => `${dependency}@${dependencies[dependency]}`);
  const {spawn} = require('child_process');
  const dependencyInstaller = spawn('npm', ['i', '-g'].concat(dependenciesList));
  dependencyInstaller.stdout.on('data', (data) => {
    console.info(data.toString());
  });
  dependencyInstaller.on('exit', (code) => {
    const dependencyLinker = spawn('npm', ['link'].concat(dependenciesNameList));
    dependencyLinker.stdout.on('data', (data) => {
      console.info(data.toString());
    });
    dependencyLinker.on('exit', (code) => {
      console.info('exiting with code', code);
      process.exit(code);
    });
  });
})();
