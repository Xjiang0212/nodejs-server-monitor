const net = require('net');
const os = require('os');
const { execSync } = require('child_process');
const si = require('systeminformation');

// 创建一个数组存储所有连接的客户端
const clients = [];

// 创建 TCP 服务器
const server = net.createServer((socket) => {
  console.log('Client connected');

  // 将新连接的客户端加入到 clients 数组
  clients.push(socket);

  // 当客户端断开连接时，从数组中移除客户端
  socket.on('end', () => {
    console.log('Client disconnected');
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  // 如果客户端发生错误
  socket.on('error', (err) => {
    // console.error('Socket error:', err);
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

// 服务器监听的端口和地址
const PORT = 12345;
const HOST = '0.0.0.0';  // 允许外部连接

server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

// 每秒获取网络状态数据并发送给所有连接的客户端
setInterval(() => {

  const serveMessage = {}
  function getServeMessage() {
    // 获取操作系统类型
    const platform = os.platform();
    const release = os.release();

    serveMessage.platform = platform;
    serveMessage.release = release;

    // 获取内存信息
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercentage = (usedMemory / totalMemory) * 100;

    serveMessage.totalMemory = (totalMemory / (1024 ** 2)).toFixed(2);
    serveMessage.freeMemory = (freeMemory / (1024 ** 2)).toFixed(2);
    serveMessage.usedMemory = (usedMemory / (1024 ** 2)).toFixed(2);
    serveMessage.memoryUsagePercentage = memoryUsagePercentage.toFixed(2);

    // 获取 CPU 使用率
    const cpuInfo = os.cpus();
    const cpuUsagePercentage = cpuInfo.reduce((acc, cpu) => {
      const total = Object.values(cpu.times).reduce((a, b) => a + b, 0);
      const idle = cpu.times.idle;
      return acc + ((total - idle) / total) * 100;
    }, 0) / cpuInfo.length;

    serveMessage.cpuUsagePercentage = cpuInfo;

    // 获取时区
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    serveMessage.timezone = timezone;

    // 获取磁盘信息
    let diskTotal = 0, diskAvailable = 0;

    try {
      const diskInfo = execSync('df -B1 --output=size,avail /').toString().split('\n')[1].trim().split(/\s+/);
      if (diskInfo.length >= 2) {
        diskTotal = (parseInt(diskInfo[0]) / (1024 ** 3)).toFixed(2);
        diskAvailable = (parseInt(diskInfo[1]) / (1024 ** 3)).toFixed(2);
      }
    } catch (err) {
      console.error('无法获取磁盘信息:', err);
    }
    serveMessage.diskTotal = diskTotal;
    serveMessage.diskAvailable = diskAvailable;
  }

  // 获取网络流量使用情况
  si.networkStats().then(data => {
    // 将获取的数据转化为 JSON 字符串
    const message = data[0];
    getServeMessage()


    const tx_sec = (message.tx_sec / 1024).toFixed(2);
    const rx_sec = (message.rx_sec / 1024).toFixed(2);
    const tx_bytes = (message.tx_bytes / 1024 / 1024).toFixed(2);
    const rx_bytes = (message.rx_bytes / 1024 / 1024).toFixed(2);

    serveMessage.tx_sec = tx_sec;
    serveMessage.rx_sec = rx_sec;
    serveMessage.tx_bytes = tx_bytes;
    serveMessage.rx_bytes = rx_bytes;

    si.cpu().then(data => {
      serveMessage.manufacturer = data.manufacturer;
      serveMessage.brand = data.brand;
      serveMessage.speed = data.speed;

      // 输出系统信息
      console.log('部署成功----系统信息:');
      console.log(`操作系统: ${serveMessage.platform} ${serveMessage.release}`);
      console.log(`总内存: ${serveMessage.totalMemory} MB`);
      console.log(`剩余内存: ${serveMessage.freeMemory} MB`);
      console.log(`已使用内存: ${serveMessage.usedMemory} MB`);
      console.log(`内存使用率: ${serveMessage.memoryUsagePercentage}%`);
      // console.log(`CPU 使用率: ${serveMessage.cpuUsagePercentage}%`);
      console.log(`CPU 模型: ${data.manufacturer} ${data.brand}`);
      console.log(`当前速度: ${data.speed} GHz`);
      console.log(`时区: ${serveMessage.timezone}`);
      console.log(`磁盘总大小: ${serveMessage.diskTotal} GB`);
      console.log(`磁盘剩余大小: ${serveMessage.diskAvailable} GB`);
      console.log(`上传总数据: ${serveMessage.tx_bytes} MB`);
      console.log(`下载总数据: ${serveMessage.rx_bytes} MB`);
      console.log(`上传速度: ${serveMessage.tx_sec} KB/s`);
      console.log(`1下载速度: ${serveMessage.rx_sec} KB/s`);
      // 向所有已连接的客户端发送数据
      clients.forEach(client => {
        client.write(JSON.stringify(serveMessage) + '\n');  // 添加换行符以便于客户端解析
      });
    });
  }).catch(error => console.error('Error fetching network stats:', error));

}, 1000); // 每秒发送一次
