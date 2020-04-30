const mysql = require('mysql');
var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'bbs'
});
let allServices = {
    query: function (sql, values) {

        return new Promise((resolve, reject) => {
            pool.getConnection(function (err, connection) {
                if (err) {
                    reject(err)
                } else {
                    connection.query(sql, values, (err, rows) => {

                        if (err) {
                            reject(err)
                        } else {
                            resolve(rows)
                        }
                        connection.release()
                    })
                }
            })
        })

    },
    findUserData: function (page,tableName) {//商品分页查询
        // let _sql = `select * from user where username="${name}";`
        let _sql = `select * from ${tableName} limit ${page},5`
        return allServices.query(_sql)
    },
    check: (obj) => {//校验管理员用户名和密码
        let _sql = `select * from admin where username = '${obj.username}' and password = '${obj.password}'`
        return allServices.query(_sql, obj)
    },
    groupSetting: (obj) => {//开团设置
        console.log(obj.person, obj.time)
        let _sql = `update groupbuyset set person=${obj.person},time=${obj.time} where id=1`
        console.log(_sql)
        return allServices.query(_sql, obj)
    },
    addGoods: (obj) => {//插入普通商品
        let _sql = "insert into goods set goods_id=?,goods_desc=?,goods_price=?,goods_url=?,goods_detailurl=?,goods_name=?,issale=1;"
        console.log(_sql)
        return allServices.query(_sql, obj)
    },
    addGroupGoods: (obj) => {//插入团购商品
        let _sql = "insert into groupgoods set groupgoods_id=?,groupgoods_desc=?,groupgoods_originalprice=?,groupgoods_groupbuyprice=?,groupgoods_url=?,groupgoods_detailurl=?,groupgoods_name=?,groupgoods_sale=?,issale=1;"
        return allServices.query(_sql, obj)
    },
    sale: (obj) => { //普通商品上下架
        let _sql = `update goods set issale=${obj.issale} where goods_id='${obj.goods_id}'`
        return allServices.query(_sql, obj)
    },
    select: (obj) => { //普通商品模糊查询全部
        if (obj.content) {
            if (obj.state !== 2) {
                let _sql = `select * from goods where goods_name like '%${obj.content}%' and issale=${obj.state};`
                return allServices.query(_sql, obj)
            } else {
                let _sql = `select * from goods where goods_name like '%${obj.content}%';`
                return allServices.query(_sql, obj)
            }
        } else {
            if (obj.state !== 2) {
                let _sql = `select * from goods where issale=${obj.state};`
                return allServices.query(_sql, obj)
            } else {
                let _sql = 'select * from goods;'
                return allServices.query(_sql, obj)
            }
        }
    },
    updateGoods: (obj) => { //普通商品编辑
        let _sql = `update goods set goods_desc='${obj.goods_desc}',goods_price='${obj.goods_price}',goods_url='${obj.goods_url}',goods_detailurl='${obj.goods_detailurl}',goods_name='${obj.goods_name}' where goods_id=${obj.goods_id}`
        return allServices.query(_sql, obj)
    },
    selectGroup: (obj) => { //团购商品模糊查询
        if (obj.content) {
            if (obj.state !== 2) {
                let _sql = `select * from groupgoods where groupgoods_name like '%${obj.content}%' and issale=${obj.state};`
                return allServices.query(_sql, obj)
            } else {
                let _sql = `select * from groupgoods where groupgoods_name like '%${obj.content}%';`
                return allServices.query(_sql, obj)
            }
        } else {
            if (obj.state !== 2) {
                let _sql = `select * from groupgoods where issale=${obj.state};`
                return allServices.query(_sql, obj)
            } else {
                let _sql = 'select * from groupgoods;'
                return allServices.query(_sql, obj)
            }
        }
    },
    saleGroup: (obj) => { //团购商品上下架
        let _sql = `update groupgoods set issale=${obj.issale} where groupgoods_id='${obj.goods_id}'`
        return allServices.query(_sql, obj)
    },
    updateGruoupGoods: (obj) => { //团购商品商品编辑
        let _sql = `update groupgoods set groupgoods_desc='${obj.groupgoods_desc}',groupgoods_originalprice='${obj.groupgoods_originalprice}',groupgoods_groupbuyprice='${obj.groupgoods_groupbuyprice}',groupgoods_url='${obj.groupgoods_url}',groupgoods_detailurl='${obj.groupgoods_detailurl}',groupgoods_name='${obj.groupgoods_name}',groupgoods_sale='${obj.groupgoods_sale}' where groupgoods_id='${obj.groupgoods_id}';`
        return allServices.query(_sql, obj)
    },
    getAll: function (tableName) {//查询全部商品
        // let _sql = `select * from user where username="${name}";`
        let _sql = `select * from ${tableName};`
        return allServices.query(_sql)
    },
    selectPage:(obj) => { //普通商品模糊查询
        if (obj.content) {
            if (obj.state !== 2) {
                let _sql = `select * from goods where goods_name like '%${obj.content}%' and issale=${obj.state} limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            } else {
                let _sql = `select * from goods where goods_name like '%${obj.content}%' limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            }
        } else {
            if (obj.state !== 2) {
                let _sql = `select * from goods where issale=${obj.state} limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            } else {
                let _sql = `select * from goods limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            }
        }
    },
    selectGroupPage: (obj) => { //团购商品模糊查询分页
        if (obj.content) {
            if (obj.state !== 2) {
                let _sql = `select * from groupgoods where groupgoods_name like '%${obj.content}%' and issale=${obj.state} limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            } else {
                let _sql = `select * from groupgoods where groupgoods_name like '%${obj.content}%' limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            }
        } else {
            if (obj.state !== 2) {
                let _sql = `select * from groupgoods where issale=${obj.state} limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            } else {
                let _sql = `select * from groupgoods limit ${obj.page},5;`
                return allServices.query(_sql, obj)
            }
        }
    }
}

module.exports = allServices;