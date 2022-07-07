import {
	ButtonInteraction,
	ColorResolvable,
	CommandInteraction,
	InteractionReplyOptions,
	Message,
	MessageActionRow,
	MessageButton,
	MessageOptions,
} from 'discord.js';

interface ConfirmOptions {
	redBtnText: string;
	greenBtnText: string;
	color?: ColorResolvable;
	context: Message | CommandInteraction;
	onConfirm: (interaction: ButtonInteraction) => void;
	onDecline: (Interaction: ButtonInteraction) => void;
}

export class Confirm {
	private row: MessageActionRow;
	private context: Message | CommandInteraction;
	private onConfirm: (interaction: ButtonInteraction) => void;
	private onDecline: (interaction: ButtonInteraction) => void;
	constructor({
		onConfirm,
		onDecline,
		context,
		greenBtnText,
		redBtnText,
	}: ConfirmOptions) {
		this.row = new MessageActionRow().addComponents([
			new MessageButton()
				.setStyle('SUCCESS')
				.setLabel(greenBtnText)
				.setCustomId('yes'),
			new MessageButton()
				.setStyle('DANGER')
				.setLabel(redBtnText)
				.setCustomId('no'),
		]);
		this.context = context;
		this.onConfirm = onConfirm;
		this.onDecline = onDecline;
	}
	public async replyMsg(payload: MessageOptions) {
		if (this.context instanceof CommandInteraction) {
			throw new Error('This function is only used for messages!');
		}
		let components = payload.components
			? [this.row, ...payload.components]
			: [this.row];
		let msg = await this.context.reply({
			...payload,
			components: components,
		});
		this.createCollector(msg);
	}
	public async replyInt(payload: InteractionReplyOptions) {
		if (this.context instanceof Message) {
			throw new Error('This function is only used for interactions!');
		}
		let components = payload.components
			? [this.row, ...payload.components]
			: [this.row];
		let msg = (await this.context.reply({
			...payload,
			fetchReply: true,
			components: components,
		})) as Message;
		this.createCollector(msg);
	}
	private createCollector(msg: Message) {
		let usr =
			this.context instanceof Message ? this.context.author : this.context.user;
		let collector = msg.createMessageComponentCollector({
			filter: (int) => int.user.id == usr.id,
			time: 15_000,
			max: 1,
		});
		collector.on('collect', (int) => {
			if (!int.isButton()) return;
			switch (int.customId) {
				case 'yes': {
					this.onConfirm(int);
					break;
				}
				case 'no': {
					this.onDecline(int);
					break;
				}
			}
		});
		collector.on('end', (int) => {
			msg.components.forEach((row, index) => {
				if (index != 0) return;
				row.components.forEach((button) => {
					button.setDisabled(true);
				});
			});
			msg.edit({ components: msg.components });
		});
	}
}
