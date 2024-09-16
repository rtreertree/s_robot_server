import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import { readFile, rm } from "fs/promises";
import Discord from "./discordmessage";
import dotenv from "dotenv";
import multer from "multer";

const PORT = 3000;
dotenv.config();

// discord
const discordToken: string = process.env.DISCORD_TOKEN || "";
const discordChannel: string = process.env.DISCORD_CHANNEL || "";
if (!discordToken || !discordChannel) {
    console.error("Discord token not found");
    process.exit(1);
}
console.log("Discord token: ", discordToken);
const discord = new Discord(discordToken, discordChannel);


// Socket
const app = express();
app.use(bodyParser.json());
const httpServer = createServer(app);
const upload = multer({ dest: 'uploads/' });

// Express
app.post('/image',upload.single("image"), async(req: any, res) => {
    const image = await readFile(req.file.path);
    await discord.sendImage(image);
    rm(req.file.path);
    res.send("ok");
});


// Start server
console.log("Server started");
httpServer.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});