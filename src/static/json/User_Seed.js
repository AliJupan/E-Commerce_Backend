import bcrypt from "bcrypt";

export default async () => [
  {
    name: "Admin",
    surname: "Admin",
    email: "alizhupani2002@gmail.com",
    password: await bcrypt.hash("admin", 10),
    // phone_number: "078 251 770",
    address: "Gostivar",
    birthday: new Date(2002, 7, 22),
    role: "SUPER_ADMIN",
    isEnabled: true,
  },
];
