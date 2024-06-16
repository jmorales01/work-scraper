// message.js

export const sendMessage = async (client, channelId, messageContent) => {
    try {
        const channel = await client.channels.fetch(channelId);
        if (channel && channel.isTextBased()) {
            await channel.send(messageContent);
            console.log(`Mensaje enviado a ${channel.name}: ${messageContent}`);
        } else {
            console.log(`No se pudo enviar el mensaje. El canal con ID ${channelId} no es válido o no es un canal de texto.`);
        }
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
    }
};

export const replyMessage = async (message, replyContent) => {
    try {
        if (message.channel.isTextBased()) {
            await message.reply(replyContent);
            console.log(`Respuesta enviada a ${message.author.tag}: ${replyContent}`);
        } else {
            console.log('No se pudo responder al mensaje. El mensaje no es de un canal de texto.');
        }
    } catch (error) {
        console.error('Error al responder al mensaje:', error);
    }
};
