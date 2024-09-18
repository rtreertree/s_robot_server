import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import { readFile, rm, mkdir } from "fs/promises";
import Discord from "./discordmessage";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";

const PORT = 3000;
const IMAGE_PATH = "uploads/";
const PUBLIC_PATH = "public/";
dotenv.config();

// Check image path
mkdir(IMAGE_PATH).catch((err) => {
    console.log(`Cannot create folder "${path.join(__dirname, IMAGE_PATH)}"`);
});

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
const upload = multer({ dest: IMAGE_PATH });

// Express
app.post('/image',upload.single("image"), async(req: any, res) => {
    console.log("Image received");
    console.log(req.body.name);
    const image = await readFile(req.file.path);
    await discord.sendImage(image);
    rm(req.file.path);
    res.send("ok");
});

// Check connectivity and ping robot
app.post('/', async(req, res) => {
    res.send("ok");
});


// Start server
console.log("Server started");
httpServer.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});