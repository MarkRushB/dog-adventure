import { PrismaClient } from '@prisma/client';

// 防止开发环境下创建多个 PrismaClient 实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// 添加排行榜记录
export async function addLeaderboardEntry(ownerName: string, dogName: string, distance: number) {
  try {
    const entry = await prisma.leaderboardEntry.create({
      data: {
        ownerName,
        dogName,
        distance,
      },
    });
    return entry;
  } catch (error) {
    console.error('Error adding leaderboard entry:', error);
    throw error;
  }
}

// 获取排行榜数据（前10名）
export async function getLeaderboard() {
  try {
    const entries = await prisma.leaderboardEntry.findMany({
      orderBy: {
        distance: 'desc',
      },
      take: 10,
    });
    return entries;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw error;
  }
} 