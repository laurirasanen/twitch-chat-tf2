const config = require('./config.js');
const rcon = require('rcon');
const twitch = require('twitch-bot');

config.loadCfg().then(cfg =>
{
    var conn = new rcon(cfg.rcon.address, cfg.rcon.port, cfg.rcon.password);
    var bot = new twitch(
        {
            username: cfg.twitch.username,
            oauth: cfg.twitch.oauth,
            channels: cfg.twitch.channels
        }
    );
    var active = false;
    var messages = [];
    var subs = [];

    // --------------------------------
    // Handle queued messages
    // --------------------------------
    function loopMessages()
    {
        if (active)
        {
            if (subs.length > 0)
            {
                if (subs[0].message !== null)
                {
                    conn.send(`${subs[0].system_msg} : ${subs[0].message}`);
                }
                else
                {
                    conn.send(`${subs[0].system_msg}`);
                }

                sub.splice(0, 1);
            }
            else if (messages.length > 0)
            {
                var tag = '';

                if (messages[0].mod && messages[0].subscriber)
                {
                    tag = '[M|S] ';
                }
                else if (messages[0].username === 'pancakelarry')
                {
                    tag = '[COOL] ';
                }
                else if (messages[0].mod)
                {
                    tag = '[M] ';
                }
                else if (messages[0].subscriber)
                {
                    tag = '[S] ';
                }

                conn.send(`say "${tag}${messages[0].display_name}: ${messages[0].message}"`);
                messages.splice(0, 1);
            }

            // TF2 chat is rate limited
            setTimeout(() =>
            {
                loopMessages();
            }, cfg.chat.interval);
        }
    }

    // --------------------------------
    // Twitch callbacks
    // --------------------------------
    bot.on('join', (channel) =>
    {
        console.log(`[TWITCH] Joined ${channel}`);

    }).on('message', (chatter) =>
    {
        if (chatter.user_type === 'bot')
        {
            return;
        }

        console.log(`[TWITCH] ${chatter.display_name}: ${chatter.message}`);

        setTimeout(() =>
        {
            messages.push(chatter);
        }, cfg.chat.delay);

    }).on('subscription', (sub) =>
    {
        if (sub.message !== null)
        {
            console.log(`[TWITCH] ${sub.system_msg}: ${sub.message}`);
        }
        else
        {
            console.log(`[TWITCH] ${sub.system_msg}`);
        }

        if (cfg.chat.notify_subs)
        {
            setTimeout(() =>
            {
                subs.push(sub);
            }, cfg.chat.delay);
        }

    }).on('error', err =>
    {
        console.log(`[TWITCH] error:\n${err}`);
    });

    conn.on('auth', () =>
    {
        active = true;
        console.log('[RCON] Authenticated!');
        loopMessages();

    }).on('response', (str) =>
    {
        if (str.length !== 0)
        {
            console.log('[RCON] Received response: ' + str);
        }

    }).on('end', () =>
    {
        active = false;
        console.log('[RCON] Socket closed!');

    }).on('error', (err) =>
    {
        active = false;
        if (err.code === 'ECONNREFUSED')
        {
            console.log(`[RCON] Could not connect to ${conn.host}:${conn.port}! Retrying in 5 seconds.`);

            // Try to reconnect
            setTimeout(() =>
            {
                conn.connect();
            }, 5000);
        }
        else
        {
            console.log('[RCON] Encountered unhandled error!');
            console.log(err);
        }
    });

    // --------------------------------
    // Connect and join channels
    // --------------------------------
    conn.connect();

    for (var i = 0; i < cfg.twitch.channels.length; i++)
    {
        bot.join(cfg.twitch.channels[i]);
    }

}).catch(err =>
{
    console.log(err);
});