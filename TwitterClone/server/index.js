const express = require("express");
const cors = require("cors"); //to bypass Access-Origin error
const monk = require("monk"); //used to talk to the database. in this case mongoDB
const Filter = require("bad-words"); //used to filter out bad-words
const rateLimit = require("express-rate-limit"); //used to limit the amount of requests made to the server.
/***************************************************/
const app = express();
const db = monk(process.env.MONGO_URI || "localhost/twitter");
const mews = db.get("mews");
const filter = new Filter();
/***************************************************/

app.use(cors());
app.use(express.json());
/***************************************************/

app.get("/", (req, res) => {
  res.json({
    message: "tweet! doot! doot!!🎺",
  });
});
app.get("/mews", (req, res) => {
  mews.find().then((mews) => {
    res.json(mews);
  });
});
/***************************************************/

function isValidMew(mew) {
  return (
    mew.name &&
    mew.name.toString().trim() !== "" &&
    mew.content &&
    mew.content.toString().trim() !== ""
  );
}
/***************************************************/

app.use(
  rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 1, //limit each IP to 1 requests per windowMs
  })
);
/***************************************************/

app.post("/mews", (req, res) => {
  if (isValidMew(req.body)) {
    //insert into DB.......
    const mew = {
      name: filter.clean(req.body.name.toString()),
      content: filter.clean(req.body.content.toString()),
      created: new Date(),
    };
    // console.log(mew);
    mews.insert(mew).then((createdMew) => {
      res.json(createdMew);
    });
  } else {
    res.status(422);
    res.json({
      message: "hey, Enter some content Bro!",
    });
  }
});
/***************************************************/

app.listen(5000, () => {
  console.log("listening on http://localhost:5000");
});
