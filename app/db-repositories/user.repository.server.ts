import { prisma } from "~/db/prisma.server";

export async function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function listUsers() {
  return prisma.user.findMany();
}
