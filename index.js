const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://mahmudhassanlehri:mhlehri101@cluster0.yynznjj.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const productsCollection = client.db("ProductsDB").collection("products");
const cartCollection = client.db("ProductsDB").collection("carts");

async function run() {
  try {
    await client.connect();

    app.get("/cars/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const pro = productsCollection.find(query);
      const result = await pro.toArray();
      res.send(result);
    });

    app.get("/cars-info/:carName", async (req, res) => {
      const car = req.params.carName;
      const query = { name: car };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.get("/cars-info", async (req, res) => {
      const pro = cartCollection.find();
      const result = await pro.toArray();
      res.send(result);
    });

    app.post("/cars-info/add", async (req, res) => {
      const car = req.body;
      const result = await cartCollection.insertOne(car);
      res.send(result);
    });

    app.post("/addProducts", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
    app.delete("/remove/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is server side...");
});
app.listen(port);
