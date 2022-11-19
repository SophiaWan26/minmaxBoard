let express = require("express");
let app = express();
app.use(express.json());
let port = 3000;
let hostname = "localhost";
app.use(express.static("public"));
// don't change code above this line

app.listen(port, hostname, () => {
    console.log(`http://${hostname}:${port}`);
});
app.get("/", function (req, res) {
    res.render("index.html");
});
