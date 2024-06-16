import { Client, GatewayIntentBits } from 'discord.js';
import { sendMessage, replyMessage } from './message.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);

    sendMessage(client, process.env.CHANNEL_UTP_JOBS_ID, 'Hola, soy un bot en prueba de Discord!');
});



client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    console.log(message.channel.id);

    if (message.content === '!ping') {
        await sendMessage(client, message.channel.id, 'Pong!');
    } else if (message.content === '!reply') {
        await replyMessage(message, '¡Hola! Soy un bot respondiendo.');
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
