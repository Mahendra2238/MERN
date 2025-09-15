// =====================
// MongoDB Notes Cheat Sheet 
// =====================

// --- DATABASE & COLLECTION ---

// Switch/create database (lazy creation, DB is created only when data is inserted)
db = db.getSiblingDB("myDatabase")   // equivalent to: use myDatabase

// Create a collection explicitly
db.createCollection("cars")

// Show all databases and collections
// show dbs
// show collections

// Drop a collection
db.cars.drop()

// Drop current database
db.dropDatabase()


// --- CRUD OPERATIONS ---

// Insert Documents
db.cars.insertOne({ maker: "Hyundai", model: "Creta", fuel_type: "Diesel", engine: { cc: 1498 } })
db.cars.insertMany([
  { maker: "Hyundai", model: "i20", fuel_type: "Petrol", engine: { cc: 1200 } },
  { maker: "Tata", model: "Nexon", fuel_type: "Diesel", engine: { cc: 1498 } }
])

// Read Documents
db.cars.find()                                    // all
db.cars.findOne({ maker: "Hyundai" })             // first match
db.cars.find({ fuel_type: "Diesel" }, { maker: 1, model: 1, _id: 0 })  // projection

// Update Documents
db.cars.updateOne({ model: "i20" }, { $set: { fuel_type: "CNG" } })
db.cars.updateMany({ maker: "Hyundai" }, { $inc: { "engine.cc": 100 } })

// Replace Document
db.cars.replaceOne({ model: "Nexon" }, { maker: "Tata", model: "Nexon EV", fuel_type: "Electric" })

// Delete Documents
db.cars.deleteOne({ model: "Creta" })
db.cars.deleteMany({ maker: "Tata" })

// Upsert → update if found, else insert new
db.cars.updateOne(
  { model: "Harrier" },
  { $set: { maker: "Tata", fuel_type: "Diesel" } },
  { upsert: true }
)


// --- OPERATORS ---

// Comparison Operators
db.cars.find({ "engine.cc": { $gt: 1400 } })              // $gt → greater than
db.cars.find({ "engine.cc": { $in: [1498, 2179] } })      // $in → matches any in array

// Logical Operators
db.cars.find({ $and: [{ fuel_type: "Diesel" }, { "features.sunroof": true }] }) // AND
db.cars.find({ $or: [{ transmission: "Automatic" }, { "features.sunroof": true }] }) // OR
db.cars.find({ $nor: [{ transmission: "Automatic" }, { "features.sunroof": true }] }) // NOT (both)

// Element Operators
db.cars.find({ engine: { $exists: true } })               // $exists → field exists?
db.cars.find({ maker: { $type: "string" } })              // $type → check BSON type

// Array Operators
db.users.find({ hobbies: { $size: 4 } })                  // $size → exact array length
db.users.find({ hobbies: { $all: ["play", "read"] } })    // $all → must contain all values


// --- CURSOR METHODS ---

db.cars.find().count()            // count docs
db.cars.find().sort({ model: 1 }) // sort ascending (use -1 for descending)
db.cars.find().limit(2)           // limit number of docs
db.cars.find().skip(3)            // skip first 3 docs


// --- AGGREGATION PIPELINE ---

// $match → filter documents
db.cars.aggregate([{ $match: { maker: "Hyundai" } }])

// $group → group by field and apply aggregations
db.cars.aggregate([{ $group: { _id: "$maker", total: { $sum: 1 } } }])

// $project → reshape document (select fields / compute new ones)
db.cars.aggregate([{ $project: { maker: 1, model: 1, _id: 0 } }])

// $sort → sort by field
db.cars.aggregate([{ $sort: { model: 1 } }])

// $limit → return only N docs
db.cars.aggregate([{ $limit: 5 }])

// $skip → skip first N docs
db.cars.aggregate([{ $skip: 2 }])

// $unwind → deconstruct array into separate docs
db.cars.aggregate([{ $unwind: "$owners" }])

// $lookup → join with another collection
db.cars.aggregate([{ $lookup: { from: "orders", localField: "_id", foreignField: "user_id", as: "orders" } }])

// $addFields → add computed/new fields
db.cars.aggregate([{ $addFields: { category: "car" } }])

// $count → count docs after pipeline
db.cars.aggregate([{ $count: "TotalCars" }])


// --- STRING OPERATORS ---

db.cars.aggregate([{ $project: { CarName: { $concat: ["$maker", " ", "$model"] } } }]) // $concat → join strings
db.cars.aggregate([{ $project: { upper: { $toUpper: "$maker" } } }])                   // $toUpper → uppercase
db.cars.aggregate([{ $project: { lower: { $toLower: "$model" } } }])                   // $toLower → lowercase
db.cars.aggregate([{ $project: { trimmed: { $ltrim: { input: "$maker", chars: " " } } } }]) // $ltrim → trim chars
db.cars.aggregate([{ $project: { splitModel: { $split: ["$model", " "] } } }])         // $split → split string
db.cars.aggregate([{ $project: { is_diesel: { $regexMatch: { input: "$fuel_type", regex: "Die" } } } }]) // $regexMatch → regex test


// --- ARITHMETIC OPERATORS ---

db.cars.aggregate([{ $project: { price_with_hike: { $add: ["$price", 50000] } } }])    // $add → addition
db.cars.aggregate([{ $project: { reduced_price: { $subtract: ["$price", 20000] } } }]) // $subtract → subtraction
db.cars.aggregate([{ $project: { half_price: { $divide: ["$price", 2] } } }])          // $divide → division
db.cars.aggregate([{ $project: { double_price: { $multiply: ["$price", 2] } } }])      // $multiply → multiplication
db.cars.aggregate([{ $project: { rounded: { $round: ["$price", -3] } } }])             // $round → round
db.cars.aggregate([{ $project: { absVal: { $abs: -120 } } }])                          // $abs → absolute value
db.cars.aggregate([{ $project: { ceilPrice: { $ceil: "$price" } } }])                  // $ceil → round up

// --- ROUNDING OPERATORS ---

// $round → rounds to nearest (0.5 goes away from zero)
db.test.aggregate([{ $project: { val: { $round: [12.5, 0] } } }])   // 13
db.test.aggregate([{ $project: { val: { $round: [-12.5, 0] } } }])  // -13

// $ceil → always rounds UP
db.test.aggregate([{ $project: { val: { $ceil: 12.3 } } }])         // 13
db.test.aggregate([{ $project: { val: { $ceil: -12.3 } } } }])      // -12

// $floor → always rounds DOWN
db.test.aggregate([{ $project: { val: { $floor: 12.7 } } }])        // 12
db.test.aggregate([{ $project: { val: { $floor: -12.7 } } }])       // -13


// --- CONDITIONAL OPERATORS ---

db.cars.aggregate([{ $project: { fuelCategory: { $cond: { if: { $eq: ["$fuel_type", "Petrol"] }, then: "Petrol Car", else: "Non-Petrol Car" } } } }]) // $cond → if/else
db.cars.aggregate([{ $project: { safeModel: { $ifNull: ["$model", "Unknown Model"] } } }]) // $ifNull → default if null/missing
db.cars.aggregate([{ $project: { priceCategory: { $switch: { branches: [ { case: { $lt: ["$price", 500000] }, then: "Budget" }, { case: { $and: [{ $gte: ["$price", 500000] }, { $lt: ["$price", 1000000] }] }, then: "Midrange" }, { case: { $gte: ["$price", 1000000] }, then: "Premium" } ], default: "Unknown" } } } }]) // $switch → switch-case logic


// --- DATE OPERATORS ---

db.cars.aggregate([{ $project: { nextService: { $dateAdd: { startDate: new Date(), unit: "month", amount: 6 } } } }]) // $dateAdd → add time
db.cars.aggregate([{ $project: { diffDays: { $dateDiff: { startDate: ISODate("2024-01-01"), endDate: "$lastService", unit: "day" } } } }]) // $dateDiff → date difference
db.cars.aggregate([{ $project: { month: { $month: "$purchaseDate" }, year: { $year: "$purchaseDate" } } }]) // $month, $year → extract
db.cars.aggregate([{ $project: { hour: { $hour: "$purchaseDate" }, dom: { $dayOfMonth: "$purchaseDate" }, doy: { $dayOfYear: "$purchaseDate" } } }]) // $hour, $dayOfMonth, $dayOfYear
db.cars.aggregate([{ $project: { model: 1, now: "$$NOW" } }]) // $$NOW → current datetime (system variable)


// --- DATA MODELING ---

// Embedded Documents (denormalized)
db.users.insertOne({
  name: "Amit",
  orders: [{ product: "Laptop", amount: 50000 }, { product: "Mobile", amount: 15000 }]
})

// Referenced Documents (normalized)
db.users.insertOne({ _id: "user1", name: "Priya" })
db.orders.insertOne({ user_id: "user1", product: "Laptop", amount: 50000 })

// $lookup → JOIN equivalent
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
  validationLevel: "strict",   // strict → must follow rules
  validationAction: "error"    // error → reject invalid doc
})


// --- INDEXES ---

db.cars.createIndex({ maker: 1 })                      // single field index
db.cars.createIndex({ model: 1 }, { unique: true })    // unique index
db.cars.dropIndex("maker_1")                           // drop index
db.cars.getIndexes()                                   // list all indexes


// --- TRANSACTIONS ---
// Multi-document ACID transactions (requires replica set)

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
// Replication → high availability (multiple copies)
// Sharding → horizontal scaling (split data across servers)

// Run on server config (not in mongosh):
// mongod --replSet "rs0"
// rs.initiate()
// sh.enableSharding("myDatabase")
// sh.shardCollection("myDatabase.cars", { maker: 1 })
