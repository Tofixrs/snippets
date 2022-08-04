"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Confirm = void 0;
const discord_js_1 = require("discord.js");
class Confirm {
    row;
    context;
    onConfirm;
    onDecline;
    greenBtnText;
    redBtnText;
    constructor({ onConfirm, onDecline, context, greenBtnText, redBtnText, }) {
        this.redBtnText = redBtnText;
        this.greenBtnText = greenBtnText;
        this.row = new discord_js_1.ActionRowBuilder().addComponents([
            new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Success)
                .setLabel(this.greenBtnText)
                .setCustomId("yes"),
            new discord_js_1.ButtonBuilder()
                .setStyle(discord_js_1.ButtonStyle.Danger)
                .setLabel(this.redBtnText)
                .setCustomId("no"),
        ]);
        this.context = context;
        this.onConfirm = onConfirm;
        this.onDecline = onDecline;
    }
    async reply(payload) {
        let components = payload.components
            ? [this.row, ...payload.components]
            : [this.row];
        let msg = this.context instanceof discord_js_1.Message
            ? await this.context.reply({
                ...payload,
                //@ts-ignore d.js make ur fucking typings work
                components: components,
            })
            : (await this.context.reply({
                ...payload,
                //@ts-ignore d.js make ur fucking typings work
                components: components,
                fetchReply: true,
            }));
        this.createCollector(msg);
    }
    createCollector(msg) {
        let usr = this.context instanceof discord_js_1.Message ? this.context.author : this.context.user;
        let collector = msg.createMessageComponentCollector({
            filter: (int) => int.user.id == usr.id,
            time: 15_000,
            max: 1,
        });
        collector.on("collect", (int) => {
            if (!int.isButton())
                return;
            switch (int.customId) {
                case "yes": {
                    this.onConfirm(int);
                    break;
                }
                case "no": {
                    this.onDecline(int);
                    break;
                }
            }
        });
        collector.on("end", async (_) => {
            let row = new discord_js_1.ActionRowBuilder().addComponents([
                new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Success)
                    .setLabel(this.greenBtnText)
                    .setCustomId("yes"),
                new discord_js_1.ButtonBuilder()
                    .setStyle(discord_js_1.ButtonStyle.Danger)
                    .setLabel(this.redBtnText)
                    .setCustomId("no"),
            ]);
            //@ts-ignore d.js make ur fucking typings work
            msg.components[0] = row;
            msg.edit({ components: msg.components });
        });
    }
}
exports.Confirm = Confirm;
