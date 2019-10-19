# twitch-chat-tf2

A simple twitch chat to TF2 chat node.js app.

## Install:  
- Grab Node: https://nodejs.org/en/
- ```npm i```

## Config:  
- Edit **config.json** to your preferred configuration.
- `rcon.address` should be your LAN ip, you may need to add `+ip <lan_ip>` to your launch options. Using `+ip 127.0.0.1` launch option will prevent you from joining other servers.
- See https://twitchtokengenerator.com for easy token. You only need Helix chat:read scope. 
- **Note:** this app does not automatically refresh tokens.
  
## Running:  
- Launch TF2
- `-usercon` **must** be included in TF2 launch options and a map must be loaded to start listening to rcon. The easiest way is to just add `+map itemtest` to launch options.
- ```npm start```
