import express from "express";
import bodyParser from "body-parser";
import db from "../database.js";
import md5 from "md5";
import { v4 as uuidv4 } from "uuid";
import requireLogin from "../middlewares/requireLogin.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

var jsonParser = bodyParser.json();

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

router.get("/user", requireLogin, async (req, res) => {
  res.status(200).send({
    username: req.session.username,
    user_id: req.session.user_id,
    firstname: req.session.firstname,
    surname: req.session.surname,
    email: req.session.email,
    phone: req.session.phone,
    address: req.session.address,
    gender: req.session.gender,
  });
});

router.post("/update_user_info", requireLogin, jsonParser, async (req, res) => {
  const { firstname, surname, username, email, phone, address, gender } =
    req.body;
  const user_id = req.session.user_id;

  try {
    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE USERS SET firstname = ?, surname = ?, username = ?, email = ?, phone = ?, address = ?, gender = ? WHERE user_id = ?`,
        [firstname, surname, username, email, phone, address, gender, user_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });

    // Update session information
    req.session.firstname = firstname;
    req.session.surname = surname;
    req.session.username = username;
    req.session.email = email;
    req.session.phone = phone;
    req.session.address = address;
    req.session.gender = gender;

    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});

router.post("/signup", jsonParser, async (req, res) => {
  var user_id = uuidv4();
  var username = req.body.username;
  var user_password = req.body.user_password;
  var verify_password = req.body.verify_password;
  var firstname = req.body.firstname;
  var surname = req.body.surname;
  var email = req.body.email;
  var phone = req.body.phone;
  var address = req.body.address;
  var gender = req.body.gender;

  if (user_password !== verify_password) {
    res.status(400).send({
      message: "Passwords must match",
      signup: false,
    });
    return;
  }

  var user = await new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM USERS WHERE username = ?`,
      username,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  if (user.length > 0) {
    res.status(400).send({ message: "Username already taken", signup: false });
    return;
  }

  db.query(
    `INSERT INTO USERS (user_id , username , user_password , firstname , surname, email, phone, address, gender)
     VALUES(?,?,?,?,?,?,?,?,?)`,
    [
      user_id,
      username,
      md5(user_password),
      firstname,
      surname,
      email,
      phone,
      address,
      gender,
    ],
    (err, result) => {
      if (err) {
        res.status(400).send({
          message: err.message,
        });
      } else {
        res.status(201).send({
          message: "User created",
          signup: true,
        });
      }
    }
  );
});

router.post("/login", jsonParser, async (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  var user = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM USERS WHERE username=?`, username, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  if (user.length == 0) {
    res.status(400).send({
      logged: false,
      message: "Username not found",
    });
    return;
  }

  var autheticate_user = await new Promise((resolve, reject) => {
    db.query(
      ` SELECT * FROM USERS WHERE username =? AND user_password=?`,
      [username, md5(password)],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  if (autheticate_user.length == 0) {
    res.status(400).send({
      logged: false,
      message: "Please check your password",
    });
    return;
  }

  req.session.user_id = autheticate_user[0].user_id;
  req.session.username = autheticate_user[0].username;
  req.session.firstname = autheticate_user[0].firstname;
  req.session.surname = autheticate_user[0].surname;
  req.session.email = autheticate_user[0].email;
  req.session.phone = autheticate_user[0].phone;
  req.session.address = autheticate_user[0].address;
  req.session.gender = autheticate_user[0].gender;

  res.status(200).send({ logged: true });
});

router.get("/users", async (req, res) => {
  var users = await new Promise((resolve, reject) => {
    db.query("SELECT * FROM USERS", (err, rows) => {
      if (err) {
        console.error(err);
        res.status(400).send({
          message: err.message,
        });
      } else {
        resolve(rows);
      }
    });
  });

  if (users.length == 0)
    res.status(400).send({ message: "There are not any users" });
  else res.status(200).send({ users: users });
});

router.post("/signout", requireLogin, async (req, res) => {
  req.session.destroy();
  res.send({ signout: true });
});

router.post("/change_password", requireLogin, jsonParser, async (req, res) => {
  var user_id = req.session.user_id;
  var current_password = req.body.user_password;
  var new_password = req.body.new_password;
  var confirm_password = req.body.confirm_password;

  if (
    current_password === "" ||
    new_password === "" ||
    confirm_password === ""
  ) {
    return res.status(400).send({
      message: "Invalid input",
      changePassword: false,
    });
  }

  if (new_password !== confirm_password) {
    return res.status(400).send({
      message: "New passwords must match",
      changePassword: false,
    });
  }

  var user = await new Promise((resolve, reject) => {
    db.query(`SELECT * FROM USERS WHERE user_id = ?`, user_id, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

  if (user.length == 0) {
    return res
      .status(400)
      .send({ message: "User not found", changePassword: false });
  }

  if (user[0].user_password !== md5(current_password)) {
    return res
      .status(400)
      .send({ message: "Incorrect current password", changePassword: false });
  }

  await new Promise((resolve, reject) => {
    db.query(
      `UPDATE USERS SET user_password = ? WHERE user_id = ?`,
      [md5(new_password), user_id],
      (err, result) => {
        if (err) {
          return res.status(400).send({
            message: err.message,
          });
        } else {
          return res.status(200).send({
            message: "Password changed successfully",
            changePassword: true,
          });
        }
      }
    );
  });
});

export default router;
