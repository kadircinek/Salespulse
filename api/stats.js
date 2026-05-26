// GET /api/stats → günlük + haftalık performans istatistikleri
const { getDb, cors, verifyToken } = require('./_db');

module.exports = async (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = verifyToken(req);
  if (!user) return res.status(401).json({ error: 'Yetkisiz' });

  const sql = getDb();

  try {
    // Bugünkü aktiviteler (bu kullanıcı)
    const todayActivities = await sql`
      SELECT a.result, COUNT(*) as count
      FROM activities a
      WHERE a.created_by = ${user.id}
        AND a.created_at >= CURRENT_DATE
      GROUP BY a.result
    `;

    // Bugünkü toplam arama sayısı
    const todayTotal = await sql`
      SELECT COUNT(*) as total FROM activities
      WHERE created_by = ${user.id} AND created_at >= CURRENT_DATE
    `;

    // Haftalık arama sayısı (son 7 gün, gün gün)
    const weeklyData = await sql`
      SELECT
        DATE(created_at) as day,
        COUNT(*) as total
      FROM activities
      WHERE created_by = ${user.id}
        AND created_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(created_at)
      ORDER BY day ASC
    `;

    // Bu kullanıcının günlük hedefi
    const userRow = await sql`
      SELECT daily_target FROM users WHERE id = ${user.id}
    `;
    const dailyTarget = userRow[0]?.daily_target || 20;

    // Yeni müşteriler (son 24 saat)
    const newCustomers = await sql`
      SELECT COUNT(*) as count FROM customers
      WHERE created_at >= NOW() - INTERVAL '24 hours'
    `;

    // Takip tarihi geçmiş müşteriler
    const overdueFollowups = await sql`
      SELECT COUNT(*) as count FROM customers
      WHERE follow_up_date <= CURRENT_DATE AND follow_up_date IS NOT NULL
        AND status NOT IN ('sold', 'lost')
    `;

    // Tüm temsilcilerin bugünkü performansı (yönetici görünümü)
    const teamToday = await sql`
      SELECT u.name, u.id, COUNT(a.id) as call_count, u.daily_target
      FROM users u
      LEFT JOIN activities a ON a.created_by = u.id AND a.created_at >= CURRENT_DATE
      GROUP BY u.id, u.name, u.daily_target
      ORDER BY call_count DESC
    `;

    return res.json({
      today: {
        total:   parseInt(todayTotal[0]?.total || 0),
        target:  dailyTarget,
        byResult: todayActivities.reduce((acc, r) => {
          acc[r.result] = parseInt(r.count);
          return acc;
        }, {}),
      },
      weekly: weeklyData.map(d => ({
        day:   d.day,
        total: parseInt(d.total),
      })),
      newCustomers24h: parseInt(newCustomers[0]?.count || 0),
      overdueFollowups: parseInt(overdueFollowups[0]?.count || 0),
      team: teamToday,
    });

  } catch (err) {
    console.error('stats error:', err);
    return res.status(500).json({ error: err.message });
  }
};
