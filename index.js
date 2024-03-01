// const express = require('express'); // cjs
import express from "express";  // ESM
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";
// console.log(nanoid(8));

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middileware
app.use(bodyParser.urlencoded({ extended: true }));
// middileware
app.use(express.json());     //req.body me data dikhane k liye 

app.get("/",(req,res)=>{
    console.log("hello / gett");
    res.sendFile(__dirname + "/index.html");
})


app.post('/url-shortner', (req, res)=>{
    // console.log(req.body.url);
    const longUrl = req.body.url;
    const shortUrl = nanoid(8);

    const fileResponse = fs.readFileSync("urlmap.json");
    // console.log(fileResponse);
    const filedata = JSON.parse(fileResponse.toString());
    
    filedata[shortUrl] = longUrl
    fs.writeFileSync("urlmap.json",JSON.stringify(filedata));

    res.send(`Shortened URL: http://localhost:5000/${shortUrl}`);
    // res.json({
    //     success:true,
    //     message:`http://localhost:5000/${shortUrl}`
    // })
})

app.get('/:shortUrl', (req, res)=>{
    // console.log(req.params.shortUrl);

    const fileResponse = fs.readFileSync("urlmap.json");
    const filedata = JSON.parse(fileResponse.toString());

    const longUrl = filedata[req.params.shortUrl];
    // console.log(longUrl);

    if (longUrl) {
        res.redirect(longUrl);
      } else {
        res.status(404).send('URL not found');
      }

})

app.listen(5000, ()=>{
    console.log("server is running at http://localhost:5000");
})