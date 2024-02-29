// const express = require('express'); // cjs
import express from "express";  // ESM
import fs from "fs";
// import path from "path";
import { nanoid } from "nanoid";
// console.log(nanoid(8));

const app = express();


app.use(express.json());     //req.body me data dikhane k liye 
app.get("/",(req,res)=>{
    res.send(`<form action="/url-shortner" method="post">
    <label for="longUrl">Enter a long URL:</label>
    <input type="url" id="longUrl" name="longUrl" required>
    <button type="submit">Shorten URL</button>
  </form>`)
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

    res.json({
        success:true,
        message:`http://localhost:5000/${shortUrl}`
    })
})

app.get('/:shortUrl', (req, res)=>{
    // console.log(req.params.shortUrl);

    const fileResponse = fs.readFileSync("urlmap.json");
    // console.log(fileResponse);
    const filedata = JSON.parse(fileResponse.toString());

    const longUrl = filedata[req.params.shortUrl];
    // console.log(longUrl);

   res.redirect(longUrl);

})

app.listen(5000, ()=>{
    console.log("server is running at http://localhost:5000");
})