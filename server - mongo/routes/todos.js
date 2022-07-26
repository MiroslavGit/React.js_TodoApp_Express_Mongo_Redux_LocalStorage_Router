const dotenv = require("dotenv")
dotenv.config('../.env')

const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

const todoModel = require('../models/todo');


router.get('/', authenticateToken, async (req, res) => {
  try {
    const todoList = await todoModel.find({ userId: res.userId });
    res.status(200).send(todoList);
  } catch (err) {
    res.status(500).send(err);
  }
})


router.post('/', authenticateToken, async (req, res) => {
  if (req.body === undefined) {
    res.status(500).send({Error: 'Missing body'});
    return;
  }
  if (req.body.text === undefined) {
    console.log("todo POST: invalid JSON format");
    res.status(500).send({Error: 'Invalid JSON format'});
    return;
  }
  if (typeof req.body.text !== 'string') {
    console.log("todo POST: wrong type")
    res.status(500).send({Error: 'Invalid type'});
    return;
  }

  const newTodo = new todoModel({
    text: req.body.text,
    userId: res.userId
  })
  
  try {
    const createdTodo = await newTodo.save();
    res.status(201).json(createdTodo);
  } catch (err) {
    res.status(500).json(err);
  }
})


router.put('/:id', authenticateToken, getTodo, async (req, res) => {
  if (req.body === undefined) {
    res.status(500).send({Error: 'Missing body'});
    return;
  }
  if (req.body.newState === undefined){
    console.log("todo PUT: invalid JSON format")
    res.status(500).send({Error: 'Invalit JSON format'});
    return;
  }
  if (typeof req.body.newState !== 'number') {
    console.log("todo PUT: wrong type")
    res.status(500).send({Error: 'Invalid type'});
    return;
  }

  res.todo.state = req.body.newState;

  
  try {
    const updatedTodo = await res.todo.save();
    res.status(200).json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})


router.delete('/:id', authenticateToken, getTodo, async (req, res) => {
  try {
    await res.todo.remove()
    res.status(200).json({ message: 'Deleted Todo' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
})

async function getTodo(req, res, next) {
  let findTodo
  try {
    findTodo = await todoModel.findById(req.params.id);
    if (findTodo == null) {
      return res.status(404).json({ message: 'Cannot find todo' });
    }
    if (findTodo.userId !== res.userId) {
      return res.status(404).json({ message: 'Cannot modify todos of other users' });      
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.todo = findTodo;
  next();
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) return res.sendStatus(403)
    
    res.userId = data.id
    next()
  })
}

module.exports = router;