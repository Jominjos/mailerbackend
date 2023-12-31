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

app.use(
  cors({
    origin: "*",
  })
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nodemailer430@gmail.com",
    pass: process.env.MAIL_PASS,
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
    console.log(req.body.content);
    let [mailSubject, mailContent] = [
      req.body.content.sub,
      req.body.content.content,
    ];
    async function fetchUser() {
      const dbdata = await User.find({}, { Email: 1, _id: 0 });
      let emailids = dbdata.map((d) => {
        return d.Email;
      });

      async function mailer() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: "nodemailer430@gmail.com", // sender address
          to: emailids, // list of receivers
          subject: mailSubject, // Subject line
          text: mailContent, // plain text body
          //html: "<b>Hello world?</b>",
        });

        console.log("Message sent: %s", info.messageId);
        res.json({ message: "Mail send Successfully" });
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
      res.status(200).json(delData);
    }
  });
}

app.get("/home", (req, res, next) => {
  res.json({ hi: "jomin" });
});

app.listen(8005, () => {
  console.log(`listening on port 8005`);
});
