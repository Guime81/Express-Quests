const database = require("./database");

const getUsers = (req, res) => {
  database.query("select * from users").then(([users]) => {
    res.status(200).json(users);
  });
};

const getUserById = (req, res) => {
  const id = +req.params.id;
  database
    .query("select * from users where id= ?", [id])
    .then(([users]) => {
      if (users[0]) {
        res.status(200).json(users[0]);
      } else {
        res.send(404).send("Not Found");
      }
    })
    .catch((err) => {
      console.error(err);
      res.send(500).send("Error retrieving data from database");
    });
};

module.exports = {
  getUsers,
  getUserById,
};
