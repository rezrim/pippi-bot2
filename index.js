const express = require('express');
const request = require('request');
const Canvas = require('canvas');
const { registerFont } = require('canvas');
const Discord = require('discord.js');
const serp = require("serp");
const axios = require('axios')
const bodyParser = require('body-parser')
const translate = require("googletrans").default;

const image = require('./image.js');
const action = require('./function');

var cors = require('cors')
var routeSaya = require('./route/route')

require('dotenv').config();

const app = express();
const port = 8000;

// app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(routeSaya)

const bot = new Discord.Client();
const TOKEN = "NzUyNTEyNzExNjA2NDAzMDcy.X1YuEw.pasMpfCD7Igfc7O-H7PEisDqCy4";

let queue=[]
let isPlaying=false
let dispatcher=null
let voiceChannel=null
let skipReq=0
let skippers=[]
let timeoutID;
let timeOutTrigger;
let guildPippi="746013645166739506"
let channelPippi="753520236870762496"
let channelPengumuman="746059028106575872"
let guildTester="746639963658911765"
let channelTester="746639963658911768"
let channelTrash="746655798872113222"
let channelRuangTengah="746042552125227038"



registerFont('fonts/OpenSans-Regular.ttf', { family: 'regular' });
registerFont('fonts/OpenSans-Bold.ttf', { family: 'fontBold' });

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/pengumumanCollab', (req, res) => {
  let link = req.body.link
  let collab = req.body.collab
  let guild = bot.guilds.cache.get(guildPippi);
  if(guild && guild.channels.cache.get(channelPippi)){
    guild.channels.cache.get(channelPippi).send("Halo @everyone" + ", Hari ini **Umi&Shio** ada Collab loh sama **"+collab+"**. Untuk linknya, bisa dicek disini ya : "+link);
  }
  res.send('Hello World!')
});

app.post('/ngingetinLive', (req, res) => {
  let link = req.body.link
  let guild = bot.guilds.cache.get(guildPippi);
  if(guild && guild.channels.cache.get(channelPippi)){
    guild.channels.cache.get(channelPippi).send("Pippi mau nonton **Umi&Shio** Live Stream dulu ya.. kalo mau liat pippi, mampir ya... Untuk linknya, bisa dicek disini: "+link);
  }
  res.send('Hello World!')
});

// bot.on('voiceStateUpdate', (oldState, newState) => {
//   let newUserChannel = newState.channelID
//   let oldUserChannel = oldState.channelID
//   // var channel = client.channels.get('746639963658911765');
//   let guild = bot.guilds.cache.get(guildTester);
//   if(newUserChannel != null) {
//     axios
//     .post('http://localhost:8000/savenew', {
//       id_member: newState.id,
//       id_channel : newUserChannel,
//     })
//     .then(res => {
//       // guild.channels.cache.get(channelTester).send(newState.member.displayName+", masuk Voice Channel "+newState.channel.name+" udah "+res.data.jumlah+"x");
//     })
//     .catch(error => {
//       console.error(error)
//     })
//   }else if(oldUserChannel != null){
//     axios
//     .post('http://localhost:8000/saveold', {
//       id_member: newState.id,
//     })
//     .then(res => {
//       // guild.channels.cache.get(channelTester).send("Total waktu "+newState.member.displayName+" masuk Voice Channel adalah "+res.data.waktu+" detik");
//     })
//     .catch(error => {
//       console.error(error)
//     })
//   }
// })

app.post('/pippiSay', (req, res) => {
  // console.log(req.body)
  let say = req.body.say
  let guild = bot.guilds.cache.get(guildPippi);
  if(guild && guild.channels.cache.get(channelPippi)){
    guild.channels.cache.get(channelPippi).send(say);
  }
  res.send('Hello World!')
});

// app.get('/dailypagi', (req, res) => {
//   let guild = bot.guilds.cache.get(guildPippi);
//   if(guild && guild.channels.cache.get(channelPippi)){
//     guild.channels.cache.get(channelPippi).send("Selamat Pagi pippi.. UwU");
//   }
//   setTimeout(() => {
//       let guild = bot.guilds.cache.get(guild);
//       if(guild && guild.channels.cache.get(channelPippi)){
//         guild.channels.cache.get(channelPippi).send("Selamat Pagi pippi.. UwU");
//       }
//     }, 24*60*60*1000)
//     res.send('Hello World!')
// });

// app.get('/dailymalam', (req, res) => {
//   let guild = bot.guilds.cache.get(guildPippi);
//   if(guild && guild.channels.cache.get(channelPippi)){
//     guild.channels.cache.get(channelPippi).send("Selamat Pagi pippi.. UwU");
//   }
//   setTimeout(() => {
//       let guild = bot.guilds.cache.get(guild);
//       if(guild && guild.channels.cache.get(channelPippi)){
//         guild.channels.cache.get(channelPippi).send("Selamat Pagi pippi.. UwU");
//       }
//     }, 24*60*60*1000)
//     res.send('Hello World!')
// });

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));



bot.login(TOKEN);

function random_item(items) {
  return items[Math.floor(Math.random()*items.length)];
}

bot.on('ready', () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

bot.on("error", (e) => console.error(e));
bot.on("warn", (e) => console.warn(e));
bot.on("debug", (e) => console.info(e));

bot.on('guildMemberAdd', async member => {
  // console.log("ok")
  const channel = member.guild.channels.cache.find(ch => ch.name === '🔔pintu-depan');
	if (!channel) return;

	const canvas = Canvas.createCanvas(700, 300);
	const ctx = canvas.getContext('2d');

	const background = await Canvas.loadImage('./wallpaper.jpg');
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.font = '28px regular';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = "center";
  ctx.fillText(`Selamat Datang`, canvas.width / 2, canvas.height / 1.35);
  
  ctx.font = 'bold 36px fontBold';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = "center";
	ctx.fillText(`${member.displayName}!`, canvas.width / 2, canvas.height / 1.1);

	ctx.beginPath();
  ctx.arc(350, 100, 80, 0, Math.PI * 2, true);
  ctx.stroke();
	ctx.closePath();
	ctx.clip();

	const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'jpg' }));
  ctx.drawImage(avatar, 250, 5, 200, 200);

	const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');

	channel.send(`Selamat datang ${member} di ~ GGWS Home ~ Pippi.. :blush:\nAyo berinteraksi dengan para GGWS yang lain agar saling kenal. Karena tak kenal maka tak sayang Pippi.. :hugging::hugging:\n\nPastikan untuk membaca dan memahami rules server yang tertera di <#746034071322361986> dan memperkenalkan diri di <#756846736688939048> dulu ya untuk membuka semua Channel yang ada\n\nWelcome ${member} in ~ GGWS Home ~ Pippi.. :blush:\nLet's interact with other GGWS to get to know each other Pippi.. :hugging::hugging:\n\nMake sure to read and understand the server rules listed on <#746034071322361986> and introduce yourself at <#756846736688939048> first to open all existing channels`, attachment);
  member.roles.add(member.guild.roles.cache.find(role => role.name === "Newman"));
  member.send("Selamat Datang di ~ GGWS Home ~ 💖 💖 💖\nPastikan untuk membaca dan memahami rules yang tertera pada <#746034071322361986> dan memperkenalkan diri di <#756846736688939048> dulu ya untuk membuka semua Channel yang ada\nSelamat bersenang-senang pippi UwU\n\n\nWelcome to ~ GGWS Home ~ 💖 \nMake sure to read and understand the rules listed on <#746034071322361986> and introduce yourself at <#756846736688939048> first to open all existing channels \nHave fun pippi UwU");
});


bot.on('guildMemberRemove', async member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === '🔔pintu-depan');
	if (!channel) return;

  channel.send(`Yah.., ${member.displayName} mau pergi ya ? Sampai Jumpa, Para GGWS akan merindukan kamu..`);
});


bot.on('message', async(msg) => {
  let n = msg.content.search(/-pippi/i);
  if(n>-1){
    
    clearTimeout(timeoutID)
    timeoutID = undefined
    clearTimeout(timeOutTrigger)
    timeOutTrigger = undefined

    if (msg.content === 'halo -pippi' || msg.content === '-pippi' || msg.content === 'halo -pippi') {
      msg.reply('iya Pippi ? kamu mau nanya apa ? (Pippi cuma bisa jawab ya atau tidak)');
    }else if(msg.content !== 'halo -pippi'){
        if(msg.author.username!=="Pippi"){
          let m = msg.content.search("sehat");
          let l = msg.content.search("kabar");
          let k = msg.content.search("terimakasih");
          let j = msg.content.search("siapa");
          let i = msg.content.search("suara");
          let h = msg.content.search("hitung");
          let g = msg.content.search("salam kenal");
          let f = msg.content.search(/umi/i);
          let e = msg.content.search(/shio/i);
          let d = msg.content.search("jempol");
          let c = msg.content.search("cuaca");
          let b = msg.content.search("peluk");
          let a = msg.content.search("ngantuk");
          let o = msg.content.search("berita");
          let p = msg.content.search("anime");
          let q = msg.content.search(/oyasumi/i);
          let r = msg.content.search(/ohayou/i);
          let s = msg.content.search("udah");
          let t = msg.content.search("cium");
          let u = msg.content.search("kenapa");
          let v = msg.content.search("semangat");
          let w = msg.content.search("pagi");
          let x = msg.content.search("bercanda");
          let y = msg.content.search("malam");
          let z = msg.content.search("kangen");
          let aa = msg.content.search("makasih");
          let ab = msg.content.search("thank");
          let meme = msg.content.search("meme");
          let pilih = msg.content.search("pilih");
          let mplay = msg.content.search("play");
          let mskip = msg.content.search("skip");
          let pantun = msg.content.search("pantun");
          let cari = msg.content.search("cari");
          let trans = msg.content.search("translate");
          let forpippi = msg.content.search("ini buat -pippi")
          let game = msg.content.search("game")
          let voiceTime = msg.content.search(/cek waktu voice/i)
          let voiceCount = msg.content.search(/cek banyak voice/i)
          let motivasi = msg.content.search("motivasi");

          if(o>-1){
            action.berita(msg)
          }else if(m>-1 || l>-1){
            msg.reply("Pippi selalu sehat ko.., semoga kamu juga sehat ya pippi..");
          }else if(pilih>-1){
            let str1=msg.content;
            let pattern="atau";
            let str2="";
            let str3=""
            if(str1.indexOf(pattern)>=0)
            {
              let getstr2 = str1.substr(str1.indexOf(pattern)+pattern.length, str1.length);
              let getstr3 = str1.substr(0, str1.indexOf(pattern));
              
              str2 = getstr2.replace('?','');
              str3 = getstr3.replace('-pippi pilih','');
              let val = [str2,str3]
              let random = [random_item(val)]
              msg.reply("Menurut pippi : " +random);
            }else{
              msg.reply("Pake 'atau' dong pippi.. ");
            }
          }else if(cari>-1){
            let keyword = msg.content.substr(12)
            let options = {
              host : "google.com",
              qs : {
                q : keyword,
                filter : 0,
                pws : 0
              },
              num : 1
            };
            const links = await serp.search(options);
            msg.reply("Bisa kamu cari disini pippi : \n"+links[0].url);
          }else if(trans>-1){
            let keyword = msg.content.substr(17)
            console.log(keyword)
            translate(keyword,'en').then(function(res){
              msg.reply("Ini translatenya pippi.. : \n"+res.text);
            }).catch(err => {
                console.error(err)
            })
            
          }else if(p>-1){
            action.anime(msg)
          }else if(game>-1){
            msg.reply("Masuk ke link ini ya.., https://eventdecember.netlify.app/?i="+msg.member.id+"&u="+msg.member.displayName)
            .then(mesg => {
              mesg.delete({ timeout: 10000 })
            })
            .catch((error) => {
              console.log(error)
            });
          }else if(k>-1 || aa>-1 || ab>-1){
            msg.reply("Sama-sama pippi...");
          }else if(j>-1){
            msg.reply("Aku Pippi.., peliharaannya Gema Gathika");
          }else if(forpippi>-1){
            msg.reply("Terimakasih Pippi >.<");
          }
          // else if(i>-1){
          //   if (msg.member.voice.channel) {
          //     const connection = await msg.member.voice.channel.join();
              
          //     let oni = msg.content.search(/oni/i);
          //     let ohayou = msg.content.search(/ohayou/i)
          //     let tuturu = msg.content.search(/tuturu/i)
          //     let padoru = msg.content.search(/padoru/i)
          //     let oyasumi = msg.content.search(/oyasumi/i)
          //     let warudo = msg.content.search(/warudo/i)
          //     let ara = msg.content.search(/araara/i)
          //     let uwu = msg.content.search(/uwu/i)
          //     let chi = msg.content.search(/chi/i)
          //     let ganbatte = msg.content.search(/ganbatte/i)
          //     let nya = msg.content.search(/nya/i)
          //     let nande = msg.content.search(/nande/i)

        
          //     if(ohayou>-1){
          //       if(oni>-1){
          //         let dispatcher = connection.play('./sound/ohayou_oni.mp3');
          //         dispatchSound(dispatcher, connection)
          //       }else{
          //         let dispatcher = connection.play('./sound/ohayou.mp3');
          //         dispatchSound(dispatcher, connection)
          //       }
                
          //     }else if(tuturu>-1){
          //       let dispatcher = connection.play('./sound/tuturu.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(nande>-1){
          //       let dispatcher = connection.play('./sound/nande.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(oyasumi>-1){
          //       let dispatcher = connection.play('./sound/oyasumi.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(warudo>-1){
          //       let dispatcher = connection.play('./sound/zawarudo.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(uwu>-1){
          //       let dispatcher = connection.play('./sound/uwu.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(chi>-1){
          //       let dispatcher = connection.play('./sound/chi.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(ganbatte>-1){
          //       let dispatcher = connection.play('./sound/ganbatte.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(padoru>-1){
          //       let dispatcher = connection.play('./sound/padoru.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(nya>-1){
          //       let dispatcher = connection.play('./sound/nya.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else if(containsWord(msg.content, "ara")!=null){
          //       let dispatcher = connection.play('./sound/araarav2.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }else{
          //       let dispatcher = connection.play('./sound/pippi.mp3');
          //       dispatchSound(dispatcher, connection)
          //     }

              
          //   }
          // }
          else if(g>-1){
            msg.reply("Selama kenal juga Pippi..");
          }else if(q>-1){
            msg.reply("Oyasumi juga Pippi..");
          }else if(z>-1){
            msg.reply("Pippi kangen juga ko...");
          }else if(d>-1){
            msg.reply(":thumbsup:");
          }else if(r>-1){
            msg.reply("Ohayou Pippi...");
          }else if(u>-1){
            msg.reply("Gpapa ko Pippi...");
          }else if(v>-1){
            msg.reply("Pippi selalu semangat ko.., kamu juga semangat ya.. ");
          }else if(s>-1){
            let opt = ['Udah dong..','Belum Pippi..']
            msg.reply(random_item(opt));
          }else if(b>-1){
            action.hug(msg)
          }else if(t>-1){
            action.hug(msg)
          }else if(a>-1){
            let imgSleepy = image.imageSleepy
            const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imgSleepy)}`);
            msg.reply({content:'Hoamzz...' ,embed});

            // msg.reply("Hoamzz... "+random_item(imgSleepy));
            // msg.reply("Hoamzz...", {files: [random_item(imgSleepy)]});
          }else if(c>-1){
            action.cuaca(msg)
          }else if(h>-1){
            action.hitung(msg)
          }else if(pantun>-1){
            action.pantun(msg)
          }else if(w>-1){
            msg.reply("Selamat pagi juga Pippi UwU");
          }else if(y>-1){
            msg.reply("Selamat malam Pippi..");
          }else if(x>-1){
            let imageJokes = image.imageJokes
            const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imageJokes)}`);
            msg.reply({content:'UwU...' ,embed});
            // msg.reply("UwU... "+random_item(imageJokes));
            // msg.channel.send("UwU", {files: [random_item(imageJokes)]});
          }else if(motivasi>-1){
            let imageMotivation = image.imageMotivation
            const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imageMotivation)}`);
            msg.reply({content:'Ganba...' ,embed});
            // msg.reply("Ganba... "+random_item(imageMotivation));
            // msg.channel.send("Ganba..", {files: [random_item(imageMotivation)]});
          }else{
            let answer=["iya Pippi..","tidak Pippi.."]
            msg.reply(random_item(answer));

            timeOutTrigger = setTimeout(() => {
            let answer=[1,2,3,4,5,6,7,8]
            let pilih=random_item(answer)
            if(pilih==4){
              
              msg.reply("Tapi bo'ong.., tehe.. 😜");
            }
            }, 3*1000)
          }
        }
    }
    // timeoutID = setTimeout(() => {
    //   let guild = bot.guilds.cache.get("746013645166739506");
    //   if(guild && guild.channels.cache.get("753520236870762496")){
    //     guild.channels.cache.get("753520236870762496").send("Kalian kemana ? pippi kangen kalian :frowning:");
    //   } else {
    //     res.status(404).send('Couldn\'t find the channel or guild');
    //   }
    // }, 6*60*60*1000)
  }else{
    let guild = bot.guilds.cache.get(guildPippi);
    if(guild && msg.channel.name=="🤝perkenalan-diri"){
      if(msg.author.username!=="Pippi"){
        let snama = msg.content.search(/name/i);
        let shobby = msg.content.search(/hobby/i);
        let spanggilan = msg.content.search(/nick/i);
        if(snama>-1 && shobby>-1 && spanggilan>-1){
          const user = msg.author;

          const channel2 = bot.channels.cache.find(channel => channel.id === channelRuangTengah)
          channel2.send(`${user}, Selamat Datang pippi.. UwU`)
          
          //msg.reply("Selamat Datang pippi.. UwU");
          let member = msg.member
          let role = msg.guild.roles.cache.find(role => role.name === "Sahabat Baru");
          let roleRemove = msg.guild.roles.cache.find(role => role.name === "Newman");
          member.roles.add(role);
          member.roles.remove(roleRemove)
        }else{
          msg.reply("masih ada yang kurang pippi.. : \n Name : \n Nickname : \n Hobby : ");
        }
      }
    }
  }
});


// function playMusic(id, message){
//   // console.log(message.member)
//   voiceChannel = message.member.voice.channel
  
//   voiceChannel.join().then(function (connection){
//     stream=ytdl("https://www.youtube.com/watch?v="+id,{
//       filter:'audioonly'
//     })
//     // console.log(stream)
//     skipReq=0
//     skippers=[]
//     dispatcher=connection.play(stream)
//     dispatcher.on('end', function () {
//       skipReq=0
//       skippers=[]
//       queue.shift()
//       if(queue.length==0){
//         queue=[]
//         isPlaying=false
//       }else{
//         playMusic(queue[0], message)
//       }
//     })
//   })
  
// }

// function dispatchSound(dispatcher, connection){
//   dispatcher.on('start', () => {
//   console.log('audio.mp3 is now playing!');
//   });

//   dispatcher.on('finish', () => {
//     connection.disconnect();
//   });

//   dispatcher.on('error', console.error);
// }

function containsWord(str, word) {
  console.log(str.match(new RegExp("\\b" + word + "\\b")))
  return str.match(new RegExp("\\b" + word + "\\b"));
}

// function getVoiceTime(id_member,msg){
//   axios
//     .post('http://localhost:8000/voiceTime', {
//       id_member: id_member,
//     })
//     .then(res => {

//       msg.reply("total lama Voice Channel kamu adalah "+secondsToHms(res.data.waktu));
//     })
//     .catch(error => {
//       console.error(error)
//     })
// }

function secondsToHms(d) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor(d % 3600 / 60);
  var s = Math.floor(d % 3600 % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? " jam, " : " jam, ") : "";
  var mDisplay = m > 0 ? m + (m == 1 ? " menit, " : " menit, ") : "";
  var sDisplay = s > 0 ? s + (s == 1 ? " detik" : " detik") : "";
  return hDisplay + mDisplay + sDisplay; 
}