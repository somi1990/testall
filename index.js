import express from "express";
import bodyParse from "body-parser";
import fs from "fs";
import qr from "qr-image";
import {dirname} from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import bodyParser from "body-parser";
import inquirer from "inquirer";

const app=express();
const port=3000;
const _dirname=dirname(fileURLToPath(import.meta.url));
var fileName;
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("combined"));

app.use(middlewareCustom);
function middlewareCustom(req,res,next)
{
    console.log(req.method);
    console.log(req.url);
    next();
}
app.listen(port,()=>{
    console.log("server started at port 3000");
})
inquirer.prompt([{
    message:"enter your name",
    name:"URL"
}]).then((ans)=>
{
    const name=ans.URL;
    const qr_img = qr.image(name);
    qr_img.pipe(fs.createWriteStream("qr-image.png"));
    fs.writeFile("qrFile.txt",name,(err)=>{
        if(err) throw err;
        console.log("successfully write");
    });
    fs.readFile("qrFile.txt","utf-8",(err,data)=>{
        if(err) throw err;
        fileName = data;
        console.log("successfully Read and write to file");
    })

}).catch((err)=>{
    if(err) throw err;
});

app.get("/",(req,res)=>{
    res.sendFile(_dirname+"/home.html");

});

app.get("/redirectToEjs",(req,res)=>{
    console.log(_dirname+"\\qr-image.png");
res.render("index.ejs",{'name':fileName,'imagepath':"/css/qr-img.png"});
});

app.post("/getName",(req,res)=>{
    const name=req.body.yourName;
    const qrImage=qr.image(name);
    qrImage.pipe(fs.createWriteStream("/css/yourName.png"));
    res.render("index.ejs",{'name':fileName,'imagepath':"/css/yourName.png"})

});

