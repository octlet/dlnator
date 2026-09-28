import { prisma } from "./prisma";

const SETTINGS_ID = 1;

export async function getSettings() {
  const existing = await prisma.setting.findUnique({
    where: { id: SETTINGS_ID },
  });

  if (existing) return existing;

  return prisma.setting.create({ data: { id: SETTINGS_ID } });
}

export function updateSettings(data) {
  return prisma.setting.upsert({
    where: { id: SETTINGS_ID },
    create: { id: SETTINGS_ID, ...data },
    update: data,
  });
}
