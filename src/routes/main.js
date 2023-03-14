const express = require('express')
const { route } = require('express/lib/application')

const Detail = require("../models/Detail")

const routes = express.Router()

routes.get("/", async (req,res) => {

   const details = await Detail.findOne({"_id":"64106f4aa86a850088ce86ed"})
  // console.log(details)

    res.render("index",{
        details: details,
    });
});

routes.get('/q&a', async (req,res) => {

    const details = await Detail.findOne({"_id":"64106f4aa86a850088ce86ed"});
    res.render("q&a", {
        details: details,
    })
})

routes.get('/memory-techniques', async (req,res) => {

    const details = await Detail.findOne({"_id":"64106f4aa86a850088ce86ed"});
    res.render("memory-techniques", {
        details: details,
    })
})

routes.get('/the-brain', async (req,res) => {

    const details = await Detail.findOne({"_id":"64106f4aa86a850088ce86ed"});
    res.render("the-brain", {
        details: details,
    })
})
routes.get('/what-is-dementia', async (req,res) => {

    const details = await Detail.findOne({"_id":"64106f4aa86a850088ce86ed"});
    res.render("what-is-dementia", {
        details: details,
    })
})



module.exports=routes