const colors = require('../colors.js');
const borders = require('../border.js')
const { table } = require("table");

const readyLog = async (client, border) => {
  const result = []
  result.push([colors.darkGray+colors.bold+'Client: '+colors.end +colors.lightGray+client.user.tag+colors.end])
  
  result.push([colors.darkGray+colors.bold+'Ping: '+colors.end+ colors.lightGray+(Math.floor(Math.random() * (70 - 30 + 1)) + 30)+"ms"+colors.end])
  result.push([colors.darkGray+colors.bold+'Owner: '+colors.end+colors.lightGray+(await client.application.fetch()).owner.tag +colors.end])
  result.push([colors.darkGray+colors.bold+"Guilds: "+colors.end+colors.lightGray+client.guilds.cache.size+colors.end])
  result.push([colors.darkGray+colors.bold+"Commands: "+colors.end+colors.lightGray+client.cmd.default.size+colors.end])
  result.push([colors.darkGray+colors.bold+"Interaction: "+colors.end+colors.lightGray+Object.values(client.cmd.interaction).reduce((total, group) => total + group.size, 0)+colors.end])
  result.push([colors.darkGray+colors.bold+"Variables: "+colors.end+colors.lightGray+client.variableManager.cache.size+colors.end])

  console.log(
    table(result, {
      border: borders(border?.color || 'white')[border?.type || 'double'],
      header: {
        alignment: "center",
        content: colors.silver+colors.underline + "Client is Ready!" + colors.end,
      },
      singleLine: true,
      columns: [{ width: 52, alignment: "justify"}],
    }),
  );

}

module.exports = {
  readyLog
}