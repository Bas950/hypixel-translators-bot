const {
  workingColor,
  errorColor,
  successColor,
  neutralColor,
  langdb
} = require("../config.json");
const Discord = require("discord.js");

module.exports = {
  name: "prefix",
  description: "Gives the specified user the appropriate prefix for their language(s).",
  aliases: ["langprefix", "languageprefix"],
  usage: "[user]",
  guildOnly: true,
  execute(message, args) {
    //message.delete();
    const embed = new Discord.MessageEmbed()
      .setColor(workingColor)
      .setTitle("Prefix")
      .setDescription("Your prefix is being changed... ")
      .setFooter("Executed by " + message.author.tag);
    message.channel.send(embed)
      .then(msg => {
        var prefixes = ""
        var user = message.member
        if (args) {
          user = message.guild.members.cache.get(args[0])
        }

        if (user.roles.cache.some(r => r.name.startsWith("Bulgarian"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇧🇬")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Chinese"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇨🇳")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Czech"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇨🇿")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Danish"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇩🇰")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Dutch"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇳🇱")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Finnish"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇫🇮")
        }
        if (user.roles.cache.some(r => r.name.startsWith("French"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇫🇷")
        }
        if (user.roles.cache.some(r => r.name.startsWith("German"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇩🇪")
        } if (user.roles.cache.some(r => r.name.startsWith("Greek"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇬🇷")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Italian"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇮🇹")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Japanese"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇯🇵")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Korean"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇰🇷")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Norwegian"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇳🇴")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Polish"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇵🇱")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Portuguese"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇵🇹")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Brazilian"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇧🇷")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Russian"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇷🇺")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Spanish"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇪🇸")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Swedish"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇸🇪")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Thai"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇹🇭")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Turkish"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇹🇷")
        }
        if (user.roles.cache.some(r => r.name.startsWith("Ukrainian"))) {
          if (prefixes.length > 1) {
            prefixes = (prefixes + "-")
          }
          prefixes = (prefixes + "🇺🇦")
        }
        const embed = new Discord.MessageEmbed()
          .setColor(workingColor)
          .setTitle("Prefix")
          .setDescription("Changing username with prefix(es) \`" + prefixes + "\`...")
          .setFooter("Executed by " + message.author.tag);
        msg.edit(embed)
        user.setNickname("[" + prefixes + "] " + user.username)
          .then(() => {
            const embed = new Discord.MessageEmbed()
              .setColor(successColor)
              .setTitle("Prefix")
              .setDescription("Changed username with prefix(es) \`" + prefixes + "\`.")
              .setFooter("Executed by " + message.author.tag);
            msg.edit(embed)
          })
          .catch(err => {
            const embed = new Discord.MessageEmbed()
              .setColor(errorColor)
              .setTitle("Prefix")
              .setDescription("Failed to change nickname.\n\nReason:\n> " + err)
              .setFooter("Executed by " + message.author.tag);
            msg.edit(embed)
          })
      })
  }
}
