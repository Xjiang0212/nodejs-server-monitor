var express = require('express');
var router = express.Router();
const db = require('../utils/mysql')

/* GET home page. */
router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
res.json({code:1})
});

router.post('/add-server',async(req,res)=>{
    const data = await upsertData(req.body.ip, req.body.port, req.body.remarks||'', new Date().toLocaleString())
    res.json(data)
})

router.get('/get_server_list',async(req,res)=>{
    const data = await db.query('SELECT * FROM net_server_data')
    res.json({code:0,msg:'success',data})
})

// 获取服务器信息
router.get('/servers', async (req, res) => {
    const data = await db.query('SELECT * FROM net_server_data')
    if (!data) {
        console.error('Error fetching data:', err);
        res.status(500).send('Error fetching data');
        return;
      }
      res.json(data);
  });




// 更新服务器信息
router.post('/update-server', async (req, res) => {
    const { id, ip, port, status, remarks } = req.body;
  
    const sql = `
      UPDATE net_server_data
      SET ip = ?, port = ?, status = ?, remarks = ?
      WHERE id = ?;
    `;
  
    const data = await db.query(sql, [ip, port, status, remarks, id])
    if(!data) return res.status(500).send('Error updating data');
    res.json({code:0,msg:'success',data});
  });
  


// 检查、插入或更新数据
async function upsertData(ip, port, remarks = null) {
    try {
        const created_time = new Date().toLocaleString();
        // 检查是否存在该 IP 地址
        const data = await db.query('SELECT * FROM net_server_data WHERE ip = ?', [ip]);

        if (data.length > 0) {
            // 如果记录存在，更新其他内容
            const result = await db.execute(
                'UPDATE net_server_data SET port = ?, remarks = ?, created_time = ? WHERE ip = ?',
                [port, remarks, created_time, ip]
            );
            console.log('Record updated:', result);
        } else {
            // 如果记录不存在，插入新记录
            const result = await db.execute(
                'INSERT INTO net_server_data (ip, port, remarks, created_time) VALUES (?, ?, ?, ?)',
                [ip, port, remarks, created_time]
            );
            console.log('Record inserted, ID:', result.insertId);
        }
        return {code:0,msg:'success'};
    } catch (error) {
        console.error('Error in upsertData:', error);
        return {code:1,msg:'error'};
    }
}


module.exports = router;
