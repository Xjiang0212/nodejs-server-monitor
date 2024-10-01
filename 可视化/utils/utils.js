// 定义删除数据的函数
async function deleteOldRecords() {
    const sql = `
        DELETE FROM your_table
        WHERE id < (
            SELECT id
            FROM (
                SELECT id
                FROM your_table
                ORDER BY id DESC
                LIMIT 50000, 1
            ) AS temp_table
        );
    `;

    try {
        const connection = await pool.getConnection();
        const [result] = await connection.execute(sql);
        console.log(`Deleted ${result.affectedRows} old records.`);
        connection.release();
    } catch (error) {
        console.error('Error deleting old records:', error);
    }
}

// 每小时执行一次
setInterval(() => {
    deleteOldRecords();
}, 60 * 60 * 1000); // 3600000 毫秒 = 1 小时