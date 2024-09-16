import { Client, AttachmentBuilder, Attachment, TextChannel} from 'discord.js';

export default class Discord {
    private token: string;
    private channel: TextChannel;
    private channelID: string;
    private client: Client;
    constructor(token: string, channel: string) {
        this.token = token;
        this.channelID = channel;
        this.client = new Client({ intents: ["Guilds", "GuildMessages"] });
        this.channel = this.client.channels.cache.get(channel) as TextChannel;

        this.client.once("ready", async () => {
            this.channel = this.client.channels.cache.get(this.channelID) as TextChannel;
            this.channel.send('Discord bot is ready');
            console.log("Discord bot is ready");
        });

        this.client.on("messageCreate", async (message) => {
            if (message.author.bot) return;
            if (message.content === "!ping") {
                message.reply("Pong!");
            }
        });

        this.client.login(this.token);
    }

    public async sendImage(image: Buffer) :Promise<string> {
        const attachment = new AttachmentBuilder(image, {name: 'uploaded.png'});
        const res = await this.channel.send({files: [attachment]});

        const attRespond = res.attachments.first() as Attachment;
        return attRespond.proxyURL;
    };
};