const express = require('express')
const { route } = require('express/lib/application')

const Detail = require("../models/Detail")

const routes = express.Router()

routes.get("/", async (req,res) => {

   const details = await Detail.findOne({"_id":"63ee4e21db2f0686f5b9584b"})
  // console.log(details)

    res.render("index",{
        details: details,
    });
});

routes.get('/gallery', async (req,res) => {

    const details = await Detail.findOne({"_id":"63ee4e21db2f0686f5b9584b"});
    res.render("gallery", {
        details: details,
    })
})

module.exports=routes