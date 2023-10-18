const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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

async function run() {
  try {
    await client.connect();

    app.get("/cars/:brand", async (req, res) => {
      const brand = req.params.brand;
      const query = { brand: brand };
      const pro = productsCollection.find(query);
      const result = await pro.toArray();
      console.log(result);
      res.send(result);
    });
    app.post("/addProducts", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });
  } finally {
    console.log("onk");
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("this is server side...");
});
app.listen(port);
