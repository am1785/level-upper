const express = require("express");
const cors = require("cors");

require("dotenv").config({path: "./app_config.env"})
const PORT = process.env.PORT || 5001;
const app = express();

app.use(cors());
app.use(express.json());
const dbo = require("./db/conn");

app.use(require("./routes/tasks"));
app.use(require("./routes/skills"));

// start the Express server
app.listen(PORT, async () => {
  await dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });

  // const tasksCollection = await dbo.getDb('level-upper').collection('tasks');
  // const upsertResult1 = await tasksCollection.updateOne(query, update, options);

  console.log(`Server is running on port: ${PORT}`);
});