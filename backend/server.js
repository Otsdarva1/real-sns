const express = require("express");
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config();

//データベース接続
mongoose.connect(process.env.MONGOURL
).then(() => {
  console.log("DBと接続中・・・")
}).catch((err) => {
  console.log(err)
});

//ミドルウェア 第一引数にリクエストされたときに第二引数にルーティングする
app.use("/images", express.static(path.join(__dirname, "public/images")))
app.use(express.json())
app.use("/users", userRoute)
app.use("/auth", authRoute)
app.use("/posts", postRoute)
app.use("/upload", uploadRoute)

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname,'../frontend/build/index.html'));
});


app.listen(PORT, () => console.log("サーバーが起動しました"))