const path = require('path');
const colors = require('../colors.js');
const borders = require('../border.js')
const { table } = require("table");
const fs = require('fs')

const loadStatuses = async (client, basePath, filePath, config, border) => {
  const file = require(path.resolve(basePath, filePath));

  const statuses = [[colors[config?.title || 'white']+'Name'+colors.end,colors[config?.title || 'white']+ 'Type'+colors.end, colors[config?.title || 'white']+'Status'+colors.end, colors[config?.title || 'white']+'Time'+colors.end]]
  const failedToWalkIn = []
  const failedStatus = [[colors[config?.title || 'white']+'Name'+colors.end, colors[config?.title || 'white']+'Reason'+colors.end]]

  try {
  if (file.statuses?.length > 0) {

    for ( let status of file.statuses) {
      if (status?.name && status?.type && status?.status) {
        let validStatus = ['dnd', 'online', 'idle', 'invisible'].includes((status?.status).toLowerCase())
        let validType = ['playing', 'watching', 'listening', 'streaming', 'competing', 'custom'].includes((status?.type).toLowerCase())
        if (validStatus && validType) {
          let result = {
            name: status?.name,
            type: (status?.type).toUpperCase(),
            status: status?.status,
            time: status?.time
          }
          status?.URL ? result.URL = status?.URL : null;
          client.status(result)
          statuses.push([colors[config?.name || 'white']+result.name  + colors.end, colors[config?.type || 'white']+(status?.type).toUpperCase()  + colors.end, colors[config?.status || 'white']+result.status + colors.end , colors[config?.time || 'white']+result.time + 's' + colors.end])
        } else {
          const error = !validStatus ? 'Invalid Status' : !validType ? 'Invalid Type' : ''
          failedStatus.push([colors[config?.name || 'white']+status?.name+colors.end, colors[config?.reason || 'white']+error+colors.end])
        }
      } else {
        const error = !status?.name ? 'Name not Provided' : !status?.type ? 'Type not provided' : !status?.status ? 'Status not provided' : ''
        failedStatus.push([colors[config?.name || 'white']+status?.name+colors.end, colors[config?.reason || 'white']+error+colors.end])
      }
    }
  } else {
    failedToWalkIn.push(['No status provided'])
  }
} catch (err) { 
   console.log(err)
}

  if (failedToWalkIn.length > 0) {
    console.log(
      table(failedToWalkIn, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Status Loader\nFailed to walk in File" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 52, alignment: "center"}],
      }),
    );
  }

  if (failedStatus.length > 1) {
    console.log(
      table(failedStatus, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Status Loader\nFailed" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 30}, {width: 19}],
      }),
    );
  }


  if (statuses.length > 1 ) {
    console.log(
      table(statuses, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content: colors[config?.header || 'white'] + colors.underline + "Status Loader" + colors.end,
      },
        singleLine: true,
        columns: [{ width: 21 }, { width: 9, alignment: "center"} ,{width: 9, alignment: "center"}, {width: 4, alignment: "center"}],
      }),
    );
  }
}


// Reloader
const reloadStatuses = async (client, basePath, filePath, config, border) => {
  client.statuses.clear()
  
  delete require.cache[require.resolve(path.resolve(basePath, filePath))];
  const file = require(path.resolve(basePath, filePath));


  const statuses = [[colors[config?.title || 'white']+'Name'+colors.end,colors[config?.title || 'white']+ 'Type'+colors.end, colors[config?.title || 'white']+'Status'+colors.end, colors[config?.title || 'white']+'Time'+colors.end]]
  const failedToWalkIn = []
  const failedStatus = [[colors[config?.title || 'white']+'Name'+colors.end, colors[config?.title || 'white']+'Reason'+colors.end]]

  try {
  if (file.statuses?.length > 0) {
    for ( let status of file.statuses) {
      if (status?.name && status?.type && status?.status) {
        let validStatus = ['dnd', 'online', 'idle', 'invisible'].includes((status?.status).toLowerCase())
        let validType = ['playing', 'watching', 'listening', 'streaming', 'competing', 'custom'].includes((status?.type).toLowerCase())
        if (validStatus && validType) {
          let result = {
            name: status?.name,
            type: (status?.type).toUpperCase(),
            status: status?.status,
            time: status?.time
          }
          status?.URL ? result.URL = status?.URL : null;
          client.status(result)
          console.log(client.statuses, client.user.presence)
          statuses.push([colors[config?.name || 'white']+result.name  + colors.end, colors[config?.type || 'white']+(status?.type).toUpperCase()  + colors.end, colors[config?.status || 'white']+result.status + colors.end , colors[config?.time || 'white']+result.time + 's' + colors.end])
        } else {
          const error = !validStatus ? 'Invalid Status' : !validType ? 'Invalid Type' : ''
          failedStatus.push([colors[config?.name || 'white']+status?.name+colors.end, colors[config?.reason || 'white']+error+colors.end])
        }
      } else {
        const error = !status?.name ? 'Name not Provided' : !status?.type ? 'Type not provided' : !status?.status ? 'Status not provided' : ''
        failedStatus.push([colors[config?.name || 'white']+status?.name+colors.end, colors[config?.reason || 'white']+error+colors.end])
      }
    }
  } else {
    failedToWalkIn.push(['No status provided'])
  }
} catch (err) { 
   console.log(err)
}

  if (failedToWalkIn.length > 0) {
    console.log(
      table(failedToWalkIn, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Status Reloader\nFailed to walk in File" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 52, alignment: "center"}],
      }),
    );
  }

  if (failedStatus.length > 1) {
    console.log(
      table(failedStatus, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content:colors[config?.header || 'white']+ colors.underline + "Status Reloader\nFailed" + colors.end,

        },
        singleLine: true,
        columns: [{ width: 30}, {width: 19}],
      }),
    );
  }


  if (statuses.length > 1 ) {
    console.log(
      table(statuses, {
        border: borders(border?.color || 'white')[border?.type || 'double'],
        header: {
          alignment: "center",
          content: colors[config?.header || 'white'] + colors.underline + "Status Reloader" + colors.end,
      },
        singleLine: true,
        columns: [{ width: 21 }, { width: 9, alignment: "center"} ,{width: 9, alignment: "center"}, {width: 4, alignment: "center"}],
      }),
    );
  }
}

module.exports = {
  loadStatuses,
  reloadStatuses
}