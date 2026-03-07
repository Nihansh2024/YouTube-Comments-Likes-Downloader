import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const totalUsers = await db.user.count();
    const totalDownloads = await db.download.count();
    const proSubscribers = await db.subscription.count({
      where: { plan: 'PRO' },
    });
    
    const downloadsThisMonth = await db.download.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const recentDownloads = await db.download.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { email: true, name: true },
        },
      },
    });

    const usersList = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        subscription: true,
        _count: {
          select: { downloads: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      totalUsers,
      totalDownloads,
      proSubscribers,
      downloadsThisMonth,
      recentDownloads,
      users: usersList,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to get admin stats' },
      { status: 500 }
    );
  }
}
