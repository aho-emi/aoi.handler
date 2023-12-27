const { readdirSync } = require("fs");
const { resolve } = require("path")

const { loadCommands, reloadCommands } = require('./handlers/loadCommands.js')
const { loadVariables, reloadVariables } = require('./handlers/loadVariables.js')
const { loadStatuses, reloadStatuses } = require('./handlers/loadStatuses.js')
const { loadFunctions, reloadFunctions } = require('./handlers/loadFunctions.js')
const { readyLog } = require('./handlers/clientReady.js')



class Handler {
  constructor(client, config, basePath) {

    if (!client?.client) {
      console.error('"client" is not provided. Provide a valid client in handler.')
      process.exit()
    }

      
    // Colors Validation
    const colors = Object.keys(require('./colors.js')) //.map(([key, value]) => key)

    const userInput = [];

    function extractValues(obj, ignorePath = "") {
      for (const key in obj) {
        const value = obj[key];
        const currentKey = ignorePath ? `${ignorePath}.${key}` : key; 

        if (typeof value === 'object' && value !== null) {
          if (currentKey === "border.type") { 
            extractValues(value, currentKey);
          }
        } else {
          userInput.push(value);
        }
      }
    }


    extractValues(config);
    const invalidColors = userInput.filter(value => !colors.includes(value));

    if (invalidColors.length > 0) {
      console.error(`Invalid colors provided in config: ${invalidColors.join(', ')}`)
      process.exit()
    }
    
    this.client = client.client;
    this.path = basePath;
    this.config = config
    this.client.aoiHandler = {}
    this.client.aoiHandler.paths = new Map()

    if (client.readyLog) {
      this.client.on('ready', () => {
          readyLog(this.client, this.config.border)
      })

      this.client.functionManager.createFunction({
        name: "$reload",
        type: "djs",
        code: async d => {
          const data = d.util.aoiFunc(d);
          const [type] = data.inside.splits; 

          if (type.toLowerCase() === "commands") {
            reloadCommands(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('command'),
              this.config.commandLoader, this.config.border
            )
            data.result = 'Reloaded every commands!'
          } else if (type.toLowerCase() === "statuses"){
            reloadStatuses(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('status'),
              this.config.statusLoader, this.config.border
            )
            data.result = 'Reloaded every statuses!'
          } else if ( type.toLowerCase() === "variables" ) {
            reloadVariables(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('variable'),
              this.config.variableLoader, this.config.border
            )
            data.result = 'Reloaded every variables!'
          } else if ( type.toLowerCase() === "functions" ) {
            reloadFunctions(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('function'),
              this.config.functionLoader, this.config.border
            )
            data.result = 'Reloaded every functions!'
          } else if (type.toLowerCase() == "all") {
            reloadCommands(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('command'),
              this.config.commandLoader, this.config.border
            )
            reloadStatuses(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('status'),
              this.config.statusLoader, this.config.border
            )
            reloadVariables(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('variable'),
              this.config.variableLoader, this.config.border
            )
            reloadFunctions(
              this.client,
              this.path,
              this.client.aoiHandler.paths.get('function'),
              this.config.functionLoader, this.config.border
            )
            data.result = 'Reloaded every loadets!'
          }

          return {
            code: d.util.setCode(data)
          };
        }
      });
      
      }
    }
    
  
  loadCommands(path) {
    loadCommands(this.client, this.path, path, this.config.commandLoader, this.config.border)
    this.client.aoiHandler.paths.set('command', path)
  }

  loadVariables(path) {
    loadVariables(this.client, this.path, path, this.config.variableLoader, this.config.border)
    this.client.aoiHandler.paths.set('variable', path)
  }

  loadStatuses(path) {
    loadStatuses(this.client, this.path, path, this.config.statusLoader, this.config.border)
    this.client.aoiHandler.paths.set('status', path)
  }

  loadFunctions(path) {
    loadFunctions(this.client, this.path, path, this.config.functionLoader, this.config.border)
    this.client.aoiHandler.paths.set('function', path)
  }
  
}
module.exports = {
  Handler
}