const image = require('./image.js');
const konten = require('./konten.js');
const moment = require('moment');
const fetch = require('node-fetch');
const weather = require('weather-js');
const Discord = require('discord.js');
const math = require("mathjs");
const API_NEWS = "79d3cd3f35c54cb7a38dfad018237ee6";

const bot = new Discord.Client();
const TOKEN = "NzUyNTEyNzExNjA2NDAzMDcy.X1YuEw.pasMpfCD7Igfc7O-H7PEisDqCy4";



function random_item(items) {
  return items[Math.floor(Math.random()*items.length)];
}


module.exports.berita = function (msg) { 
    let keyword = msg.content.substr(13)
    fetch('http://newsapi.org/v2/top-headlines?country=id&q='+keyword+'&apiKey='+API_NEWS)
    .then(response => response.json())
    .then(data => {
      console.log(data.articles.length)
      if(data.articles.length>0){
        let artikel=random_item(data.articles)
        const embed = new Discord.MessageEmbed()
          .setColor(0x00AE86) 
          .setTitle(`${artikel.title}`)
          .setImage(`${artikel.urlToImage}`)
          .setDescription(`${artikel.description}`)
          .setFooter(`Sumber : ${artikel.url} ( ${moment(artikel.publishedAt).format('D MMMM YYYY, h:mm:ss a')} )`);
          msg.reply({embed});
      }else{
          msg.reply("Pippi gak nemu ni beritanya...");
      }
    })
    .catch(err => console.log(err))
};

module.exports.meme = function (msg) { 
    fetch('https://meme-api.herokuapp.com/gimme')
    .then(response => response.json())
    .then(data => {
      let meme=data.url
      console.log(meme)
      msg.reply("Hehe... "+meme)
      // msg.channel.send("Hehe...", {files: [(meme)]})
    })
    .catch(err => console.log(err))
};

module.exports.anime = function (msg) {
  let keyword = msg.content.substr(13)
  fetch('https://api.jikan.moe/v3/search/anime/?q='+keyword+'&limit=2')
  .then(response => response.json())
  .then(data => {
    if(data.results.length>0){
      let artikel=random_item(data.results)
      const embed = new Discord.MessageEmbed()
        .setColor(0x00AE86) 
        .setTitle(`Judul : ${artikel.title}`)
        .setImage(`${artikel.image_url}`)
        .setDescription(`Sinopsis : ${artikel.synopsis}`)
        .addField('Rating',`${artikel.score}`, true)
        .addField('Untuk Umur',`${artikel.rated}`, true)
        .addField('Status',`${artikel.airing ? 'Ongoing' : 'Tamat'}`, true)
        .setFooter(`Source : ${artikel.url}`)
        msg.reply({embed});
    }else{
        msg.reply("Pippi gak nemu ni animenya...");
    }
  })
  .catch(err => console.log(err))
}

module.exports.hug = function (msg) {
  let opt = ['iya','tidak','iya']
  if(random_item(opt) == 'iya'){
    let imgHug = image.imageHug
    const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imgHug)}`);
    msg.reply({content:'Sini Pippi peluk...' ,embed});
    // msg.reply("Sini Pippi peluk... "+[random_item(imgHug)])
    // msg.channel.send("Sini Pippi peluk...", {files: [random_item(imgHug)]});
  }else{
    let imgHug = image.imageTsun
    const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imgHug)}`);
    msg.reply({content:'Nggak mau...' ,embed});
    // msg.reply("Nggak mau... "+[random_item(imgHug)])
    // msg.channel.send("Nggak mau...", {files: [random_item(imgHug)]});
  }
}

module.exports.pantun = function (msg) {
    pantun = konten.pantun
    msg.channel.send([random_item(pantun)]);
}

module.exports.kiss = function (msg) {
  let opt = ['iya','tidak','tidak']
  if(random_item(opt) == 'iya'){
    let imgKiss = image.imageKiss
    let imgHug = image.imageTsun
    const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imgKiss)}`);
    msg.reply({content:'Sini Pippi cium...' ,embed});
    // msg.channel.send("Sini Pippi cium...", {files: [random_item(imgKiss)]});
  }else{
    let imgKiss = image.imageTsun
    const embed = new Discord.MessageEmbed()
              .setColor(0x00AE86)
              .setImage(`${random_item(imgKiss)}`);
    msg.reply({content:'Nggak mau...' ,embed});
    // msg.channel.send("Nggak mau...", {files: [random_item(imgKiss)]});
  }
}

module.exports.cuaca = function (msg) {
  let kota = msg.content.substr(12);
  console.log(kota)
  weather.find({search: kota, degreeType: 'C'}, function(err, result) {
    // if (err) msg.channel.send(err);
    if (err) {
        msg.channel.send('Pippi gak tau sama kotanya..')
        return; 
    }
    if(result.length>0){
      let current = result[0].current;
      let location = result[0].location; 

      const embed = new Discord.MessageEmbed()
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Cuaca untuk ${current.observationpoint}`)
          .setThumbnail(current.imageUrl) 
          .setColor(0x00AE86) 
          .addField('Zona Waktu',`UTC+${location.timezone}`, true)
          .addField('Tipe Derajat',location.degreetype, true)
          .addField('Temperatur',`${current.temperature} Derajat`, true)
          .addField('Terasa Seperti', `${current.feelslike} Derajat`, true)
          .addField('Kecepatan Angin',current.winddisplay, true)
          .addField('Kelembapan', `${current.humidity}%`, true)

          msg.reply({embed});
    }else{
      msg.channel.send('Pippi gak tau sama kotanya..')
      return;
    }
  });
}

module.exports.hitung = function (msg) {
  let str = msg.content.substr(1);
  let total=0;
  // let operator = str.match(/[\(\)\+\-\*\/\.]/g, '');
  // if(operator==null){
  //   msg.reply("Pippi pusing.., coba lagi ya ~")
  // }else if(operator.length>1){
  //   msg.reply("Pippi cuma bisa 2 digit aja ~~")
  // }else{
    let number = str.match(/[\d\(\)\+\-\*\/\.]/g, '');
    let tostr = number.toString()
    let del = tostr.split(",").join("")
    total = math.evaluate(del)
    // console.log(total)
    // let split = del.split(operator)
    // if(operator=='+'){
    //   total = parseInt(split[0])+parseInt(split[1])
    // }else if(operator=='-'){
    //   total = split[0]-split[1]
    // }else if(operator=='/'){
    //   total = split[0]/split[1]
    // }else if(operator=='*'){
    //   total = split[0]*split[1]
    // }
    msg.reply("Jawabannya adalah... "+total)
  // }
}