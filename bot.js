const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: false});

const chatId = process.env.CHAT_ID;

async function notifyTelegram(message) {
    await bot.sendMessage(chatId, message);
}

async function alert() {
    const timeIntervals = [0, 1, 1, 1, 1, 5, 10, 30, 60, 60];
    for (const interval of timeIntervals) {
        await sleep(interval * 1000);
        await notifyTelegram('Achtung!');
    }
}

async function sendFile(file_path) {
    await bot.sendDocument(chatId, file_path);
}

module.exports = { notifyTelegram, alert, sendFile };
