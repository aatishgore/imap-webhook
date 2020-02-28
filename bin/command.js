#!/usr/bin/env node

const prompt = require("prompt");
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const onlyNumber = /^\d+$/;
const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const fs = require("fs");
const typeofYes = ["Yes", "yes", "y", "Y", "YES"];

const properties = [
  {
    description: "Enter your smtp email",
    name: "email",
    validator: emailPattern,
    warning: "Enter valid Email Id",
    required: true,
    default: "aatish.gore@wwindia.com"
  },
  {
    description: "Enter your smtp password",
    name: "password",
    required: true,
    hidden: true,
    default: "aatishg123"
  },
  {
    description: "Enter your smtp host",
    name: "host",
    required: true,
    default: "mail.wwindia.com"
  },
  {
    description: "Enter your smtp port",
    name: "port",
    required: true,
    validator: onlyNumber,
    warning: "Enter only number",
    default: "143"
  },
  {
    description: "tls required? Yes or No",
    required: true,
    name: "tls",
    default: "Yes",
    before: value => (typeofYes.includes(value) ? true : false)
  },
  {
    description: "Enter your webhookUrl",
    required: true,
    name: "webhookUrl",
    validator: urlRegex,
    default: "https://webhook.site/58b9ed2e-f683-4960-9e93-f05c487773e9"
  },
  {
    description: "Enter storage file path",
    required: true,
    name: "attachment",
    default: __dirname,
    before: value => (value.substr(-1) === "/" ? value : value + "/")
  },
  {
    description: "FIle server url",
    required: true,
    name: "fileServerUrl",
    validator: urlRegex,
    default: "http://43.240.67.252/attachments/"
  }
];

prompt.start();

prompt.get(properties, function(err, result) {
  if (err) {
    return onErr(err);
  }
  fs.unlink("./.env", function(err) {
    // if no error, file has been deleted successfully
    console.log("Deleting previous .env file");
  });

  for (var key in result) {
    fs.appendFile("./.env", `${key}=${result[key]}\n`, function(err) {
      if (err) throw err;
    });
  }
  console.log("Generated new .env file");
});

function onErr(err) {
  console.log(err);
  return 1;
}
