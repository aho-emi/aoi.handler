# <h1 align="center"><strong>AOI.JS-HANDLER</strong></h1>

<p align="center">
<img src="https://media.discordapp.net/attachments/1022533781040672839/1137241711614115910/Untitled96_20230805101633.png" alt="Logo" width="150" height="150">
</p>


<p>
  aoi.js-handler is a package built for aoi.js to make it easy for users to load their command, events, custom functions and statuses.
</p>
<h2 align="center"><strong>Installation</strong></h2>

```js {3} copy
npm install aoi.js-handler
```
<h2 align="center"><strong>Setup</strong></h2>

```js {3} copy
// Import necessary modules
const { AoiClient } = require("aoi.js");
const { Handler } = require("aoi.js-handler")

// Create a new AoiClient instance
const client = new AoiClient({
  token: "Discord Bot Token",
  prefix: "Discord Bot Prefix",
  intents: ["MessageContent", "Guilds", "GuildMessages"],
  events: ["onMessage", "onInteractionCreate"],
  database: {
    type: "aoi.db",
    db: require("@akarui/aoi.db"),
    dbType: "KeyValue",
    tables: ["main"],
    securityKey: "a-32-characters-long-string-here",
  }
});

// Initialize a Handler for structured command handling
const handler = new Handler(
  {
    client: client,
    readyLog: true
  },
  {
    // Additional Handler configuration options go here
  },
  __dirname
);

// Module is now ready for use
``` 

# Useful Links
| <a href="https://github.com/aho-emi/aoi.handler" target="_blank" rel="noopener noreferrer"><p align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Octicons-mark-github.svg/2048px-Octicons-mark-github.svg.png" alt="GitHub" width="35" height="35" style="border-radius: 50%;"></p>Github - aoi.handler</a> | <a href="https://www.npmjs.com/package/aoi.handler?activeTab=readme" target="_blank" rel="noopener noreferrer"><p align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/2560px-Npm-logo.svg.png" alt="npm" width="75" height="35"></p>NPM - aoi.handler</a> | 
| ---- | ---- |
| <a href="https://aoi-handler.vercel.app" target="_blank" rel="noopener noreferrer"><p align="center"><img src="https://media.discordapp.net/attachments/902553397281030208/1137604638766530670/Untitled96_20230805101633.png" alt="docs" width="55" height="55"></p><strong>DOCS - aoi.handler</strong></a> | <a href="https://discord.gg/3vcucB8F5c" target="_blank" rel="noopener noreferrer"><p align="center"><img src="https://www.freepnglogos.com/uploads/discord-logo-png/concours-discord-cartes-voeux-fortnite-france-6.png" alt="support" width="55" height="55"></p><strong>Discord Support</strong></a> |

### **Visit docs for further information.**


## **Showcase**
### Command Loader
![command loader](https://media.discordapp.net/attachments/1029040684172333056/1185974042386243625/IMG_4470.png)

### Variable Loader
![variable loader](https://media.discordapp.net/attachments/1029040684172333056/1185974041656442900/IMG_4470.png)

### Status Loader
![status loader](https://media.discordapp.net/attachments/1029040684172333056/1185974041383809196/IMG_4470.png)

### Custom Function Loader
![function loader](https://media.discordapp.net/attachments/1029040684172333056/1185974041052463245/IMG_4470.png)


### readyLog: true 
![readyLog loading](https://media.discordapp.net/attachments/1029040684172333056/1185974042063286392/IMG_4471.png)