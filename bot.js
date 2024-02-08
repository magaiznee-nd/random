require("dotenv").config();
console.log("S3_BUCKET_NAME:", process.env.S3_BUCKET_NAME);

const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const axios = require("axios");
const { createImage } = require("./image.js");
const { MessageActionRow, MessageButton } = require("discord.js");

const commands = [
  {
    name: "gendocs",
    description: "랜덤추첨",
    options: [
      {
        name: "input",
        type: 3,
        description: "추첨일자 기입",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(
  "MTE4NDUzOTIzNDE0NTY2OTEyMA.GXbuya.1oqWgp0FLZvlQ_b0ITfAlPfsWbAARn2J3fzGLo"
);

(async () => {
  try {
    console.log("응용 프로그램 (/) 명령어 새로 고침을 시작했습니다.");

    await rest.put(
      Routes.applicationGuildCommands(
        "1184539234145669120",
        "1180914173937451048"
      ),
      { body: commands }
    );

    console.log("응용 프로그램 (/) 명령어를 성공적으로 다시 로드했습니다.");
  } catch (error) {
    console.error(error);
  }
})();
const { Client, Intents } = require("discord.js");
console.log(Intents);
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === "gendocs") {
    const input = interaction.options.getString("input");
    try {
      await interaction.deferReply();
      const imageUrl = await createImage({ title: input });
      const response = await axios.post("http://127.0.0.1:5000/run", {
        prmt: input,
      });
      console.log(response);
      const { MessageEmbed } = require("discord.js");
      const row = new MessageActionRow().addComponents(
        new MessageButton()
          .setURL(response.data.message)
          .setLabel("다운로드")
          .setStyle("LINK")
      );

      const embed = new MessageEmbed()
        .setTitle(`${input} 다운하기`)
        .setDescription(
          `${interaction.user.toString()}, '${input}'이 제작되었습니다.`
        )
        .setColor(0x1a05ff)
        .setImage(imageUrl)
        .setFooter({ text: "크리에이터들의 NFT 커뮤니티 ND" })
        .setURL(response.data.message);

      await interaction.followUp({ components: [row], embeds: [embed] });
      await interaction.editReply({
        content: `${interaction.user.toString()}님, 완료되었습니다!`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      await interaction.followUp({
        content: `오류가 발생했습니다: ${error.message}`,
        ephemeral: true,
      });
    }
  }
});

client.login(
  "MTE4NDUzOTIzNDE0NTY2OTEyMA.GXbuya.1oqWgp0FLZvlQ_b0ITfAlPfsWbAARn2J3fzGLo"
);
