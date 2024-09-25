db = db.getSiblingDB('user_mesh');
db.createUser(
  {
    user: 'root',
    pwd: 'toor',
    roles: [{ role: 'readWrite', db: 'user_mesh' }],
  },
);
