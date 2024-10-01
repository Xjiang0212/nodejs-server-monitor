const mysql = require('mysql2');
const {mysql:mysql_config} = require('./config');

// 创建数据库连接池
const pool = mysql.createPool({
    host: mysql_config.host,       // 数据库主机
    user: mysql_config.user,            // 数据库用户
    password: mysql_config.password,    // 数据库密码
    database: mysql_config.database, // 数据库名称
    waitForConnections: mysql_config.waitForConnections,
    connectionLimit: mysql_config.connectionLimit,
    queueLimit: mysql_config.queueLimit
});

// 获取连接
const promisePool = pool.promise();

module.exports = {
    // 查询操作
    query: async (sql, params) => {
        try {
            const [rows, fields] = await promisePool.query(sql, params);
            return rows;
        } catch (error) {
            console.error('Database query error:', error);
            throw error;
        }
    },
    
    // 执行更新操作
    execute: async (sql, params) => {
        try {
            const [result] = await promisePool.execute(sql, params);
            return result;
        } catch (error) {
            // console.error('Database execute error:', error);
            throw error;
        }
    }
};
