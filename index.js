const config = require('./config.json');
const Discord = require('discord.js');

const bot = new Discord.Client();

bot.on("ready", async () => {
    console.log("Bot Online")
    bot.user.setActivity("De KikkerSquad 2.0", {type: "WATCHING"})
});

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefix = config.prefix
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    if(cmd === `${prefix}help`){
        let helpembed = new Discord.RichEmbed()
        .setColor("RANDOM")
        .addField(`${prefix}cmed`, "Maakt een custom mededeling verzonden door de bot, STAFF ONLY")
        .addField(`${prefix}med`,"Maakt een Mededeling, STAFF ONLY")
        .addField(`${prefix}say`, "Verstuurd Het Berict Namens De Bot, STAFF ONLY")
        .addField(`${prefix}purge`,"Verwijderd Het Aantal Bercihten, STAFF ONLY")
        .addField(`${prefix}warn`, "Waarschuwd de gebruiker, STAFF ONLY")
        .addField(`${prefix}ban`, "Banned de gebruiker, STAFF ONLY")
        .addField(`${prefix}kick`, "Kicked de gebruiker, STAFF ONLY")
        .addField(`${prefix}report`, "Report de gebruiker")
        .addField(`${prefix}serverinfo`, "Weergeeft de server informatie")
        .addField(`${prefix}botinfo`, "Weergeeft de bot informatie")
        .addField(`${prefix}new`, "Maakt een Ticket")
        .addField(`${prefix}close`, "Sluit de ticket")

        message.delete().catch(O_o=>{});
        return message.channel.send(helpembed)
    }
    if(cmd === `${prefix}med`)
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
         let args = message.content.split(" ").slice(1).join(" ");
      let split = args.split("-");
      let url = args[2];
          message.channel.sendMessage("@everyone", {
            embed: {
              color: 0xFFFF00,
              author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
              },
              title: ":information_source: Announcement",
              description: split[0],
              url: split[1],
              timestamp: new Date(),
              footer: {
                icon_url: message.author.avatarURL,
                text: message.author.username
              }
            }
        })
      }
    
   
        if(cmd === `${prefix}cmed`)
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
         let args = message.content.split(" ").slice(1).join(" ");
      let split = args.split("-");
      let url = args[2];
          message.channel.sendMessage("@everyone", {
            embed: {
              color: 0xFF0000,
              author: {
                name: message.author.username,
                icon_url: message.author.avatarURL
              },
              title: split[0],
              description: split[1],
              url: split[2],
              timestamp: new Date(),
              footer: {
                icon_url: message.author.avatarURL,
                text: message.author.username
              }
            }
        })
    }
    
    if(cmd === `${prefix}new`){
        const reason = message.content.split(" ").slice(1).join(" ");
        if (!message.guild.roles.exists("name", "Support Staff")) return message.channel.send(`Deze server heeft geen \`Support Staff \` -rol gemaakt, dus het ticket zal niet worden geopend. \n Als u een beheerder bent, maak er dan een met die naam precies en geef deze aan gebruikers die tickets zouden moeten kunnen zien.`);
        if (message.guild.channels.exists("name", "ticket-" + message.author.id)) return message.channel.send(`Je hebt al een  open.`);
        message.guild.createChannel(`ticket-${message.author.id}`, "text").then(c => {
            let role = message.guild.roles.find("name", "Support Staff");
            let role2 = message.guild.roles.find("name", "@everyone");
            c.overwritePermissions(role, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            c.overwritePermissions(role2, {
                SEND_MESSAGES: false,
                READ_MESSAGES: false
            });
            c.overwritePermissions(message.author, {
                SEND_MESSAGES: true,
                READ_MESSAGES: true
            });
            message.channel.send(`:white_check_mark: Je ticket is gemaakt, #${c.name}.`);
            const embed = new Discord.RichEmbed()
                .setColor(0xCF40FA)
                .addField(`Hey ${message.author.username}!`, `Probeer uit te leggen waarom je dit ticket zo gedetailleerd mogelijk hebt geopend. Onze **Support Staff** zal binnenkort beschikbaar zijn om te helpen.`)
                .setTimestamp();
            c.send({
                embed: embed
            });
        }).catch(console.error); // Send errors to console
    }

    // Close ticket command
    if (cmd === `${prefix}close`) {
        if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`U kunt de command close niet gebruiken buiten een ticketkanaal.`);
        // Confirm delete - with timeout (Not command)
        message.channel.send(`Weet je het zeker? Na bevestiging kunt u deze actie niet ongedaan maken! \N Om te bevestigen, typt u \`/confirm \`. Dit zal na 10 seconden een time-out geven en worden geannuleerd.`)
            .then((m) => {
                message.channel.awaitMessages(response => response.content === '/confirm', {
                        max: 1,
                        time: 10000,
                        errors: ['time'],
                    })
                    .then((collected) => {
                        message.channel.delete();
                    })
                    .catch(() => {
                        m.edit('Ticket close timed out, het ticket was niet gesloten.').then(m2 => {
                            m2.delete();
                        }, 3000);
                    });
            });
    }
     
  if(cmd === `${prefix}say`) {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Je Hebt Geen Permissies Dit Te Doen!");
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }

  if(cmd === `${prefix}purge`) {
    // This command removes all messages from all users in the channel, up to 100.
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Je Hebt Geen Permissies Dit Te Doen!");
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Geef een aantal op tussen 2 en 100 voor het aantal berichten dat u wilt verwijderen");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Kon berichten niet verwijderen vanwege: ${error}`));
  }



    if(cmd === `${prefix}warn`){
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Je Hebt Geen Permissies Dit Te Doen!");
        let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
        if(!wUser) return message.reply("Kan Deze Gebruiker Niet Vinden");
        if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("Je kan Dit Persoon Niet Waarschuwen");
        let reason = args.join(" ").slice(22);     
            
        let warnEmbed = new Discord.RichEmbed()
        .setDescription("Warns")
        .setColor("#fc6400")
        .addField("Gewaarschuwde gebruiker", `<@${wUser.id}>`)
        .addField("Gewaarschuwd Bij",`<@${message.author.id}>`)
        .addField("Gewaarschuwd in", message.channel)
        .addField("Reden", reason);
      
        message.delete().catch(O_o=>{});

        let warnchannel = message.guild.channels.find(`name`, "modlogs");
        if(!warnchannel) return message.reply("Kan kanaal niet vindenl");
      
        warnchannel.send(warnEmbed);
    }
    


    if(cmd === `${prefix}ban`){

        //kick @deashan asking for it
        
        
        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if(!bUser) return message.channel.send("Kan De Gebruiker Niet Vinden!")
        let bReason = args.join(" ").slice(22);
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("U hebt geen permissies dit te doen!");
        if(bUser.hasPermission("ADMINISTRATOR")) return message.channel.send("Gebruiker kan niet worden gebanned!");
        
        let banEmbed = new Discord.RichEmbed()
        .setDescription("Bans")
        .setColor("RANDOM")
        .addField("Banned gebruiker", `${bUser} met ID ${bUser.id}`)
        .addField("Gebanned Bij", `<@${message.author.id}> met ID ${message.author.id}`)
        .addField("Kanaal", message.channel)
        .addField("Tijd", message.createdAt)
        .addField("Reden", bReason);
        
        
        let banChannel = message.guild.channels.find(`name`, `botlog`);
        if(!banChannel) return message.channel.send("Kan botlog kanaal niet vinden!");
        
        message.delete().catch(O_o=>{});

        message.guild.member(bUser).ban(bReason);
        banChannel.send(banEmbed);
        
         return;
        }

if(cmd === `${prefix}kick`){

//kick @deashan asking for it


let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!kUser) return message.channel.send("Kan De Gebruiker Niet Vinden!")
let kReason = args.join(" ").slice(22);
if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("U hebt geen permissies dit te doen!");
if(kUser.hasPermission("ADMINISTRATOR")) return message.channel.send("Gebruiker kan niet worden gekicked!");

let banembed = new Discord.RichEmbed()
.setDescription("Kicks")
.setColor("RANDOM")
.addField("Kicked gebruiker", `${kUser} met ID ${kUser.id}`)
.addField("Gekicked Bij", `<@${message.author.id}> met ID ${message.author.id}`)
.addField("Kanaal", message.channel)
.addField("Tijd", message.createdAt)
.addField("Reden", kReason);


let kickChannel = message.guild.channels.find(`name`, `modlogs`);
if(!kickChannel) return message.channel.send("Kan modlogs kanaal niet vinden!");


message.delete().catch(O_o=>{});

message.delete().catch(O_o=>{});

message.guild.member(kUser).kick(kReason);
kickChannel.send(kickEmbed);

 return;
}





if(cmd === `${prefix}report`){

let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!rUser) return message.channel.send("Kan De Gebruiker Niet Vinden!")
let rreason = args.join(" ").slice(22);

let reportembed = new Discord.RichEmbed()
.setDescription("Reports")
.setColor("RANDOM")
.addField("Gerapporteerde gebruiker", `${rUser} met ID ${rUser.id}`)
.addField("Geraporteerd Bij", `${message.author} met ID ${message.author.id}`)
.addField("Kanaal", message.channel)
.addField("Tijd", message.createdAt)
.addField("Reden", rreason);

let reportschannel = message.guild.channels.find(`name`, `modlogs`);
if(!reportschannel) return message.channel.send("Kan modlogs kanaal niet vinden!");


message.delete().catch(O_o=>{});
reportschannel.send(reportembed);

return;
}




if(cmd === `${prefix}serverinfo`){

    let sicon = message.guild.iconURL;
    let serverembed = new Discord.RichEmbed()
    .setDescription("Server Informatie")  
    .setColor("RANDOM")
    .setThumbnail(sicon)
    .addField("Server Naam", message.guild.name)
    .addField("Gemaakt Op", message.guild.createdAt)
    .addField("Eigenaar/Maker", message.guild.owner)
    .addField("U Bent Gejoined Op", message.member.joinedAt)
    .addField("Totaal Aantal Leden", message.guild.memberCount)

    message.delete().catch(O_o=>{});

    return message.channel.send(serverembed);
}



if(cmd === `${prefix}botinfo`){

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Informatie")
    .setColor("RANDOM")
    .setThumbnail(bicon)
    .addField("Bot Naam", bot.user.username)
    .addField("Gemaakt Op", bot.user.createdAt)
    .addField("Eigenaar", "<@!484296438054912010>")

    message.delete().catch(O_o=>{});

    return message.channel.send(botembed);
}

});

bot.login(config.token)