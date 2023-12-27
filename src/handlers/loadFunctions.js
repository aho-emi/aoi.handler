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
    [colors[config?.title || 'white'] +"Directory"+colors.end, colors[config?.title || 'white'] +"File Name"+colors.end]
  ];

  let files;
  if (fs.lstatSync(dir).isDirectory()) {
    files = readDirectoryRecursively(dir)
  } else {
    console.log('\u001b[38;2;255;0;0mFailed to Initialize function handler: Provided path is not a directory\u001b[0m')
    return
  }
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
            functionsFailed.push([colors[config?.functionName || 'white'] + func.name + colors.end, colors[config?.reason || 'white'] + error + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
          }
        } else {
          error =  !func.type ? 'Type not provided' : !func.name ? 'Name not Provided' : !func.code ? 'Code not provided' : null;
          functionsFailed.push([colors[config?.functionName || 'white'] + (func.name || 'Undefined') + colors.end, colors[config?.reason || 'white'] + error + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
        }
      }
    }
  }

  if (failedToWalkIn.length > 1) {
    console.log(
      table(failedToWalkIn, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Function Loader\nFailed to walk in File" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 35}, { width: 14, alignment: "center"}],
      }),
    );
  }

  if (functionsFailed.length > 1) {
    console.log(
      table(functionsFailed, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content: colors[config?.header || 'white'] + colors.underline +"Function Loader\nFailed" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 18}, { width: 17, alignment: "center"}, {width: 11, alignment: "justify"}],
      }),
    );
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
    [colors[config?.title || 'white'] +"Directory"+colors.end, colors[config?.title || 'white'] +"File Name"+colors.end]
  ];

  let files;
  if (fs.lstatSync(dir).isDirectory()) {
    files = readDirectoryRecursively(dir)
  } else {
    console.log('\u001b[38;2;255;0;0mFailed to Initialize function handler: Provided path is not a directory\u001b[0m')
    return
  }
  
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
            functionsFailed.push([colors[config?.functionName || 'white'] + func.name + colors.end, colors[config?.reason || 'white'] + error + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
          }
        } else {
          error =  !func.type ? 'Type not provided' : !func.name ? 'Name not Provided' : !func.code ? 'Code not provided' : null;
          functionsFailed.push([colors[config?.functionName || 'white'] + (func.name || 'Undefined') + colors.end, colors[config?.reason || 'white'] + error + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
        }
      }
    }
  }

  if (failedToWalkIn.length > 1) {
    console.log(
      table(failedToWalkIn, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Function Reloader\nFailed to walk in File" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 35}, { width: 14, alignment: "center"}],
      }),
    );
  }

  if (functionsFailed.length > 1) {
    console.log(
      table(functionsFailed, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content: colors[config?.header || 'white'] + colors.underline +"Function Reloader\nFailed" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 18}, { width: 17, alignment: "center"}, {width: 11, alignment: "justify"}],
      }),
    );
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

