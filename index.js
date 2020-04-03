const express = require("express");
const app = express();
const controllers = require("./controllers");
const port = 3001;

app.get("/scrape", controllers.scrapeWebsite);
app.get("/test", controllers.testAvoidDetection);

app.listen(port, () => console.log(`Server listening on port ${port}`));
