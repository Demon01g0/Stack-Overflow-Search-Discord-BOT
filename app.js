const fetch = require("node-fetch");
const { Client, MessageEmbed } = require("discord.js");

const TOKEN = process.env.TOKEN;
const client = new Client();

async function search(query) {
  let url =
    "https://api.stackexchange.com/2.2/search/advanced?order=desc&sort=relevance&accepted=True&answers=1&site=stackoverflow";
  url += "&q=" + encodeURIComponent(query);

  let res = await fetch(url);
  const json = await res.json();
  return json.items.slice(0, 10);
}

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", async (message) => {
  if (message.content.startsWith("-sos")) {
    const commandBody = message.content.substring("-sos").split(" ");
    commandBody.shift();
    const searchQuery = commandBody.join(" ");
    (async () => {
      let result = await search(searchQuery);

      let i = 1;
      let embed = new MessageEmbed()
        .setColor("#ef8236")
        .setFooter(
          "Devify Stack Overflow Search",
          "https://media.discordapp.net/attachments/816016473088720896/835144447724486696/mirage-pale.png?width=683&height=683"
        )
        .setTimestamp(new Date())
        .setTitle(`Search Results For: ${searchQuery}`);
      result.map((res) => {
        res.is_answered
          ? embed.addField(
              `${i++} - ${res.title}`,
              `[link](${res.link}) | answers count: ${res.answer_count}`
            )
          : null;
      });

      message.channel.send(embed);
    })();
  }
});

client.login(TOKEN);
