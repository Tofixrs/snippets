import {
	ButtonInteraction,
	CommandInteraction,
	InteractionReplyOptions,
	Message,
	ActionRowBuilder,
	ButtonBuilder,
	BaseMessageOptions,
	ButtonStyle,
} from 'discord.js';

interface ConfirmOptions {
	redBtnText: string;
	greenBtnText: string;
	context: Message | CommandInteraction;
	onConfirm: (interaction: ButtonInteraction) => void;
	onDecline: (Interaction: ButtonInteraction) => void;
}

export class Confirm {
	private row: ActionRowBuilder;
	private context: Message | CommandInteraction;
	private onConfirm: (interaction: ButtonInteraction) => void;
	private onDecline: (interaction: ButtonInteraction) => void;
	private greenBtnText: string;
	private redBtnText: string;
	constructor({
		onConfirm,
		onDecline,
		context,
		greenBtnText,
		redBtnText,
	}: ConfirmOptions) {
		this.redBtnText = redBtnText;
		this.greenBtnText = greenBtnText;
		this.row = new ActionRowBuilder().addComponents([
			new ButtonBuilder()
				.setStyle(ButtonStyle.Success)
				.setLabel(this.greenBtnText)
				.setCustomId('yes'),
			new ButtonBuilder()
				.setStyle(ButtonStyle.Danger)
				.setLabel(this.redBtnText)
				.setCustomId('no'),
		]);
		this.context = context;
		this.onConfirm = onConfirm;
		this.onDecline = onDecline;
	}
	public async reply(payload: BaseMessageOptions | InteractionReplyOptions) {
		let components = payload.components
			? [this.row, ...payload.components]
			: [this.row];
		let msg =
			this.context instanceof Message
				? await this.context.reply({
						...(payload as BaseMessageOptions),
						//@ts-ignore d.js make ur fucking typings work
						components: components,
				  })
				: ((await this.context.reply({
						...(payload as InteractionReplyOptions),
						//@ts-ignore d.js make ur fucking typings work
						components: components,
						fetchReply: true,
				  })) as Message);
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
		collector.on('end', async (_) => {
			let row = new ActionRowBuilder().addComponents([
				new ButtonBuilder()
					.setStyle(ButtonStyle.Success)
					.setLabel(this.greenBtnText)
					.setCustomId('yes')
					.setDisabled(true),
				new ButtonBuilder()
					.setStyle(ButtonStyle.Danger)
					.setLabel(this.redBtnText)
					.setCustomId('no')
					.setDisabled(true),
			]);
			//@ts-ignore d.js make ur fucking typings work
			msg.components[0] = row;
			if (this.context instanceof CommandInteraction) {
				this.context.editReply({ components: msg.components });
				return;
			}
			msg.edit({ components: msg.components });
		});
	}
}
