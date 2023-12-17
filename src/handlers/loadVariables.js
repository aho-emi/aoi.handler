const path = require('path')
const colors = require('../colors.js');
const borders = require('../border.js')
const { table } = require("table");


const loadVariables = async (client, basePath, filePath, config, border ) => {
  let v = require(path.resolve(basePath, filePath));
  const output = [[colors[config.title || 'white'] + "Variable Name" + colors.end , colors[config.title || 'white'] + "Type" + colors.end, colors[config.title || 'white'] + "Table" + colors.end]]
  
  for (let variable in v.variables) {
    let type = typeof v.variables[variable]
    output.push([colors[config.variableName || 'white'] + variable + colors.end, colors[config.type[type] || 'white'] + type + colors.end, colors[config.table || 'white'] + v.table + colors.end])

  }
  client.variables(v.variables, v.table || 'main')

  console.log(
    table(output, {
      border: borders(border.color)[border.type || 'double'],
      header: {
        alignment: "center",
        content: colors[config.header || 'white'] + colors.underline +"Variable Loader" + colors.end,

      },
      singleLine: true,
      columns: [{ width:25 }, { width: 10, alignment: "center"}, {width: 11, alignment: "center"}],
    }),
  );
  
}

const reloadVariables = async (client, basePath, filePath, config, border ) => {
    delete require.cache[require.resolve(path.resolve(basePath, filePath))];
    let v = require(path.resolve(basePath, filePath));

    client.variableManager.cache.clear();
  const output = [[colors[config.title || 'white'] + "Variable Name" + colors.end , colors[config.title || 'white'] + "Type" + colors.end, colors[config.title || 'white'] + "Table" + colors.end]]

  for (let variable in v.variables) {
    let type = typeof v.variables[variable]
    output.push([colors[config.variableName || 'white'] + variable + colors.end, colors[config.type[type] || 'white'] + type + colors.end, colors[config.table || 'white'] + v.table + colors.end])

  }
  client.variables(v.variables, v.table || 'main')

  console.log(
    table(output, {
      border: borders(border.color)[border.type || 'double'],
      header: {
        alignment: "center",
        content: colors[config.header || 'white'] + colors.underline +"Variable Reloader" + colors.end,

      },
      singleLine: true,
      columns: [{ width:25 }, { width: 10, alignment: "center"}, {width: 11, alignment: "center"}],
    }),
  );

}

module.exports = {
  loadVariables,
  reloadVariables
}