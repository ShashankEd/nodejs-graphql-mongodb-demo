const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { graphqlHTTP } = require("express-graphql");
const ruruHTML = require("ruru/server");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const { User } = require("./models/users");
const dotenv = require("dotenv");
dotenv.config(".env");

const schema = require("./Schemas");

mongoose
  .connect(
    "mongodb+srv://admin:admin1234@groceryapp.z5rbs.mongodb.net/?appName=groceryapp",
  )
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(
  "/graphql/authenticate",
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
    },
    (username, password, done) => {
      console.log("Inside LocalStrategy");
      User.findOne({ username }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false);
        if (user.password !== password) return done(null, false);
        return done(null, user);
      });
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET_KEY,
    },
    (payload, done) => {
      console.log(`Inside JwtStrategy payload =${JSON.stringify(payload)}`);
      User.findById(payload.sub)
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((error) => {
          if (err) return done(err, false);
        });
    },
  ),
);

// Apply Passport middleware
app.use(passport.initialize());

app.use(
  "/graphql/other",
  passport.authenticate("jwt", { session: false }),
  graphqlHTTP((req) => ({
    schema,
    context: { user: req.user }, // Pass the authenticated user to the context
    graphiql: true,
  })),
);

app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML.ruruHTML({ endpoint: "/graphql" }));
});

app.listen(process.env.PORT,  () =>  {
    console.log(`Server running on ${process.env.PORT}`);
});
