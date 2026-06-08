import express from "express";
import * as path from "path";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.static(path.join(__dirname, "../public")));

// setting view engine with EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// index page
app.get("/", (req: express.Request, res: express.Response) => {
  res.render("pages/index", {
    tabTitle: "HOME PAGE",
  });
});

app.listen(3000, () => console.log("Server is listening on port 3000"));
