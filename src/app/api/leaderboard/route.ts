import { NextResponse } from 'next/server';
import { addLeaderboardEntry, getLeaderboard } from '@/lib/db';

// GET /api/leaderboard - 获取排行榜数据
export async function GET() {
  try {
    const entries = await getLeaderboard();
    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error in GET /api/leaderboard:', error);
    return NextResponse.json(
      { error: '获取排行榜数据失败' },
      { status: 500 }
    );
  }
}

// POST /api/leaderboard - 添加新的排行榜记录
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ownerName, dogName, distance } = body;

    // 验证数据
    if (!ownerName || !dogName || typeof distance !== 'number') {
      return NextResponse.json(
        { error: '无效的数据格式' },
        { status: 400 }
      );
    }

    const entry = await addLeaderboardEntry(ownerName, dogName, distance);
    return NextResponse.json(entry);
  } catch (error) {
    console.error('Error in POST /api/leaderboard:', error);
    return NextResponse.json(
      { error: '添加排行榜记录失败' },
      { status: 500 }
    );
  }
} 