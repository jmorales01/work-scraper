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

const sendMessageWorks = async (array) => {

    const channel = await client.channels.fetch(process.env.CHANNEL_UTP_JOBS_ID);

    const messages = array.map(work => `
        **${work.title}**
        __**Empresa :**__ ${work.company}
        __**Tipo :**__ ${work.type}
        **Lugar :** ${work.location}
        **Fecha :** ${work.created}
        **Link :** [URL del trabajo](${work.url})
        `);
        
    if (messages.length > 0) {
        for (const message of messages) {
            await channel.send(message);
        }
    } else {
        await channel.send('No new jobs found.');
    }
}


export { 
    sendMessageWorks 
}