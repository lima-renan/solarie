db = db.getSiblingDB('product_mesh');
db.createUser(
  {
    user: 'root',
    pwd: 'toor',
    roles: [{ role: 'readWrite', db: 'product_mesh' }],
  },
);

db = db.getSiblingDB('category_mesh');
db.createUser(
  {
    user: 'root',
    pwd: 'toor',
    roles: [{ role: 'readWrite', db: 'category_mesh' }],
  },
);