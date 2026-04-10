import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());

const API_BASE = "https://youtube.googleapis.com/youtube/v3";
const API_KEY = process.env.YT_API_KEY;

async function yt(req, res, url) {
  try { const r = await fetch(url); const d = await r.json(); res.json(d);}
  catch(e){res.status(500).json({error:"YouTube proxy error"});}
}

app.get("/api/latest",(req,res)=>{
 const channel=req.query.channel;
 const url=`${API_BASE}/search?key=${API_KEY}&channelId=${channel}&part=snippet,id&order=date&maxResults=20&type=video`;
 yt(req,res,url);
});

app.get("/api/playlist",(req,res)=>{
 const id=req.query.id;
 const url=`${API_BASE}/playlistItems?part=snippet&maxResults=20&playlistId=${id}&key=${API_KEY}`;
 yt(req,res,url);
});

app.get("/api/popular",(req,res)=>{
 const url=`${API_BASE}/videos?part=snippet&chart=mostPopular&regionCode=ZA&maxResults=20&key=${API_KEY}`;
 yt(req,res,url);
});

app.listen(3000,()=>console.log("Proxy running"));
