import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import { writeFile } from "fs/promises";
import path from "path"

const PORT = 3000;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/app.html"));
});

app.get("/app.js", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/app.js"));
});

app.get("/app.css", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/app.css"));
})

io.on('connection', socket => {
    socket.on("login", async (data) => {
        console.log("login: ", data);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });

    socket.on("image", async (data) => {
        console.log("message: ", data);
        await writeFile(path.join(__dirname, "../data", "img.png"), data.image, "base64");
    });
});


console.log("Server started");
httpServer.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});