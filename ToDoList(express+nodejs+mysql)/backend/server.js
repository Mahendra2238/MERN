const express = require('express');
const cors = require('cors');
const app=express();
const mysql = require('mysql2');

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'system',
    database: 'todo'
});
db.connect((err)=>{
    if(err){
        console.log("Error connecting to database",err);
        return;
    }
    console.log("Connected to database");
});
app.get('/',(req,res)=>{
    console.log("Default Route");
});
app.post('/add-item',(req,res)=>{
    console.log(req.body);
    db.query('INSERT INTO todoItems(itemDescription) VALUES (?)', [req.body.text], (err,result)=>{
        if(err){
            console.log("Error inserting data",err);
            res.status(500).send("Error inserting data");
            return;
        }
        console.log("Data inserted successfully");
        res.send("Item added successfully");
    });
});
app.put('/edit-item',(req,res)=>{
    console.log(req.body);
    db.query('UPDATE todoItems SET itemDescription = ? WHERE ID = ?', [req.body.itemDescription, req.body.ID], (err,result)=>{
        if(err){
            console.log("Error updating data",err);
            res.status(500).send("Error updating data");
            return;
        }
        console.log("Item updated successfully");
        res.send("Item updated successfully");
    });
});

app.get('/todos',(req,res)=>{
    db.query('SELECT * FROM todoItems', (err,results)=>{
        if(err){
            console.log("Error fetching data",err);
            res.status(500).send("Error fetching data");
            return;
        }
        res.json(results);
    });
});

app.delete('/delete-item',(req,res)=>{
    console.log(req.body);
    db.query('DELETE FROM todoItems WHERE ID = ?', [req.body.ID], (err,result)=>{
        if(err){
            console.log("Error deleting data",err);
            res.status(500).send("Error deleting data");
            return;
        }
        console.log("Item deleted successfully");
        res.send("Item deleted successfully");
    });
});

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
