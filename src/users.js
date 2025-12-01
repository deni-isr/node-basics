const users = [
  {
    user_id: 260,
    username: 'VCHar',
    password: '********',
    email: 'vchar@example.com',
    user_level_id: 1,
    created_at: '2020-09-12T06:56:41.000Z',
  },
  {
    user_id: 305,
    username: 'Donatello',
    password: '********',
    email: 'dona@example.com',
    user_level_id: 1,
    created_at: '2021-12-11T06:00:41.000Z',
  },
  {
    user_id: 3609,
    username: 'Anon5468',
    password: '********',
    email: 'x58df@example.com',
    user_level_id: 3,
    created_at: '2023-04-02T05:56:41.000Z',
  },
];

const getAllUsers = (req, res) => {
  res.json(users);
};

const getUserByID = (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.user_id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({message: 'user not found'});
  }
};

const postNewUser = (req, res) => {
  const data = req.body;
  if (!data || typeof data.username !== 'string' || data.username.trim() === '') {
    return res.status(400).json({message: 'Invalid user data, "username" is required'});
  }
  const maxId = users.reduce((m, u) => (u.user_id > m ? u.user_id : m), 0);
  const newUser = {
    user_id: maxId + 1,
    username: data.username,
    password: data.password || '********',
    email: data.email || '',
    user_level_id: data.user_level_id || 1,
    created_at: new Date().toISOString(),
  };
  users.push(newUser);
  res.status(201).json({message: 'New user created', user: newUser});
};

const putUserByID = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = users.findIndex((u) => u.user_id === id);
  if (idx === -1) {
    return res.status(404).json({message: 'user not found'});
  }
  const data = req.body;
  if (!data || (data.username && typeof data.username !== 'string')) {
    return res.status(400).json({message: 'Invalid user data'});
  }
  // Merge allowed fields
  const allowed = ['username', 'password', 'email', 'user_level_id'];
  allowed.forEach((k) => {
    if (Object.prototype.hasOwnProperty.call(data, k)) users[idx][k] = data[k];
  });
  res.status(200).json({message: 'user updated', user: users[idx]});
};

const deleteUserByID = (req, res) => {
  const id = parseInt(req.params.id);
  const idx = users.findIndex((u) => u.user_id === id);
  if (idx !== -1) {
    users.splice(idx, 1);
    res.status(200).json({message: 'user deleted'});
  } else {
    res.status(404).json({message: 'user not found'});
  }
};

export { users, getAllUsers, getUserByID, postNewUser, putUserByID, deleteUserByID };