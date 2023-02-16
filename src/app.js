const express = require("express");
const hbs = require("hbs");
const app = express();
const mongoose = require("mongoose")
const routes = require('./routes/main')
const Detail = require("./models/Detail")

app.use('',routes)

//template engine
app.set('view engine','hbs')
app.set("views", "views")
hbs.registerPartials("views/partials")

//db connections
mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://uukiyoo:FinalYear@cluster0.cz70zqg.mongodb.net/FinalYearProj", () => {
    console.log("Database Connected")
    Detail.create(
        {
            brandName: "AboutAlzheimers",
            brandIconUrl: "https://images.vexels.com/media/users/3/240362/isolated/preview/e7d752550e9a3d4debef489d51baab94-forget-me-not-flowers-stroke.png",
            links:[
                {
                    label:"Home",
                    url: "/"
                },
                {
                    label:"Services",
                    url: "/services"
                },
                {
                    label: "Gallery",
                    url: "/gallery"
                },    
                {
                    label: "Links",
                    url: "/links"
                },
                {
                    label: "About",
                    url: "/about"
                }
               
            ]
        }
    )
})

app.listen(process.env.PORT | 3000, ()=>{
    console.log("Server Started")
});