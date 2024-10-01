const mysql = {
    host: 'localhost',       // 数据库主机
    user: 'root',            // 数据库用户
    password: 'root',    // 数据库密码
    database: 'monitor_network', // 数据库名称
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    
}
const other = {
    timeDifference: 2000          //多久添加一条数据
}


module.exports = {
    mysql,
    other
}