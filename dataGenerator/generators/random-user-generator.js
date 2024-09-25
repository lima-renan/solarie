const faker = require("faker");
const User = require("../models/user");

const generateRandomName = () => {
  return faker.name.firstName();
};

const generateRandomLastName = () => {
  return faker.name.lastName();
};

const usedEmails = new Set();

const generateRandomEmail = () => {
  let email = faker.internet.email().toLowerCase();
  while (usedEmails.has(email)) {
    email = faker.internet.email().toLowerCase();
  }
  usedEmails.add(email);
  return email;
};

const generateRandomBirthdate = () => {
  const dayBday = faker.datatype.number({ min: 1, max: 28 });
  const monthBday = faker.datatype.number({ min: 1, max: 12 });
  const yearBday = faker.datatype.number({ min: 1900, max: 2005 });
  return { dayBday, monthBday, yearBday };
};

const generateRandomUser = async () => {
  const firstName = generateRandomName();
  const lastName = generateRandomLastName();
  const email = generateRandomEmail();
  const username = email;
  const { dayBday, monthBday, yearBday } = generateRandomBirthdate();
  const gender = faker.random.arrayElement(["Feminino", "Masculino", "Não declarar"]);

  const now = new Date();
  const newUser = new User({
    firstName,
    lastName,
    gender,
    dayBday,
    monthBday,
    yearBday,
    email,
    username,
    authStrategy: "local",
    refreshToken: [{ refreshToken: faker.datatype.uuid() }],
    createdAt: now,
    updatedAt: now,
  });

  const user = await newUser.save();
  return user;
};

const numberOfUsersToGenerate = 10000;

exports.generateMultipleRandomUsers = async () => {
  try {
    const users = [];

    for (let i = 1; i <= numberOfUsersToGenerate; i++) {
      const user = await generateRandomUser();
      console.log(`Adicionado usuário ${i} de ${numberOfUsersToGenerate}`);
    }
  } catch (error) {
    console.error("Erro ao gerar usuários:", error);
  }
};