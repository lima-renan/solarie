db = db.getSiblingDB('cart_mesh');
db.createUser(
  {
    user: 'root',
    pwd: 'toor',
    roles: [{ role: 'readWrite', db: 'cart_mesh' }],
  },
);

db = db.getSiblingDB('wishlist_mesh');
db.createUser(
  {
    user: 'root',
    pwd: 'toor',
    roles: [{ role: 'readWrite', db: 'wishlist_mesh' }],
  },
);