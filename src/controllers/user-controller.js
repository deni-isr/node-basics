import bcrypt from 'bcryptjs';
import {validationResult} from 'express-validator';
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
    // ВНИМАНИЕ: Если listAllUsers возвращает объекты, содержащие хеш пароля,
    // его нужно удалить перед отправкой клиенту!
    res.json(result);
  } else {
    res.status(500).json(result);
  }
};

const getUserById = async (req, res) => {
  const user = await findUserById(req.params.id);
  if (user) {
    // УДАЛЕНИЕ ПАРОЛЯ ПЕРЕД ОТПРАВКОЙ
    delete user.password; 
    res.json(user);
  } else {
    res.sendStatus(404);
  }
};

const postUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed');
    error.status = 400; 
    error.errors = errors.array();
    return next(error);
  }

  const {username, password, email} = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUserId = await addUser({
      username, 
      password: hashedPassword,
      email
    });

    res.status(201).json({message: 'New user added', user_id: newUserId});
  } catch (e) {
    next(e);
  }
};

/**
 * @apiDescription ВОЗВРАЩАЕТ ИНФОРМАЦИЮ О ТЕКУЩЕМ АВТОРИЗОВАННОМ ПОЛЬЗОВАТЕЛЕ.
 * Данные берутся из req.user (после JWT-аутентификации).
 */
const getMe = async (req, res) => {
    // req.user содержит user_id и user_level_id, декодированные из токена.
    // Если вам нужны полные данные из БД, их нужно получить здесь.
    try {
        const user = await findUserById(req.user.user_id);
        
        if (user) {
            delete user.password; // Удаляем хеш
            res.json(user);
        } else {
            // Технически не должно произойти, если токен валиден
            res.status(404).json({message: 'User not found, despite valid token.'});
        }
    } catch (e) {
        res.status(500).json({message: 'Server error retrieving user data.'});
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

// ЭКСПОРТ: Все функции, включая getMe, теперь доступны
export {postUser, getUsers, getUserById, getMe, putUser, deleteUser};