const { isValid, parseISO, toDate } = require("date-fns");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

let todos = [
  {
    content: "wash feet",
    dueDate: new Date(),
    finished: false,
    duplicate: false,
    id: `wash feet ${new Date()}`,
  },
  {
    content: "drink dew",
    dueDate: new Date(),
    finished: false,
    duplicate: false,
    id: `drink dew ${new Date()}`,
  },
  {
    content: "eat blaze",
    dueDate: new Date(),
    finished: false,
    duplicate: false,
    id: `eat blaze ${new Date()}`,
  },
];

app.get("/", (req, res) => {
  res.send("<p>hello world!</p>");
});

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.get("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const todoToGet = todos.find((todo) => todo.id === id);

  if (todoToGet) {
    res.json(todoToGet);
  } else {
    res.sendStatus(404);
  }
});

app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const todoToDelete = todos.find((todo) => todo.id === id);

  if (todoToDelete) {
    todos = todos.filter((todo) => todo !== todoToDelete);
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
});

app.post("/api/todos/", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "content missing" });
  } else if (!body.dueDate) {
    return res.status(400).json({ error: "dueDate missing" });
  } else if (!isValid(parseISO(body.dueDate.toISOString()))) {
    return res
      .status(400)
      .json({ error: "invalid dueDate format, dueDate must be in ISO format" });
  } else if (
    todos.some(
      (todo) => todo.id === `${body.content}${toDate(parseISO(body.dueDate))}`
    )
  ) {
    return res
      .status(400)
      .json({ error: "duplicate todo, todo already exists" });
  }
  const todoToAdd = {
    content: body.content,
    dueDate: toDate(parseISO(body.dueDate)),
    finished: body.finished || false,
    duplicate: body.duplicate || false,
    id: body.id || `${body.content}${body.dueDate}`,
  };

  todos = [...todos, todoToAdd];
  res.json(todoToAdd);
});

app.listen(PORT, () => {
  console.log("server listening on port", PORT);
});
