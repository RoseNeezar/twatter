export const Users = [
  {
    email: "ember@g.co",
    password: 111111,
    firstName: "ember",
    lastName: "spririt",
    username: "emberSpirit",
  },
  {
    email: "earth@g.co",
    password: 111111,
    firstName: "earth",
    lastName: "spirit",
    username: "earthSpirit",
  },
  {
    email: "void@g.co",
    password: 111111,
    firstName: "void",
    lastName: "spirit",
    username: "voidSpirit",
  },
  {
    email: "storm@g.co",
    password: 111111,
    firstName: "storm",
    lastName: "spirit",
    username: "stormSpirit",
  },
];

export const FakeUser = () => {
  const randomIndex = Math.floor(Math.random() * Users.length * 10);
  return Users[randomIndex];
};
