// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');

module.exports = {
  name: 'apodos',
  off: true,
  start: client => {
    console.log('modulo de apodos');
  },
  handlers: [
    {
      name: 'messageCreate',
      /**
       *
       * @param {Message} message
       */
      run: async message => {
        const member = message.member;
        const toInsert = '🎩';
        if (!member || message.author.bot || !member.manageable) return;

        if (
          member.nickname.match(toInsert) ||
          (toInsert + member.nickname).length > 32
        )
          return;

        try {
          await member.setNickname(
            toInsert + (member.nickname ?? member.user.username),
          );
        } catch (error) {
          console.log(error);
        }
      },
    },
  ],
};
