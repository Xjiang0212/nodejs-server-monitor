const db = require('./mysql')
const net = require('net');
const config = require('./config');



async function get_server_info() {
    let rows = []
    try {
        rows = await db.query('SELECT * FROM net_server_data WHERE status = 0');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return rows;
}

async function client() {
    let rows = await get_server_info();
    if (!rows.length) {
        console.log('暂无服务器数据');
        return;
    }
    console.log('开始监控服务器数据',rows.length);
    for (let i = 0; i < rows.length; i++) {
        const item = rows[i];

        // 定义重试逻辑
        const retryConnect = (retries = 0) => {

            // 创建一个 TCP 客户端
            const client = net.createConnection({ port: item.port, host: item.ip }, () => {
                console.log('Connected to server!---', `${item.ip}:${item.port}`);
                // 发送数据
                client.write('Hello, server!');
            });

            client.on('data', async (data) => {
                // const selectSql = `
                //     SELECT * FROM net_history
                //     WHERE server_id = ? AND iface = ? AND operstate = ? AND rx_bytes = ? AND tx_bytes = ?;
                // `;
                const selectSql = `
                    SELECT *   
                    FROM host_monitor  
                    WHERE server_id = ?  
                    ORDER BY id DESC  
                    LIMIT 1;
                `;
            
                const insertSql = `
                    INSERT INTO host_monitor (
                        server_id, platform, totalMemory, freeMemory, usedMemory, memoryUsagePercentage, brand, speed, timezone, diskTotal, diskAvailable, tx_bytes, rx_bytes, tx_sec, rx_sec, created_time
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                `;
            
                try {
                    // 解析接收到的数据
                    try {
                        data = JSON.parse(data.toString());
                        // data.brand = data.brand.split(' ');
                    } catch (error) {
                        
                    }
                    const params = [
                        item.id,
                        data.platform,
                        data.totalMemory,
                        data.freeMemory,
                        data.usedMemory,
                        data.memoryUsagePercentage,
                        data.brand || 'unknown',
                        data.speed || 'unknown',
                        data.timezone,
                        data.diskTotal,
                        data.diskAvailable,
                        data.rx_bytes,
                        data.tx_sec,
                        data.tx_sec,
                        data.rx_sec,
                        new Date().toLocaleString()
                    ];
                    // 查询是否存在相同的数据
                    // const rows = await db.query(selectSql, [item.id, data.iface, data.operstate, data.rx_bytes, data.tx_bytes]);
                    const rows = await db.query(selectSql, [item.id]);
                    if(!rows.length && params[1]){
                        await db.execute(insertSql, params)
                    };
                    
                    if (rows[0].rx_bytes !== data.rx_bytes && rows[0].tx_bytes !== data.tx_bytes && params[1]) {
                        // 如果没有找到相同的数据，执行插入操作
                        const timeDifference = new Date().getTime() - new Date(rows[0]?.created_time).getTime();
                        if(timeDifference > config.other.timeDifference){
                            await db.execute(insertSql, params);
                            console.log('数据插入成功',params[0]);
                        }
                    }
                } catch (error) {
                    console.error('Error handling data:', error);
                }
            
                // 确保数据处理完成后关闭连接
                client.end();
            });

            // 处理连接关闭事件
            client.on('end', () => {
                console.log(`Disconnected from server ${item.ip}:${item.port}`);
                console.log(`Disconnected from server将在5秒后重新尝试连接 ${item.ip}:${item.port}，重试次数: ${retries + 1}`);
                setTimeout(() => retryConnect(retries + 1), 5000); // 在 5 秒后重新连接
            });

            // 监听错误事件并进行重试
            client.on('error', (error) => {
                // console.error(`Error connecting to server ${item.ip}:${item.port} -`, error);
                console.log(`将在5秒后重新尝试连接 ${item.ip}:${item.port}，重试次数: ${retries + 1}`);
                client.destroy(); // 销毁当前连接
                setTimeout(() => retryConnect(retries + 1), 5000); // 5秒后重新尝试连接
            });
        };

        // 初次尝试连接
        retryConnect();
    }
}


module.exports = client;


