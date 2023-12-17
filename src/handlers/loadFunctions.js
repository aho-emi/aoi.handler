const path = require('path');
const colors = require('../colors.js');
const borders = require('../border.js');
const { table } = require("table");
const fs = require('fs');

// Functions
function readDirectoryRecursively(directoryPath) {
  const files = [];

  fs.readdirSync(directoryPath).forEach(fileName => {
    const filePath = path.join(directoryPath, fileName);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      files.push(...readDirectoryRecursively(filePath));
    } else {
      files.push(filePath);
    }
  });

  return files;
}

const loadFunctions = async (client, basePath, folderPath, config, border) => {
  client.aoiHandler.customFunctions = new Array()
  const validTypes = ['djs', 'aoijs'];
  const dir = path.resolve(basePath, folderPath);

  const functions = [
    [colors[config?.title || 'white'] + "Function Name" + colors.end, colors[config?.title || 'white'] + "Type" + colors.end, colors[config?.title || 'white'] + "File" + colors.end]
  ];

  const functionsFailed = [
    [colors[config?.title || 'white'] + "Function Name" + colors.end, colors[config?.title || 'white'] + "Type" + colors.end, colors[config?.title || 'white'] + "File" + colors.end]
  ];
  const failedToWalkIn = [
    'Directory', 'File Name'
  ]

  const files = readDirectoryRecursively(dir);
  for (let file of files) {
    if (file.endsWith('.js')) {
      let func;
      const ff = file.split('/');
      if (fs.statSync(file).size > 0) {
        try {
          func = require(file);
        } catch (err) {
          console.log(err)
          failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
        }
      } else {
        func = "";
        failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
      }

      if (func) {
        if (func.type && func.name && func.code) {
          if (func.type == 'djs') {
            client.functionManager.createFunction({
              name: func.name,
              type: func.type,
              code: func.code
            });
            functions.push([colors[config?.functionName || 'white'] + func.name + colors.end, colors[config?.type[func.type] || 'white'] + func.type + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
            client.aoiHandler.customFunctions.push(func.name)
          } else if (func.type == 'aoijs' && func.params) {
            client.functionManager.createFunction({
              name: func.name,
              type: func.type,
              params: func.params,
              code: func.code
            });
            functions.push([colors[config?.functionName || 'white'] + func.name + colors.end, colors[config?.type[func.type] || 'white'] + func.type + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
            client.aoiHandler.customFunctions.push(func.name)
          } else {
            error = func.type == 'aoijs' && !func.params ? 'Missing params' : null;
          }
        }
      }
    }
  }

  console.log(
    table(functions, {
      border: borders(border?.color || 'white')[border?.type || 'double'],
      header: {
        alignment: "center",
        content: colors[config?.header || 'white'] + colors.underline + "Function Loader" + colors.end,
      },
      singleLine: true,
      columns: [{ width: 24 }, { width: 11, alignment: "center"} ,{width: 11, alignment: "center"}]
    }),
  );
};

//reload
const reloadFunctions = async (client, basePath, folderPath, config, border) => {
  const validTypes = ['djs', 'aoijs'];
  const dir = path.resolve(basePath, folderPath);

  const cs = client.aoiHandler.customFunctions
  client.aoiHandler.customFunctions = new Array()
  cs.forEach((key) => {
    const k = key.replace('$', '')
    client.functionManager.cache.delete(k);
    const fc = client.functionManager.functions
    let keyIndex = fc.indexOf(key)
    client.functionManager.functions = fc.slice(0, keyIndex).concat(fc.slice(keyIndex + 1))

  });
  
  const functions = [
    [colors[config?.title || 'white'] + "Function Name" + colors.end, colors[config?.title || 'white'] + "Type" + colors.end, colors[config?.title || 'white'] + "File" + colors.end]
  ];

  const functionsFailed = [
    [colors[config?.title || 'white'] + "Function Name" + colors.end, colors[config?.title || 'white'] + "Type" + colors.end, colors[config?.title || 'white'] + "File" + colors.end]
  ];
  const failedToWalkIn = [
    'Directory', 'File Name'
  ]

  const files = readDirectoryRecursively(dir);
  for (let file of files) {
    if (file.endsWith('.js')) {
      let func;
      delete require.cache[require.resolve(file)];
      const ff = file.split('/');
      if (fs.statSync(file).size > 0) {
        try {
          func = require(file);
        } catch (err) {
          console.log(err)
          failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
        }
      } else {
        func = "";
        failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
      }

      if (func) {
        if (func.type && func.name && func.code) {
          if (func.type == 'djs') {
            client.functionManager.createFunction({
              name: func.name,
              type: func.type,
              code: func.code
            });
            functions.push([colors[config?.functionName || 'white'] + func.name + colors.end, colors[config?.type[func.type] || 'white'] + func.type + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
            client.aoiHandler.customFunctions.push(func.name)
          } else if (func.type == 'aoijs' && func.params) {
            client.functionManager.createFunction({
              name: func.name,
              type: func.type,
              params: func.params,
              code: func.code
            });
            functions.push([colors[config?.functionName || 'white'] + func.name + colors.end, colors[config?.type[func.type] || 'white'] + func.type + colors.end, colors[config?.file || 'white'] + (ff[ff.length - 1]).slice(0, -3) + colors.end]);
            client.aoiHandler.customFunctions.push(func.name)
          } else {
            error = func.type == 'aoijs' && !func.params ? 'Missing params' : null;
          }
        }
      }
    }
  }

  console.log(
    table(functions, {
      border: borders(border?.color || 'white')[border?.type || 'double'],
      header: {
        alignment: "center",
        content: colors[config?.header || 'white'] + colors.underline + "Function Reloader" + colors.end,
      },
      singleLine: true,
      columns: [{ width: 24 }, { width: 11, alignment: "center"} ,{width: 11, alignment: "center"}]
    }),
  );
};

module.exports = {
  loadFunctions,
  reloadFunctions
};

