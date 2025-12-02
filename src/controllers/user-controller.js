import {
  addUser,
  deleteUserById,
  findUserById,
  listAllUsers,
  updateUserById,
} from '../models/user-model.js';

const getUsers = async (req, res) => {
  const result = await listAllUsers();
  if (!result.error) {
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res) => {
  const {username, password, email, user_level_id} = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({message: 'Missing required fields: username, password, email'});
  }

  const result = await addUser({username, password, email, user_level_id});
  if (result.user_id) {
    res.status(201).json({message: 'New user added.', ...result});
  } else {
    res.status(500).json(result);
  }
};

const putUser = async (req, res) => {
  const user_id = req.params.id;
  const {username, email, user_level_id} = req.body;

  if (!username && !email && !user_level_id) {
    return res.status(400).json({message: 'No data provided to update.'});
  }
  
  const userData = {username, email, user_level_id, user_id};

  const result = await updateUserById(userData);
  
  if (result.error) {
    return res.status(500).json(result);
  }

  if (result) {
    res.json({message: `User ${user_id} updated successfully.`});
  } else {
    res.status(404).json({message: 'User not found or no changes made.'});
  }
};

const deleteUser = async (req, res) => {
  const user_id = req.params.id;
  const result = await deleteUserById(user_id);
  
  if (result.error) {
    return res.status(500).json(result);
  }

  if (result) {
    res.json({message: `User ${user_id} deleted successfully.`});
  } else {
    res.status(404).json({message: 'User not found.'});
  }
};

export {getUsers, getUserById, postUser, putUser, deleteUser};