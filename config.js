const config = require('./config.json');

// --------------------------------
// Sanity check config
// --------------------------------
async function loadCfg()
{
    if (config == null)
    {
        throw Error('[CONFIG] Error parsing config');
    }

    if (config.rcon.address === undefined)
    {
        throw Error('[CONFIG] invalid rcon.address');
    }
    if (config.rcon.port === undefined)
    {
        throw Error('[CONFIG] invalid rcon.password');
    }
    if (config.rcon.password === undefined)
    {
        throw Error('[CONFIG] invalid rcon.password');
    }

    if (config.twitch.username === undefined)
    {
        throw Error('[CONFIG] invalid twitch.username');
    }
    if (config.twitch.oauth === undefined)
    {
        throw Error('[CONFIG] invalid twitch.oauth');
    }
    if (config.twitch.channels === undefined)
    {
        throw Error('[CONFIG] invalid twitch.channels');
    }

    if (config.chat.interval === undefined)
    {
        throw Error('[CONFIG] invalid chat.interval');
    }
    if (config.chat.delay === undefined)
    {
        throw Error('[CONFIG] invalid chat.delay');
    }
    if (config.chat.notify_subs === undefined)
    {
        throw Error('[CONFIG] invalid chat.notify_subs');
    }

    return config;
}

module.exports.loadCfg = loadCfg;