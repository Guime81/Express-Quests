const database = require("./database");

/*
const getUsers = (req, res) => {
  database.query("select * from users").then(([users]) => {
    res.status(200).json(users);
  });
};
*/
// Nouveau code permettant la recup de querystring dans l'url
const getUsers = (req, res) => {
  const initialSql =
    "select id, firstname, lastname, email, city, language from users";
  const where = [];

  if (req.query.city != null) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }
  if (req.query.language != null) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "where" : "and"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUserById = (req, res) => {
  const id = +req.params.id;
  database
    .query(
      "select id, firstname, lastname, email, city, language from users where id= ?",
      [id]
    )
    .then(([users]) => {
      if (users[0]) {
        res.status(200).json(users[0]);
      } else {
        res.status(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "INSERT INTO users(firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) => {
      res.location(`/api/users/${result.insertId}`).sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error saving the users");
    });
};

const updateUser = (req, res) => {
  const id = +req.params.id;
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;

  // UPDATE /api/users/:id ne devraient fonctionner que si l'id correspond à celui du payload du token (req.payload.sub)
  if (id === req.payload.sub) {
    database
      .query(
        "update users set firstname = ?, lastname = ?, email = ?, city = ?, language = ?, hashedPassword = ? where id = ?",
        [firstname, lastname, email, city, language, hashedPassword, id]
      )
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error editing the user");
      });
  } else {
    res.sendStatus(403);
  }
};

const deleteUser = (req, res) => {
  const id = +req.params.id;

  //DELETE /api/users/:id ne devraient fonctionner que si l'id correspond à celui du payload du token (req.payload.sub)
  if (id === req.payload.sub) {
    database
      .query("delete from users where id = ?", [id])
      .then(([result]) => {
        if (result.affectedRows === 0) {
          res.status(404).send("Not Found");
        } else {
          res.sendStatus(204);
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error deleting the user");
      });
  } else {
    res.sendStatus(403);
  }
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("select * from users where email = ?", [email])
    .then(([users]) => {
      if (users[0] != null) {
        req.user = users[0];

        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getUsers,
  getUserById,
  postUser,
  updateUser,
  deleteUser,
  getUserByEmailWithPasswordAndPassToNext,
};
