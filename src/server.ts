import express from "express";
import * as path from "path";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

type User = {
  email: string;
  password: string;
};

const users: User[] = [];

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));

// setting view engine with EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// index page
app.get("/", (req: express.Request, res: express.Response) => {
  res.render("pages/index", {
    tabTitle: "HOME PAGE",
  });
});

// login page
app.get("/login", (req: express.Request, res: express.Response) => {
  res.render("pages/login", {
    tabTitle: "LOGIN PAGE",
  });
});

app.post("/login", (req: express.Request, res: express.Response) => {
  const foundUser = users.find((user) => {
    return user.email === req.body.email && user.password === req.body.password;
  });

  if (foundUser) {
    res.redirect("/");
    return;
  }

  res.redirect("/login");
});

// register page
app.get("/register", (req: express.Request, res: express.Response) => {
  res.render("pages/register", {
    tabTitle: "REGISTER PAGE",
  });
});

app.post("/register", (req: express.Request, res: express.Response) => {
  const newUser: User = {
    email: req.body.email,
    password: req.body.password,
  };

  users.push(newUser);
  res.redirect("/login");
});

app.listen(3000, () => console.log("Server is listening on port 3000"));
