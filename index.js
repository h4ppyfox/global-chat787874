const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require("fs");
const db = require("quick.db");

client.on("ready", () => {
  console.log(`der global chat ist nun online!`);
  // Definiere usercount, bevor du versuchst, es zu verwenden
  let usercount = 4; // Beispielwert, ersetze dies durch den tatsächlichen Wert

  // Setze den Status des Bots mit usercount
  client.user.setActivity(`🌎 | auf ${client.guilds.cache.size} Servern, ${usercount} Usern`, { type: 'WATCHING' });
});


client.on("message", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(config.prefix)) return;
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  const command = args.shift().toLowerCase();

  //usage !global <#channel>
  
  if (command === "global") {
    const channel = message.mentions.channels.first();
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`You are missing the **MANAGE GUILD** permission!`)
    if (!channel)
      return message.channel.send(
        "1198210789044146318"
      );
    db.set(`g_${message.guild.id}`, `${channel.id}`);
    message.channel.send(`Global Chat Set to ${channel}!`);
  }
});

client.on("message", async message => {
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix)) return;
  let set = db.fetch(`g_${message.guild.id}`);
  if (message.channel.id === set) {
    const embed = new Discord.MessageEmbed()
      .setTitle("Username: " + message.author.tag)
      .addField("Message:", message.content)
      .setFooter(`Server: ${message.guild.name} || Members: ${message.guild.memberCount}`);
      message.delete();
    
    client.guilds.cache.forEach(g => {
      try {
        client.channels.cache.get(db.fetch(`g_${g.id}`)).send(embed);
      } catch (e) {
        return;
      }
    });
  }
});
const config = require("./config.json");
client.login(config.token)
