const client = require("../index");
const { EmbedBuilder } = require("discord.js");
const { escapeRegex } = require("../utils/functions");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  client.settings.ensure(message.guild.id, {
    prefix: client.config.prefix,
  });

  message.prefix = client.settings.get(message.guild.id, "prefix");

  const prefixRegex = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(message.prefix)})\\s*`
  );

  if (!prefixRegex.test(message.content)) return;

  const [, mPrefix] = message.content.match(prefixRegex);

  const [cmd, ...args] = message.content
    .slice(mPrefix.length)
    .trim()
    .split(/ +/);

  if (cmd.length === 0) {
    if (mPrefix.includes(client.user.id)) {
      return message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: "*honk*",
              iconURL:
                "https://media.discordapp.net/attachments/978525658449862676/1005311836754825216/goose_emoji.png",
            })
            .setDescription(
              `My prefix here is \`${message.prefix}\`. Use \`${message.prefix}help\` to see all my commands.`
            )
            .setColor(client.config.color),
        ],
      });
    }
  }

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  try {
    await command.run(client, message, args);
  } catch (err) {
    console.log(err);
  }
});
