"use strict";
Object.defineProperty(exports, "Confirm", {
    enumerable: true,
    get: ()=>Confirm
});
function _discordJs() {
    const data = require("discord.js");
    _discordJs = function() {
        return data;
    };
    return data;
}
class Confirm {
    constructor({ onConfirm , onDecline , context , greenBtnText , redBtnText  }){
        this.redBtnText = redBtnText;
        this.greenBtnText = greenBtnText;
        this.row = new (_discordJs()).ActionRowBuilder().addComponents([
            new (_discordJs()).ButtonBuilder().setStyle(_discordJs().ButtonStyle.Success).setLabel(this.greenBtnText).setCustomId('yes'),
            new (_discordJs()).ButtonBuilder().setStyle(_discordJs().ButtonStyle.Danger).setLabel(this.redBtnText).setCustomId('no')
        ]);
        this.context = context;
        this.onConfirm = onConfirm;
        this.onDecline = onDecline;
    }
    async reply(payload) {
        let components = payload.components ? [
            this.row,
            ...payload.components
        ] : [
            this.row
        ];
        let msg = this.context instanceof _discordJs().Message ? await this.context.reply({
            ...payload,
            //@ts-ignore d.js make ur fucking typings work
            components: components
        }) : await this.context.reply({
            ...payload,
            //@ts-ignore d.js make ur fucking typings work
            components: components,
            fetchReply: true
        });
        this.createCollector(msg);
    }
    createCollector(msg) {
        let usr = this.context instanceof _discordJs().Message ? this.context.author : this.context.user;
        let collector = msg.createMessageComponentCollector({
            filter: (int)=>int.user.id == usr.id,
            time: 15_000,
            max: 1
        });
        collector.on('collect', (int)=>{
            if (!int.isButton()) return;
            switch(int.customId){
                case 'yes':
                    {
                        this.onConfirm(int);
                        break;
                    }
                case 'no':
                    {
                        this.onDecline(int);
                        break;
                    }
            }
        });
        collector.on('end', async (_)=>{
            if (this.context instanceof _discordJs().CommandInteraction) {
                if (this.context.ephemeral) return;
            }
            let row = new (_discordJs()).ActionRowBuilder().addComponents([
                new (_discordJs()).ButtonBuilder().setStyle(_discordJs().ButtonStyle.Success).setLabel(this.greenBtnText).setCustomId('yes').setDisabled(true),
                new (_discordJs()).ButtonBuilder().setStyle(_discordJs().ButtonStyle.Danger).setLabel(this.redBtnText).setCustomId('no').setDisabled(true)
            ]);
            //@ts-ignore d.js make ur fucking typings work
            msg.components[0] = row;
            msg.edit({
                components: msg.components
            });
        });
    }
}
