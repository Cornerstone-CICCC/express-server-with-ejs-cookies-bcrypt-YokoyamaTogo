import express from "express";
import * as path from "path";
import bcrypt from "bcrypt";
import cookieSession from "cookie-session";

const app = express();
const __dirname = path.dirname(new URL(import.meta.url).pathname);

type User = {
  email: string;
  hashedPassword: string;
};

const users: User[] = [];

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    name: "session",
    keys: ["secret-key"],
    maxAge: 24 * 60 * 60 * 1000,
  }),
);

// setting view engine with EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

// index page
app.get("/", (req: express.Request, res: express.Response) => {
  res.render("pages/index", {
    email: req.session?.email,
    tabTitle: "HOME PAGE",
  });
});

// login page
app.get("/login", (req: express.Request, res: express.Response) => {
  res.render("pages/login", {
    tabTitle: "LOGIN PAGE",
  });
});

app.post("/login", async (req: express.Request, res: express.Response) => {
  const foundUser = users.find((user) => user.email === req.body.email);

  if (
    foundUser &&
    (await bcrypt.compare(req.body.password, foundUser.hashedPassword))
  ) {
    req.session = {
      email: foundUser.email,
    };

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

app.post("/register", async (req: express.Request, res: express.Response) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const newUser: User = {
    email: req.body.email,
    hashedPassword,
  };

  users.push(newUser);
  res.redirect("/login");
});

app.listen(3000, () => console.log("Server is listening on port 3000"));
