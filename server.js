require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;
const cors = require("cors");
const userRouter = require("./routes/user-routes");

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);

app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
})