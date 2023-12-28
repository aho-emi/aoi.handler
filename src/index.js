const {
  readdirSync
} = require("fs");
const {
  resolve
} = require("path")

const {
  loadCommands,
  reloadCommands
} = require('./handlers/loadCommands.js')
const {
  loadVariables,
  reloadVariables
} = require('./handlers/loadVariables.js')
const {
  loadStatuses,
  reloadStatuses
} = require('./handlers/loadStatuses.js')
const {
  loadFunctions,
  reloadFunctions
} = require('./handlers/loadFunctions.js')
const {
  readyLog
} = require('./handlers/clientReady.js')


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
          if (data.err) return d.error(data.err);
          const [type] = data.inside.splits;

          if (type.toLowerCase() === "commands") {
            if (this.client.aoiHandler.paths.get('command')) {
              reloadCommands(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('command'),
                this.config.commandLoader, this.config.border
              )
              data.result = 'Reloaded every commands!'
            } else {
              data.result = 'Command Loader was not initialized! Cannot reload.'
            }
          } else if (type.toLowerCase() === "statuses") {
            if (this.client.aoiHandler.paths.get('status')) {
              reloadStatuses(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('status'),
                this.config.statusLoader, this.config.border
              )
              data.result = 'Reloaded every statuses!'
            } else {
              data.result = 'Status Loader was not initialized! Cannot reload.'
            }
          } else if (type.toLowerCase() === "variables") {
            if (this.client.aoiHandler.paths.get('variable')) {
              reloadVariables(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('variable'),
                this.config.variableLoader, this.config.border
              )
              data.result = 'Reloaded every variables!'
            } else {
              data.result = 'Variable Loader was not initialized! Cannot reload.'
            }
          } else if (type.toLowerCase() === "functions") {
            if (this.client.aoiHandler.paths.get('function')) {
              reloadFunctions(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('function'),
                this.config.functionLoader, this.config.border
              )
              data.result = 'Reloaded every functions!'
            } else {
              data.result = 'Function Loader was not initialized! Cannot reload.'
            }
          } else if (type.toLowerCase() == "all") {
            if (this.client.aoiHandler.paths.get('command')) {
              reloadCommands(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('command'),
                this.config.commandLoader, this.config.border
              )
            }
            if (this.client.aoiHandler.paths.get('status')) {
              reloadStatuses(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('status'),
                this.config.statusLoader, this.config.border
              )
            }
            if (this.client.aoiHandler.paths.get('variabld')) {
              reloadVariables(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('variable'),
                this.config.variableLoader, this.config.border
              )
            }
            if (this.client.aoiHandler.paths.get('function')) {
              reloadFunctions(
                this.client,
                this.path,
                this.client.aoiHandler.paths.get('function'),
                this.config.functionLoader, this.config.border
              )
            }
            data.result = 'Reloaded every loaders!'
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