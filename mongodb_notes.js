// =====================
// MongoDB Notes Cheat Sheet
// =====================

// --- DATABASE & COLLECTION ---

// Switch/create database (creates lazily on insert)
db = db.getSiblingDB("myDatabase")  //use myDatabase

// Create a collection explicitly
db.createCollection("cars")

// List all databases and collections (interactive only)
// show dbs
// show collections

// Drop a collection
db.cars.drop()

// Drop a database
db.dropDatabase()



// --- CRUD OPERATIONS ---

// Insert a single document into collection
db.cars.insertOne({ maker: "Hyundai", model: "Creta", fuel_type: "Diesel", engine: { cc: 1498 } })
// Output: { "acknowledged": true, "insertedId": ObjectId(...) }

// Insert multiple documents
db.cars.insertMany([
  { maker: "Hyundai", model: "i20", fuel_type: "Petrol", engine: { cc: 1200 } },
  { maker: "Tata", model: "Nexon", fuel_type: "Diesel", engine: { cc: 1498 } }
])

// Find all documents
db.cars.find()
// Output: Cursor with all car documents

// Find one matching document
db.cars.findOne({ maker: "Hyundai" })

// Projection (return only certain fields)
db.cars.find({ fuel_type: "Diesel" }, { maker: 1, model: 1, _id: 0 })

// Update a single document (set fuel type)
db.cars.updateOne({ model: "i20" }, { $set: { fuel_type: "CNG" } })

// Update many (increment engine capacity by 100 for Hyundai)
db.cars.updateMany({ maker: "Hyundai" }, { $inc: { "engine.cc": 100 } })

// Replace entire document
db.cars.replaceOne({ model: "Nexon" }, { maker: "Tata", model: "Nexon EV", fuel_type: "Electric" })

// Delete one
db.cars.deleteOne({ model: "Creta" })

// Delete many
db.cars.deleteMany({ maker: "Tata" })



// --- OPERATORS ---

// Comparison operators
db.cars.find({ "engine.cc": { $gt: 1400 } })       // cars with cc > 1400
db.cars.find({ "engine.cc": { $in: [1498, 2179] } })

// Logical operators
db.cars.find({ $and: [{ fuel_type: "Diesel" }, { "features.sunroof": true }] })
db.cars.find({ $or: [{ transmission: "Automatic" }, { "features.sunroof": true }] })
db.cars.find({ $nor: [{ transmission: "Automatic" }, { "features.sunroof": true }] })

// Element operators
db.cars.find({ engine: { $exists: true } })
db.cars.find({ maker: { $type: "string" } })

// Array operators
db.users.find({ hobbies: { $size: 4 } })
db.users.find({ hobbies: { $all: ["play", "read"] } })



// --- CURSOR METHODS ---

// Count docs
db.cars.find().count()

// Sort by model ascending (use -1 for descending)
db.cars.find().sort({ model: 1 })

// Limit and skip
db.cars.find().limit(2)
db.cars.find().skip(3)



// --- AGGREGATION PIPELINE ---

// Basic example: group Hyundai cars by fuel type
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $group: { _id: "$fuel_type", total: { $sum: 1 } } }
])

// Count cars per maker
db.cars.aggregate([{ $group: { _id: "$maker", TotalCars: { $sum: 1 } } }])

// Count Hyundai cars
db.cars.aggregate([{ $match: { maker: "Hyundai" } }, { $count: "Total_cars" }])

// Projection (select fields)
db.cars.aggregate([
  { $match: { maker: "Hyundai" } },
  { $project: { maker: 1, model: 1, fuel_type: 1, _id: 0 } }
])

// Sorting and limiting
db.cars.aggregate([{ $sort: { model: 1 } }, { $limit: 5 }, { $skip: 2 }])

// Shortcut to group + count
db.cars.aggregate([{ $sortByCount: "$maker" }])

// Unwind (flatten owners array)
db.cars.aggregate([{ $unwind: "$owners" }])

// String operations
db.cars.aggregate([{ $project: { CarName: { $concat: ["$maker", " ", "$model"] } } }])
db.cars.aggregate([{ $project: { is_diesel: { $regexMatch: { input: "$fuel_type", regex: "Die" } } } }])

// Store result into another collection
db.cars.aggregate([{ $match: { maker: "Hyundai" } }, { $out: "hyundai_cars" }])

// Arithmetic
db.cars.aggregate([{ $project: { model: 1, price: { $add: ["$price", 50000] } } }])

// AddFields example
db.cars.aggregate([{ $addFields: { price_in_lakhs: { $divide: ["$price", 100000] } } }])

// Conditional ($cond)
db.cars.aggregate([{ $project: { fuelCategory: { $cond: { if: { $eq: ["$fuel_type", "Petrol"] }, then: "Petrol Car", else: "Non-Petrol Car" } } } }])

// Conditional ($switch)
db.cars.aggregate([{ $project: { priceCategory: { $switch: { branches: [ { case: { $lt: ["$price", 500000] }, then: "Budget" }, { case: { $and: [{ $gte: ["$price", 500000] }, { $lt: ["$price", 1000000] }] }, then: "Midrange" }, { case: { $gte: ["$price", 1000000] }, then: "Premium" } ], default: "Unknown" } } } }])

// Date operators
db.cars.aggregate([{ $project: { nextService: { $dateAdd: { startDate: new Date(), unit: "month", amount: 6 } } } }])

// Variables (system variable $$NOW)
db.cars.aggregate([{ $project: { model: 1, now: "$$NOW" } }])



// --- DATA MODELING ---

// Embedded documents
db.users.insertOne({
  name: "Amit",
  orders: [{ product: "Laptop", amount: 50000 }, { product: "Mobile", amount: 15000 }]
})

// Referenced documents
db.users.insertOne({ _id: "user1", name: "Priya" })
db.orders.insertOne({ user_id: "user1", product: "Laptop", amount: 50000 })

// Join using $lookup
db.users.aggregate([{ $lookup: { from: "orders", localField: "_id", foreignField: "user_id", as: "orders" } }])



// --- SCHEMA VALIDATION ---

db.createCollection("products", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price"],
      properties: {
        name: { bsonType: "string" },
        price: { bsonType: "number", minimum: 0 }
      }
    }
  },
  validationLevel: "strict",
  validationAction: "error"
})



// --- INDEXES ---

// Create simple and unique indexes
db.cars.createIndex({ maker: 1 })
db.cars.createIndex({ model: 1 }, { unique: true })

// Drop index
db.cars.dropIndex("maker_1")

// Show all indexes
db.cars.getIndexes()



// --- TRANSACTIONS ---
// (Requires replica set, not standalone)

const session = db.getMongo().startSession()
session.startTransaction()
try {
  session.getDatabase("shop").accounts.updateOne({ _id: 1 }, { $inc: { balance: -1000 } }, { session })
  session.getDatabase("shop").accounts.updateOne({ _id: 2 }, { $inc: { balance: 1000 } }, { session })
  session.commitTransaction()
} catch (e) {
  session.abortTransaction()
}
session.endSession()



// --- REPLICATION & SHARDING ---
// Run on server-side config, not mongosh directly:
// mongod --replSet "rs0"
// rs.initiate()
// sh.enableSharding("myDatabase")
// sh.shardCollection("myDatabase.cars", { maker: 1 })
