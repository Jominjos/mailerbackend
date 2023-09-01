const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const User = require("./user");
const nodemailer = require("nodemailer");
app.use(bodyparser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace '*' with the allowed origin
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nodemailer430@gmail.com",
    pass: "jsmpghotgggexxog",
  },
});

// async..await is not allowed in global scope, must use a wrapper

//

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DATABASE);
  await console.log(`connected to database`);
  //   let user = await User.create({
  //     name: "gobi",
  //     age: "29",

  //     Email: "gobi@gmail.com",
  //   });

  //console.log(`1`, dbdata);
  app.post("/user", (req, res, next) => {
    let userdetail = req.body;
    createUser();

    async function createUser() {
      console.log(userdetail);
      const createdUser = await User.create(userdetail);
      res.json(createdUser);
    }
  });
  app.post("/sendmail", (req, res, next) => {
    fetchUser();
    async function fetchUser() {
      const dbdata = await User.find({}, { Email: 1, _id: 0 });
      let emailids = dbdata.map((d) => {
        return d.Email;
      });
      res.json(emailids);
      async function mailer() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: "nodemailer430@gmail.com", // sender address
          to: emailids, // list of receivers
          subject: "Mail subject", // Subject line
          text: "This is the text content of the mail", // plain text body
          html: "<b>Hello world?</b>", // html body
        });

        console.log("Message sent: %s", info.messageId);
      }

      mailer().catch(console.error);
    }
  });
  //await console.log(dbdata);
  app.get("/db", (req, res, next) => {
    fetchUser();
    async function fetchUser() {
      const dbdata = await User.find({});

      res.json(dbdata);
    }
  });

  app.get("/user/:name", (req, res, next) => {
    let searchName = req.params.name;
    getByName();
    async function getByName() {
      const userData = await User.find({ name: searchName });
      // await console.log(userData);
      (await (userData.length > 0))
        ? res.status(200).json(userData)
        : res
            .status(200)
            .json({ message: `No user found with name ${searchName}` });
    }
  });
  app.delete("/delete/:name", (req, res, next) => {
    let deleteName = req.params.name;
    delByName();
    async function delByName() {
      const delData = await User.deleteMany({ name: deleteName });
      console.log(delData);
      res.json(delData);
    }
  });
}

app.get("/home", (req, res, next) => {
  res.json({ hi: "jomin" });
});

app.listen(8005, () => {
  console.log(`listening on port 8005`);
});
