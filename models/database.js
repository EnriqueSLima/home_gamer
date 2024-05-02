const mysql = require("mysql")
const { Sequelize, Datatypes } = require("sequelize")

const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

con.connect(function(err){
  if(err) throw err;
  console.log("Connection successful.");
  con.query(`CREATE DATABASE IF NOT EXISTS tournaments`, function(err, result){
    if(err) throw err;
    console.log("Database created");
    con.end();
  });
});
