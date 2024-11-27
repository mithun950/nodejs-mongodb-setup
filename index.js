const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;



// middleware 
app.use (cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://mithunrony:mithunbd123@cluster0.rxtju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


    // eta ashlo node mongodb curd website theke

    const database = client.db("userDb");
    const userCollection = database.collection("user");

    // data pawa jae
    app.get('/users', async(req,res) => {
        const cursor = userCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

//    thakle update korbe naa thakle create korbe
    app.put('/users/:id', async(req,res) => {
        const id = req.params.id;
        const user = req.body;
        console.log(id,user)
        const filter = {_id:  new ObjectId(id)}
        const options = {upsert: true};

        const updatedUser = {
            $set: {
                name: user.name,
                email: user.email,
            }
        }
        const result = await userCollection.updateOne(filter,updatedUser,options)
        res.send(result)
    })



    app.get('/users/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const user = await userCollection.findOne(query);
        res.send(user)
    })

    // data server ba database e pathano jae

    app.post('/users', async(req,res) => {
        const user = req.body;
        console.log('new user', user)
        const result = await userCollection.insertOne(user);
        res.send(result)
    })

    // data delete kora jae


    app.delete("/users/:id", async(req,res) =>{
        const id = req.params.id;
        console.log("please delete from database ", id);
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)


    })






    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/' ,(req,res) => {
    res.send('Simple crud is running')
})


app.listen (port, () => {
   console.log(`simple crud is running : ${port}`) 
})