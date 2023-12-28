const colors = require('../src/colors.js')

// border.js
module.exports = function(color) {

  const borders = {
    single: {
      topBody: `─`,
      topJoin: colors[color || "white"] + `┬` + colors.end,
      topLeft: colors[color || "white"] + `┌`,
      topRight: `┐` + colors.end,

      bottomBody: colors[color || "white"] +  `─` + colors.end,
      bottomJoin: colors[color || "white"] + `┴` + colors.end,
      bottomLeft: colors[color || "white"] + `└` + colors.end,
      bottomRight:colors[color || "white"] +  `┘` + colors.end,

      bodyLeft: colors[color || "white"] + `│` + colors.end,
      bodyRight: colors[color || "white"] + `│` + colors.end,
      bodyJoin: colors[color || "white"] + `│` + colors.end,

      joinBody: colors[color || "white"] + `─` + colors.end,
      joinLeft: colors[color || "white"] + `├`,
      joinRight: colors[color || "white"] + `┤` + colors.end,
      joinJoin: colors[color || "white"] + `┼` + colors.end
    },
    double: {
      topBody: `═`,
      topJoin: colors[color || "white"] + `╤` + colors.end,
      topLeft: colors[color || "white"] + `╔`,
      topRight: `╗` + colors.end,

      bottomBody: colors[color || "white"] +  `═` + colors.end,
      bottomJoin:  colors[color || "white"] +`╧` + colors.end,
      bottomLeft: colors[color || "white"] + `╚` + colors.end,
      bottomRight: colors[color || "white"] +  `╝` + colors.end,

      bodyLeft:  colors[color || "white"] +`║` + colors.end,
      bodyRight:  colors[color || "white"] +`║` + colors.end,
      bodyJoin:  colors[color || "white"] +`│` + colors.end,

      joinBody: colors[color || "white"] + `─` + colors.end,
      joinLeft:  colors[color || "white"] +`╟`,
      joinRight: colors[color || "white"] + `╢` + colors.end,
      joinJoin: colors[color || "white"] + `┼` + colors.end
    },
    asterisk: {
      topBody: `*`,
      topJoin: colors[color || "white"] + `*` + colors.end,
      topLeft: colors[color || "white"] + `*`,
      topRight: `*` + colors.end,

      bottomBody: colors[color || "white"] +  `*` + colors.end,
      bottomJoin:  colors[color || "white"] +`*` + colors.end,
      bottomLeft: colors[color || "white"] + `*` + colors.end,
      bottomRight: colors[color || "white"] +  `*` + colors.end,

      bodyLeft:  colors[color || "white"] +`*` + colors.end,
      bodyRight:  colors[color || "white"] +`*` + colors.end,
      bodyJoin:  colors[color || "white"] +`*` + colors.end,

      joinBody: colors[color || "white"] + `*` + colors.end,
      joinLeft:  colors[color || "white"] +`*`,
      joinRight: colors[color || "white"] + `*` + colors.end,
      joinJoin: colors[color || "white"] + `*` + colors.end
    },
    round: {
      topBody: `─`,
      topJoin: colors[color || "white"] + `┬` + colors.end,
      topLeft: colors[color || "white"] + `╭`,
      topRight: `╮` + colors.end,

      bottomBody: colors[color || "white"] +  `─` + colors.end,
      bottomJoin: colors[color || "white"] + `┴` + colors.end,
      bottomLeft: colors[color || "white"] + `╰` + colors.end,
      bottomRight:colors[color || "white"] +  `╯` + colors.end,

      bodyLeft: colors[color || "white"] + `│` + colors.end,
      bodyRight: colors[color || "white"] + `│` + colors.end,
      bodyJoin: colors[color || "white"] + `│` + colors.end,

      joinBody: colors[color || "white"] + `─` + colors.end,
      joinLeft: colors[color || "white"] + `├`,
      joinRight: colors[color || "white"] + `┤` + colors.end,
      joinJoin: colors[color || "white"] + `┼` + colors.end
    },
    borderless: {
      topBody: ` `,
      topJoin: ` `,
      topLeft: ` `,
      topRight: ` `,

      bottomBody: ` `,
      bottomJoin: ` `,
      bottomLeft: ` `,
      bottomRight: ` `,

      bodyLeft: ` `,
      bodyRight: ` `,
      bodyJoin: ` `,

      joinBody: ` ` ,
      joinLeft: ` `,
      joinRight: ` `,
      joinJoin: ` `
    }
  }

  return borders;
}
