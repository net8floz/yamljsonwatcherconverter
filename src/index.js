const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const fsExtra = require('fs-extra')
const jsYaml = require('js-yaml');
const process = require('process');
var processArgs = process.argv.slice(2);

function validateProcess() {
  if (!fsExtra.pathExistsSync("yamljsonwatcherconverter.json")) {
    throw new Error("No config found");
  }

  config = JSON.parse(fsExtra.readFileSync('yamljsonwatcherconverter.json'));

  if (config.inPath === undefined) {
    throw new Error("No input path found");
  }

  if (config.outPath === undefined) {
    throw new Error("No output path found");
  }

  config.inPath = path.resolve(config.inPath); // normalize(config.inPath);
  config.outPath = path.resolve(config.outPath); ///normalize(config.outPath);

  console.log("In: " + config.inPath);
  console.log("Out: " + config.outPath);

  if (!fsExtra.pathExistsSync(config.inPath)) {
    throw new Error("No source found at " + config.inPath);
  }
}

function watch() {
  chokidar
    .watch(config.inPath, {
      ignored: /^\./,
      ignoreInitial: true,
      persistent: true,
      awaitWriteFinish: true
    })
    .on('all', function (path) { console.log("Change in " + path); rebuild(); })
    .on('error', function (error) { console.log(error); process.exit(); })
}


function createOutPathIfNoExist() {
  if (!fsExtra.pathExistsSync(config.outPath)) {
    fsExtra.mkdirSync(config.outPath);
  }
}

function clearOutPath() {
  if (processArgs[0] == '--force') {
    fsExtra.emptyDirSync(config.outPath);
  } else {
    const paths = gatherFiles(config.outPath);
    console.log("I will destroy everything at " + config.outPath);
    for (const p of paths) {
      console.log("rm " + path.resolve(p));
    }
    console.log("");
    console.log("Run this command with --force to let this happen");
    console.log("No build will be made without --force for your protection");
    console.log("");
  }
}

function gatherFiles(dir) {
  const files = fsExtra.readdirSync(dir);
  let paths = [];
  for (const fileName of files) {
    const filePath = path.join(dir, fileName);
    if (fsExtra.lstatSync(filePath).isDirectory()) {
      paths = paths.concat(gatherFiles(filePath));
    } else {
      paths.push(path.resolve(filePath));
    }
  }
  return paths;
}

function build() {
  const paths = gatherFiles(config.inPath);

  for (const inFilePath of paths) {
    if (!inFilePath.indexOf('.yaml') && !inFilePath.indexOf('.yml')) {
      continue;
    }

    const outFilePath = inFilePath.replace(config.inPath, config.outPath).replace('.yaml', '.json').replace('.yml', '.json');
    const outDirPath = path.dirname(outFilePath);
    fsExtra.ensureDirSync(outDirPath);

    const yaml = jsYaml.safeLoad(fs.readFileSync(inFilePath, 'utf8'));
    let json = null;
    if (config.prettify) {
      json = JSON.stringify(yaml, null, 4);
    } else {
      json = JSON.stringify(yaml);
    }

    if (processArgs[0] == '--force') {
      fs.writeFileSync(outFilePath, json, 'utf8');
      console.log("Created " + outFilePath);
    } else {
      console.log("I would like to create " + outFilePath);
      console.log("Run command with --force to actually do it");
    }
  }
}

async function rebuild() {
  try {
    console.log(" ");
    console.log("Begining build...");
    validateProcess();
    clearOutPath();
    build();
    console.log("Build finished!");
  } catch (err) {
    console.log("Fatal error");
    console.log(err.message);
    process.exit();
  }
}

setInterval(() => { }, 1 << 30);
validateProcess();
rebuild();
watch();

