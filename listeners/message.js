const { client } = require("../index.js")
const Discord = require("discord.js")
const { prefix, loadingColor, errorColor, successColor, neutralColor, blurple } = require("../config.json")
const { getUser } = require("../lib/mongodb")
const { crowdinVerify } = require("../lib/crowdinverify.js")
const cooldowns = new Discord.Collection()

client.on("message", async message => {

    //Stop if user is a bot
    if (message.author.bot) return

    //Delete pinned message messages
    if (message.type === "PINS_ADD" && message.channel.type !== "dm") return message.delete()

    //Publish message if sent in bot-updates
    if (message.channel.id === "732587569744838777") return message.crosspost() //bot-updates

    //Get global strings
    const author = await getUser(message.author.id)
    const globalStrings = require(`../strings/${author.lang}/global.json`)
    const helpStrings = require(`../strings/${author.lang}/help.json`)
    const executedBy = globalStrings.executedBy.replace("%%user%%", message.author.tag)

    //Link correction system
    if (message.content.toLowerCase().includes("/translate/hypixel/") && message.content.includes("://")) {
        if (message.channel.parent.id === "549503328472530977" || message.channel.parent.id === "748585307825242322" || message.channel.parent.id === "763131996163407902" || message.channel.parent.id === "646083561769926668") { //Hypixel, SkyblockAddons, Bot and Quickplay Translations
            const langFix = message.content.replace(/translate\.hypixel\.net/gi, "crowdin.com").replace(/\/en-(?!en#)[a-z]{2,4}/gi, "/en-en")
            if (/\/en(-?[a-z]{2,4})?[^#-]/gi.test(message.content)) {
                message.react("732298639736570007")
                const embed = new Discord.MessageEmbed()
                    .setColor(errorColor)
                    .setAuthor(globalStrings.wrongLink)
                    .setTitle(globalStrings.wrongStringURL)
                    .setDescription(globalStrings.example.replace("%%url%%", "https://crowdin.com/translate/hypixel/286/en-en#106644"))
                    .setImage("https://i.imgur.com/eDZ8u9f.png")
                if (message.content !== langFix && message.channel.parent.id === "549503328472530977") embed.setDescription(`${globalStrings.example.replace("%%url%%", "<https://crowdin.com/translate/hypixel/286/en-en#106644>")}\n${globalStrings.reminderLang.replace("%%format%%", "`crowdin.com/translate/hypixel/.../en-en#`")}`)
                return message.channel.send(message.author, embed)
            }
            if (message.content !== langFix && message.channel.parent.id === "549503328472530977") {
                message.react("732298639736570007")
                const embed = new Discord.MessageEmbed()
                    .setColor(errorColor)
                    .setAuthor(globalStrings.wrongLink)
                    .setTitle(globalStrings.linkCorrectionDesc.replace("%%format%%", "`crowdin.com/translate/hypixel/.../en-en#`"))
                    .setDescription(langFix)
                return message.channel.send(message.author, embed)
            }
        }
    }

    //Crowdin verification system
    if (/(https:\/\/)([a-z]{2,}\.)?crowdin\.com\/profile\/\S{1,}/gi.test(message.content)) {
        message.content = message.content.replace(/\/\/(?!www)[a-z]{2,4}\./gi, "//www.") //Change the URL to english
        crowdinVerify(message)
    }

    //Staff messaging system
    if (!message.content.startsWith(prefix) && message.author !== client.user && message.channel.type === "dm") {
        const staffMsg = new Discord.MessageEmbed()
            .setColor(neutralColor)
            .setAuthor("Incoming message from " + message.author.tag)
            .setDescription(message.content)
            .addFields({ name: "To reply", value: `\`+dm ${message.author.id} \`` })
        client.channels.cache.get("624881429834366986").send(staffMsg) //staff-bots

        const embed = new Discord.MessageEmbed()
            .setColor(successColor)
            .setAuthor(globalStrings.outgoing)
            .setDescription(message.content)
            .setFooter(globalStrings.outgoingDisclaimer)
        return message.channel.send(embed)
    }

    //Stop if the message is not a command
    if (!message.content.startsWith(prefix)) return

    //Define command and stop if none is found
    const args = message.content.slice(prefix.length).split(/ +/)
    const commandName = args.shift().toLowerCase()
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
    if (!command) return

    //Log if command is ran in DMs
    if (message.channel.type === "dm") console.log(message.author.tag + " used command " + commandName + " in DMs")

    //Return if user is not verified
    if (message.member && !message.member.roles.cache.has("569194996964786178") && command.name !== "verify") return //Verified
    else {
        const server = message.client.guilds.cache.get("549503328472530974")
        const user = server.member(message.author)
        if (!user.roles.cache.has("569194996964786178") && command.name !== "verify") return //Verified
    }

    //Role Blacklist and Whitelist system
    let allowed = true
    if (message.channel.type !== "dm") {
        if (message.guild.id === "549503328472530974") {
            if (command.roleBlacklist) {
                allowed = true
                if (allowed) {
                    command.roleBlacklist.forEach(role => {
                        if (message.member.roles.cache.has(role)) allowed = false
                    })
                }
            }
            if (command.roleWhitelist) {
                allowed = false
                if (!allowed) {
                    command.roleWhitelist.forEach(role => {
                        if (message.member.roles.cache.has(role)) allowed = true
                    })
                }
            }

            //Channel Blacklist and whitelist systems
            if (command.categoryBlacklist && command.categoryBlacklist.includes(message.channel.parent.id)) allowed = false
            else if (command.channelBlacklist && command.channelBlacklist.includes(message.channel.id)) allowed = false
            else if (command.categoryWhitelist && !command.categoryWhitelist.includes(message.channel.parent.id)) allowed = false
            else if (command.channelWhitelist && !command.channelWhitelist.includes(message.channel.id)) allowed = false

            //Prevent users from running commands in development
            if (command.dev && !message.member.roles.cache.has("764442984119795732")) allowed = false //Discord Administrato

            //Give perm to admins and return if not allowed
            if (message.member.hasPermission("MANAGE_ROLES") && command.name !== "eval") allowed = true
        } else allowed = false
    }
    if (!allowed) {
        message.react("732298639736570007")
        setTimeout(() => {
            if (!message.deleted) message.delete()
        }, 5000);
        return
    }

    //Stop and error if command is not allowed in DMs and command is sent in DMs
    if (!command.allowDM && message.channel.type === "dm") {
        const embed = new Discord.MessageEmbed()
            .setColor(errorColor)
            .setAuthor(globalStrings.error)
            .setTitle(globalStrings.errors.dmError)
            .setFooter(executedBy, message.author.displayAvatarURL())
        return message.channel.send(embed)
    }
    //Cooldown system
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }
    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 3) * 1000
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            let timeLeftS
            if (Math.ceil(timeLeft) >= 120) {
                timeLeftS = (globalStrings.minsLeftT.replace("%%time%%", Math.ceil(timeLeft / 60)).replace("%%command%%", commandName))
            } else if (Math.ceil(timeLeft) === 1) {
                timeLeftS = (globalStrings.secondLeft.replace("%%command%%", commandName))
            } else {
                timeLeftS = (globalStrings.timeLeftT.replace("%%time%%", Math.ceil(timeLeft)).replace("%%command%%", commandName))
            }
            const embed = new Discord.MessageEmbed()
                .setColor(errorColor)
                .setAuthor(globalStrings.cooldown)
                .setTitle(timeLeftS)
                .setFooter(executedBy, message.author.displayAvatarURL())
            message.channel.send(embed)
            return
        }
    }

    //Remove cooldown if administrator
    if (message.member && !message.member.hasPermission("MANAGE_ROLES")) timestamps.set(message.author.id, now)
    setTimeout(() => { timestamps.delete(message.author.id) }, cooldownAmount)

    function getString(path, cmd, lang) {
        let enStrings = require(`../strings/en/${cmd || command.name}.json`)
        try { strings = require(`../strings/${lang || author.lang}/${cmd || command.name}.json`) }
        catch { console.error(`Couldn't get command strings for the command ${cmd || command.name} on the language ${lang || author.lang}. The file does not exist yet.`) }
        const pathSplit = path.split(".")
        let string
        pathSplit.forEach(pathPart => {
            if (pathPart) {
                let jsonElement = strings[pathPart]

                if (typeof jsonElement === "object" && pathSplit.indexOf(pathPart) !== pathSplit.length - 1) { //check if the string isn't an object nor the end of the path
                    strings = strings[pathPart]
                    enStrings = enStrings[pathPart]
                    return
                } else {
                    string = jsonElement
                }
                if (!string) {
                    string = enStrings[pathPart] //if the string hasn't been added yet
                    console.error(`Couldn't get string ${path} in ${lang || author.lang} for ${cmd || command.name}, defaulting to English`)
                }
                if (!string) {
                    string = `strings.${path}` //in case of fire
                    console.error(`Couldn't get string ${path} in English for ${cmd || command.name}, please fix this`)
                }
            } else if (strings) string = strings
            else string = enStrings
        })
        return string
    }

    //Run command and handle errors
    try { await command.execute(message, args, getString) }
    catch (error) {

        //Handle errors
        timestamps.delete(message.author.id)
        const embed = new Discord.MessageEmbed()
            .setColor(errorColor)
            .setAuthor(globalStrings.error)
            .setTitle(globalStrings.errors[error] || error.message)
            .setFooter(executedBy, message.author.displayAvatarURL())
        if (!helpStrings[command.name]) {
            embed.addFields({ name: globalStrings.usage, value: "`" + command.usage + "`" })
        } else {
            embed.addFields({ name: globalStrings.usage, value: "`" + helpStrings[command.name].usage + "`" })
        }
        message.channel.stopTyping()
        message.channel.send(embed)
            .then(msg => {
                if (!globalStrings.errors[error]) console.error(`Unexpected error with command ${commandName} on channel ${message.channel.name || message.channel.type} executed by ${message.author.tag}. Here's the error:\n${error}`)
                else {
                    setTimeout(() => {
                        if (!message.deleted) message.delete()
                        if (!msg.deleted) msg.delete()
                    }, 10000);
                }
            })
        return

    } finally {

        //Try sending a tip
        if (command.allowTip !== false) {
            let d = Math.random().toFixed(2)
            let keys = Object.keys(globalStrings.tips)
            let tip = globalStrings.tips[keys[keys.length * Math.random() << 0]]
            if (d < 0.05) message.channel.send(`**${globalStrings.tip.toUpperCase()}:** ${tip.replace("%%botUpdates%%", "<#732587569744838777>").replace("%%gettingStarted%%", "<#699275092026458122>").replace("%%twitter%%", "<https://twitter.com/HTranslators>").replace("%%rules%%", "<#796159719617986610>").replace("%%serverInfo%%", "<#762341271611506708>").replace("%%bots%%", "<#549894938712866816>")}`)
        }
    }
})