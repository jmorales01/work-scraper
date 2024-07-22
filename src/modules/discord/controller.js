import { sendMessageWorks } from '../../discord/index.js';

async function message(channel_id,content) {
    // await sendMessageWorks(body)
    console.log(channel_id, content)
    return true;
}

export default { message }