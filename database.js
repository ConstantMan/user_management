import mysql from "mysql";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "application.db",
});

db.connect((err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to the MySQL server.");

    const query1 = `
      CREATE TABLE IF NOT EXISTS USERS(
        user_id varchar(255) PRIMARY KEY,
        username varchar(255),
        user_password varchar(255),
        firstname varchar(255),
        surname varchar(255),
        email varchar(255),
        phone varchar(255),
        address varchar(255),
        gender varchar(255)
      )
    `;
    db.query(query1, (err) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log("Table USERS created");
      }
    });
  }
});

export default db;
