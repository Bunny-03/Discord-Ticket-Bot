module.exports = {
  name: "close",
  category: "Ticket",
  description: "Closes The Ticket.",
  aliases: [],
  usage: "close",
  userperms: [],
  botperms: [],
  run: async (client, message, args) => {
    if (message.channel.name.includes("ticket-")) {
      const member = message.guild.members.cache.get(
        message.channel.name.split("ticket-").join("")
      );
      try {
        message.channel
          .updateOverwrite(member.user, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false,
            ATTACH_FILES: false,
            READ_MESSAGE_HISTORY: false
          })
          .then(() => {
            message.channel.send(`Successfully Closed ${message.channel}`);
          });
      } catch (e) {
        return message.channel.send("An error occurred, please try again!");
      }
    } else {
      return message.reply(
        "you cannot use this command here. Please use this command when you are closing a ticket"
      );
    }
  }
};
