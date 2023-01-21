const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const axios = require('axios');
require('dotenv').config();

const { infoHSGQ, onuDetail } = require('./src/olt.js');
const { saveAuth, findAuth } = require('./src/credentials.js')

const bot = new Telegraf(process.env.BOT_TOKEN);
const passChat = process.env.PASS_CHAT;

bot.command('password', (ctx)=>{
    msg = ctx.message.text
    msgArray = msg.split(' ')
    msgArray.shift()
    passLogin = msgArray.join(' ')

    if (passChat == passLogin) {
        const nama = ctx.chat.first_name;
        const telegramId = ctx.message.from.id;

        saveAuth(nama,telegramId)

        ctx.reply({
            text: "Password Benar " + ctx.message.from.id +" "+ passLogin,
        });
    } else {
        ctx.reply({
            text: "Password Salah " + ctx.message.from.id +" "+ passLogin,
        });
    }
});


bot.use((ctx, next) => {
    const telegramId = ctx.message.from.id;
    const finding = findAuth(telegramId)
    if (finding == true) {
        return next();
    } else {
        console.log(ctx.message.from.id);
        ctx.reply('Maaf Anda bukan anggota 🤭');
    }
    
  });

bot.use(async (ctx, next) => {
    ctx.message.from.id
    console.time(`Processing update ${ctx.update.update_id}`);
    await next() // runs next middleware
    // runs after next middleware finishes
    console.timeEnd(`Processing update ${ctx.update.update_id}`);
  })

bot.start((ctx) => ctx.reply('Selamat Datang'));
bot.help((ctx) => ctx.reply('Coba Kirim Sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey, ' + ctx.chat.first_name));
bot.command('delete', async (ctx) => {
    let i = 0;
    while(true) {
        try {
            await ctx.deleteMessage(ctx.message.message_id - i++);
        } catch(e) {
            break;
        }
    }
});

bot.command('info', async (ctx)=>{
    let text = await infoHSGQ();
    console.log(text);

    ctx.reply({
        chat_id: ctx.chat.id,
        text: text,
    });   
});

bot.command('onu', async (ctx)=>{
    let msg = ctx.message.text
    msgArray = msg.split(' ')
    msgArray.shift()
    let onuName = msgArray.join(' ')

    console.log('mencari '+ onuName);

    let text = await onuDetail(onuName);
    console.log(text);

    ctx.reply({
        chat_id: ctx.chat.id,
        text: text,
    });
    
});


bot.launch();
