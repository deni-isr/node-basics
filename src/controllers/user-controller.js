import bcrypt from 'bcryptjs';
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

const postUser = async (req, res, next) => {
  const {username, password, email, user_level_id} = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({message: 'Missing required fields'});
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const result = await addUser({username, password: hashedPassword, email, user_level_id});
  
  if (result.user_id) {
    res.status(201).json({message: 'New user added.', ...result});
  } else {
    res.status(500).json(result);
  }

  try {
    // Attempt to add the new user
    const newUserId = await addUser(req.body); 
    res.status(201).json({message: 'New user added', user_id: newUserId});
  } catch (e) {
    // If there is an error, pass it to the error handler middleware
    const error = new Error(`SQL Error: ${e.message}`);
    error.status = 500;
    next(error); 
  }

};

const putUser = async (req, res) => {
  const target_id = Number(req.params.id); 
  const token_id = req.user.user_id;

  if (target_id !== token_id) {
    return res.status(403).json({ 
      message: 'Forbidden. You can only update your own user data.' 
    });
  }
  
  const {username, email, user_level_id = 2} = req.body;
  
  const userData = {username, email, user_level_id, user_id: target_id};

  const result = await updateUserById(userData); 

  if (result) {
    res.json({message: `User ${target_id} updated successfully.`});
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