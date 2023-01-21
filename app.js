const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const axios = require('axios');
require('dotenv').config()

const { getToken } = require('./olt/olt.js');

const olt = process.env.OLT_IPADDR;
const bot = new Telegraf(process.env.BOT_TOKEN);
const adminList = process.env.ADMIN_LIST_ID;
xToken = "";

bot.use((ctx, next) => {
    if (adminList.indexOf(ctx.message.from.id) !== -1) {
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

bot.command('info', (ctx)=>{

    if (xToken == "") {
        xToken = getToken();
    }

    axios.get(olt + '/board?info=pon',{
        headers: {
            "X-Token": xToken
        }
    }).then((results) =>{
        console.log(results.data);
        if (results.data.message == 'Token Check Failed') {
            ctx.reply({
                chat_id: ctx.chat.id,
                text: 'Maaf terjadi kesalahan, Silahkan coba lagi',
            });
        } else {
            let info = results.data.data;
            let message = `Info Jumlah & Status Onu
        Pon ${info[0].port_id} = online : ${info[0].online}, offline : ${info[0].offline}
        Pon ${info[1].port_id} = online : ${info[1].online}, offline : ${info[1].offline}
        Pon ${info[2].port_id} = online : ${info[2].online}, offline : ${info[2].offline}
        Pon ${info[3].port_id} = online : ${info[3].online}, offline : ${info[3].offline}
        `
            ctx.reply({
                chat_id: ctx.chat.id,
                text: message,
            });
        }
        
    })
    
});

bot.command('onu', (ctx)=>{
    msg = ctx.message.text
    msgArray = msg.split(' ')
    msgArray.shift()
    onuName = msgArray.join(' ')

    if (xToken == "") {
        xToken = getToken();
    }

    axios.get(olt + '/onutable',{
        headers: {
            "X-Token": xToken
        }
    }).then(function (results) {
        let onuTable = results.data.data;
        let Found = true;
        Object.values(onuTable).find(function(val){
            if (val.macaddr.toLowerCase() == onuName.toLowerCase() || val.onu_name.toLowerCase() == onuName.toLowerCase()) {
                axios.get(olt + '/onumgmt?form=optical-diagnose&port_id='+val.port_id+'&onu_id='+val.onu_id,{
                    headers: {
                        "X-Token": xToken
                    }
                }).then(function (results) {
                    let opticalDiagnostic = results.data.data;
                    axios.get(olt + '/onumgmt?form=base-info&port_id='+val.port_id+'&onu_id='+val.onu_id,{
                        headers: {
                            "X-Token": xToken
                        }
                    }).then(function (results) {
                        let detail = results.data.data;
                        var message = "Mac Address : " + detail.macaddr + "\nJarak : " + detail.distance + " M \nStatus : " + detail.status + "\nTemperatur : " + opticalDiagnostic.work_temprature + "\nVoltage : " + opticalDiagnostic.work_voltage + "\nTx Bias : " + opticalDiagnostic.transmit_bias + "\nTx Power : " + opticalDiagnostic.transmit_power + "\nRx Power : " + opticalDiagnostic.receive_power + "\n";
                        console.log(message);
                        ctx.reply({
                            chat_id: ctx.chat.id,
                            text: message,
                        });
                    })
                })
                return Found = true;
            } else {
                return Found = false;
            }
        })

        if (!Found) {
            ctx.reply({
                chat_id: ctx.chat.id,
                text: "Maaf, " +onuName+ " tidak ditemukan",
            });
        }
        
    })
    
});


bot.launch();
