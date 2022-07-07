# Discord.js

## Contents

- [Confirm](#Confirm)

### Confirm

Description: Simple confirmation interaction  
Example Usage: (gonna update later with a gif)

```ts
let embed = new MessageEmbed()
	.setTitle('Are you sure?')
	.setColor('RED')
	.setDescription('Are you sure you wanna ban this user?')
	.setAuthor({
		iconURL: msg.author.avatarURL({ size: 64 }),
		name: `${msg.author.username}#${msg.author.tag}`,
	});
new Confirm({
	context: msg,
	redBtnText: 'No',
	greenBtnText: 'Yes',
	color: 'RANDOM',
	onConfirm: (int) =>
		int.reply({ content: 'User has been banned!', ephemeral: true }),
	onDecline: (int) =>
		int.reply({ content: 'Banning  the user canceled', ephemeral: true }),
}).replyMsg({ embeds: [embed] });
```
