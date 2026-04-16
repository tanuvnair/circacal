import {
  findUserById,
  findUserByEmail,
  listUsers,
} from "~/db-repositories/user.repository.server";

export async function getUserById(id: string) {
  return findUserById(id);
}

export async function getUserByEmail(email: string) {
  return findUserByEmail(email);
}

export async function getAllUsers() {
  return listUsers();
}
