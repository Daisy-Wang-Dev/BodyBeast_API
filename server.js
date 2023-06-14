const express = require("express");
const app = express();
const PORT = process.env.PORT || 5050;
const cors = require("cors");


app.listen(PORT, ()=> {
    console.log(`Server running on ${PORT}`);
})