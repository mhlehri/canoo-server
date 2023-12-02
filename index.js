const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yynznjj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const productsCollection = client.db("ProductsDB").collection("products");
const cartCollection = client.db("ProductsDB").collection("carts");
const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
async function run() {
  try {
    app.get("/cars/:brand", async (req, res) => {
      const brand = req.params.brand;
      const pro = productsCollection.find({ brand });
      const result = await pro.toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign({ user: user }, "secret", { expiresIn: "1h" });
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
    app.get("/cars-edit/:carName", async (req, res) => {
      const name = req.params.carName;
      const query = { name: name };
      const result = await productsCollection.findOne(query);
      res.send();
    });

    app.put("/cars-edit/:carName", async (req, res) => {
      const newCar = req.body;
      const car = req.params.carName;
      const query = { name: car };
      const options = { upsert: true };
      const updateCar = {
        $set: {
          name: newCar.name,
          brand: newCar.brand,
          type: newCar.type,
          price: newCar.price,
          photo: newCar.photo,
          rating: newCar.rating,
          des: newCar.des,
        },
      };
      const result = await productsCollection.updateOne(
        query,
        updateCar,
        options
      );
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
    console.log("run");
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Changed.");
});
app.listen(port);
