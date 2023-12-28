const path = require('path');
const colors = require('../colors.js');
const borders = require('../border.js')
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


const loadCommands = async (client, basePath, folderPath, config, border) => {

  const validTypes = Object.getOwnPropertyNames(client.cmd);
  const dir = path.resolve(basePath, folderPath)

  const commands = [[colors[config?.title || 'white'] + "Command Name" + colors.end, colors[config?.title || 'white'] +"Type" +colors.end,colors[config?.title || 'white'] + "Status" + colors.end, colors[config?.title || 'white'] +"File Name" + colors.end]]
  const failedToWalkIn = [[colors[config?.title || 'white'] +"Directory"+colors.end, colors[config?.title || 'white'] +"File Name"+colors.end]];
  const commandsFailed = [[colors[config?.title || 'white'] +"Command Name" + colors.end,colors[config?.title || 'white'] + "Reason" + colors.end, colors[config?.title || 'white'] +'File Name'+colors.end]]

  let files;
  if (fs.lstatSync(dir).isDirectory()) {
    files = readDirectoryRecursively(dir)
  } else {
    console.log('\u001b[38;2;255;0;0mFailed to Initialize command handler: Provided path is not a directory\u001b[0m')
    return
  }
  
  for (let file of files) {
    if (file.endsWith('.js')) {
      let command;
      const ff = file.split('/')
      if (fs.statSync(file).size > 0) {
        try {
          command = require(file) 
        } catch (err) { 
          failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
        }
      } else {
        command = ""
        failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
      }

      command = Array.isArray(command) ? command : [command];
      try {
      if (command) {
      for (let cmd of command) {
        if (!cmd?.type) cmd.type = 'default'
        if (cmd?.type != 'interaction' && !cmd?.name) {
          commandsFailed.push([colors[config?.commandName || 'white'] + 'Undefined' + colors.end, colors[config?.reason || 'white'] + 'Name not provided' +colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
        } else {
        const valid = validTypes.includes(cmd.type);
        if (valid && cmd.code && (cmd.type == 'interaction' ? cmd.prototype : true) ) {
            client.cmd.createCommand(cmd)
            commands.push([colors[config?.commandName || 'white'] + cmd.name + colors.end, colors[config?.type || 'white'] + (cmd.type == 'interaction' ? cmd.prototype : cmd.type) + colors.end,colors[config?.status || 'white'] + "✔" + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
          } else {
            reason = command[0] == "" ? 'No command found' : !valid ? 'Invalid Type' : !cmd.code ? 'Missing code' : !(cmd.type == 'interaction' ? cmd.prototype : true) ? 'Missing prototype' : ''
            commandsFailed.push([colors[config?.commandName || 'white'] +cmd.name +colors.end, colors[config?.reason || 'white'] + reason + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end ])
          }
         }
        }
      }
    } catch (e) {

    }

    }
  }

  if (failedToWalkIn.length > 1) {
    console.log(
      table(failedToWalkIn, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Command Loader\nFailed to walk in File" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 35}, { width: 14, alignment: "center"}],
      }),
    );
  }
  if (commandsFailed.length > 1) {
    console.log(
      table(commandsFailed, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content: colors[config?.header || 'white'] + colors.underline +"Command Loader\nFailed" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 15}, { width: 22, alignment: "center"}],
      }),
    );
  }

  if ( commands.length > 1) {
  console.log(
    table(commands, {
      border: borders(border?.color || 'white')[border?.type || 'double'],
      header: {
        alignment: "center",
        content: colors[config?.header || 'white'] + colors.underline + "Command Loader" + colors.end,
      },
      singleLine: true,
      columns: [{ width: 15 }, { width: 12, alignment: "center"} ,{width: 6, alignment: "center"}, {width: 10, alignment: "center"}],
    }),
  );
  }

}

// Reloader
const reloadCommands = async (client, basePath, folderPath, config, border) => {

  Object.entries(client.cmd).forEach(async ([key, value]) => {
      if (value instanceof Map && value.size > 0) {
          client.cmd[key].clear()
      } else if ( value instanceof Object && key == 'interaction') {
          Object.entries(client.cmd[key]).forEach(([k, v])=> {
            if ( v.size > 0) {
              client.cmd[key][k].clear()
            }
          })
      }
    });



  const validTypes = Object.getOwnPropertyNames(client.cmd);
  const dir = path.resolve(basePath, folderPath)

  const commands = [[colors[config?.title || 'white'] + "Command Name" + colors.end, colors[config?.title || 'white'] +"Type" +colors.end,colors[config?.title || 'white'] + "Status" + colors.end, colors[config?.title || 'white'] +"File Name" + colors.end]]
  const failedToWalkIn = [[colors[config?.title || 'white'] +"Directory"+colors.end, colors[config?.title || 'white'] +"File Name"+colors.end]];
  const commandsFailed = [[colors[config?.title || 'white'] +"Command Name" + colors.end,colors[config?.title || 'white'] + "Reason" + colors.end, colors[config?.title || 'white'] +'File Name'+colors.end]]

  let files;
  if (fs.lstatSync(dir).isDirectory()) {
    files = readDirectoryRecursively(dir)
  } else {
    console.log('\u001b[38;2;255;0;0mFailed to Initialize command handler: Provided path is not a directory\u001b[0m')
    return
  }
  
  for (let file of files) {
    if (file.endsWith('.js')) {
      delete require.cache[require.resolve(file)];
      let command;
      const ff = file.split('/')
      if (fs.statSync(file).size > 0) {
        try {
          command = require(file) 
        } catch (err) { 
          failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
        }
      } else {
        command = ""
        failedToWalkIn.push([colors[config?.directory || 'white'] + ff.slice(3, -1).join('/') + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
      }

      command = Array.isArray(command) ? command : [command];
      try {
      if (command) {
      for (let cmd of command) {
        if (!cmd.type) cmd.type = 'default'
        if (cmd.type != 'interaction' && !cmd.name) {
        commandsFailed.push([colors[config?.commandName || 'white'] + 'Undefined' + colors.end, colors[config?.reason || 'white'] + 'Name not provided' +colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
        } else {
        const valid = validTypes.includes(cmd.type);
        if (valid && cmd.code && (cmd.type == 'interaction' ? cmd.prototype : true) ) {
            client.cmd.createCommand(cmd)
            commands.push([colors[config?.commandName || 'white'] + cmd.name + colors.end, colors[config?.type || 'white'] + (cmd.type == 'interaction' ? cmd.prototype : cmd.type) + colors.end,colors[config?.status || 'white'] + "✔" + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end])
          } else {
            reason = command[0] == "" ? 'No command found' : !valid ? 'Invalid Type' : !cmd.code ? 'Missing code' : !(cmd.type == 'interaction' ? cmd.prototype : true) ? 'Missing prototype' : ''
            commandsFailed.push([colors[config?.commandName || 'white'] +cmd.name +colors.end, colors[config?.reason || 'white'] + reason + colors.end, colors[config?.file || 'white'] +(ff[ff.length -1]).slice(0, -3) + colors.end ])
          }
         }
        }
      }
      } catch (e) {

      }
    }
  }

  if (failedToWalkIn.length > 1) {
    console.log(
      table(failedToWalkIn, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Command Reloader\nFailed to walk in File" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 35}, { width: 14, alignment: "center"}],
      }),
    );
  }
  if (commandsFailed.length > 1) {
    console.log(
      table(commandsFailed, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content: colors[config?.header || 'white'] + colors.underline +"Command Reloader\nFailed" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 15}, { width: 22, alignment: "center"}],
      }),
    );
  }

  if ( commands.length > 1) {
  console.log(
    table(commands, {
      border: borders(border?.color || 'white')[border?.type || 'double'],
      header: {
        alignment: "center",
        content: colors[config?.header || 'white'] + colors.underline + "Command Reloader" + colors.end,
      },
      singleLine: true,
      columns: [{ width: 15 }, { width: 12, alignment: "center"} ,{width: 6, alignment: "center"}, {width: 10, alignment: "center"}],
    }),
  );
  }

}

module.exports = {
  loadCommands,
  reloadCommands,
}