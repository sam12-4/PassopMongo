const express = require("express")
const app = express()
const cors = require("cors")
const bodyparser = require("body-parser")

app.use(cors())
app.use(bodyparser.json())

const { MongoClient } = require('mongodb');

const dotenv = require('dotenv')
dotenv.config()

const port=3000;

const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const dbName = 'passop';

//  get all the passwords
app.get("/", async(req, res)=>{
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    let result = await collection.find({}).toArray();
    res.json(result)
})

//  insert password of one entry
app.post("/", async(req, res)=>{
    await client.connect();
    let password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    let result = await collection.insertOne(password);
    console.log(password);
    res.json(result)
})

// delete password of specific id
app.delete("/", async(req, res)=>{
    await client.connect();
    let password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    let result = await collection.deleteOne({id : password.id});
    console.log(password.id);
    result.deletedCount === 1 ?  res.json({success : "true", deletedCount : result.deletedCount}) : res.status(404).send("Item not deleted") 
})

app.put("/",async (req, res)=>{
    await client.connect();
    let password = req.body
    console.log(password);
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const result = await collection.updateOne(
        { id: password.id }, // Set the new values
        { $set: { site: password.site, username: password.username, password: password.password } }
    );
    // console.log(result);
    // result.deletedCount === 1 ?  res.json({success : "true", updatedCount : result}) : res.status(404).send("Item not deleted") 
    res.json({success: "true"})
})

app.listen(port, ()=>{
    console.log(`Listening to port http://localhost:${port}`);
})