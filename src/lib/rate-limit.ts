import { db } from './db';

// Free for all - unlimited downloads!
export async function canUserDownload(userId: string): Promise<{ canDownload: boolean; remaining: number }> {
  // Always allow downloads - completely free!
  return { canDownload: true, remaining: -1 }; // -1 means unlimited
}

export async function recordDownload(
  userId: string,
  videoId: string,
  videoTitle: string | null,
  commentCount: number,
  format: string
) {
  return db.download.create({
    data: {
      userId,
      videoId,
      videoTitle,
      commentCount,
      format,
    },
  });
}

export async function getUserStats(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  const totalDownloads = await db.download.count({
    where: { userId },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const downloadsToday = await db.download.count({
    where: {
      userId,
      createdAt: { gte: today },
    },
  });

  return {
    user,
    totalDownloads,
    downloadsToday,
    remainingToday: -1, // -1 means unlimited
  };
}
