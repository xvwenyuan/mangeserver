const Koa = require('koa');//导入一个class
// 注意require('koa-router')返回的是函数:
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const { findUserData, check, groupSetting, addGoods, addGroupGoods, sale, select, updateGoods, selectGroup, saleGroup, updateGruoupGoods, getAll, selectPage, selectGroupPage } = require('./mysql');
const jwt = require('jsonwebtoken');//生成token
const md5 = require('js-md5')
const koajwt = require('koa-jwt')
var cors = require('koa2-cors');
const app = new Koa();//创建一个koa对象
app.use(bodyParser());
app.use(cors({
    origin: function (ctx) {
        return '*';
    },
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],

}));
// 错误处理
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    })
})

app.use(koajwt({
    secret: 'my_token'
}).unless({
    path: '/pc/login'
}));
// log request URL:
// 对于任何请求，app将调用该异步函数处理请求
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    await next();
});

// router.get('/groupgoods', async (ctx, next) => {//获取团购商品
//     try {
//         let goodsList = await findUserData('groupgoods');
//         ctx.response.body = goodsList;
//     } catch (error) {
//         console.log('error')
//     }
// });

//后台管理系统接口
router.post('/pc/login', async (ctx, next) => {//后台管理系统登录
    const username = ctx.request.body.username
    const password = md5(ctx.request.body.password + '666')//md5加密加盐
    const obj = { username, password }
    try {
        let res = await check(obj)
        res = JSON.parse(JSON.stringify(res))
        if (res.length) {//用户名,密码正确，获取token
            const token = jwt.sign({
                username,
                password
            }, 'my_token', {
                expiresIn: '4h' //到期时间
            });
            ctx.response.body = {
                username: res[0].username,
                root: res[0].root,
                token: token,
                code: 1
            }
        } else {
            ctx.response.body = '用户名或密码错误！'
        }
    } catch (error) {
        console.log(error)
    }
})
router.post('/pc/goodlist', async (ctx, next) => {//获取普通商品列表
    let page = ctx.request.body.page
    try {
        let goodsList = await findUserData(page, 'goods');
        let total = (await getAll('goods')).length;
        ctx.response.body = { goodsList, total };
    } catch (error) {
        console.log('error')
    }
})
router.post('/pc/groupgoodslist', async (ctx, next) => {//获取团购商品列表
    let page = ctx.request.body.page
    try {
        let total = (await getAll('groupgoods')).length;//获取总条目数数
        let goodsList = await findUserData(page, 'groupgoods');//查询
        ctx.response.body = { goodsList, total };
    } catch (error) {
        console.log('error')
    }
})
router.post('/pc/groupsetting', async (ctx, next) => {//团购设置
    let setData = ctx.request.body
    try {
        await groupSetting(setData)
        ctx.response.body = '';

    } catch (error) {
        console.log(error)
    }

})
router.post('/pc/addgoods', async (ctx, next) => {//普通商品添加
    let data = ctx.request.body
    try {
        await addGoods([data.goods_id, data.goods_desc, data.goods_price, data.goods_url, data.goods_detailurl, data.goods_name])
        ctx.response.body = '';

    } catch (error) {
        console.log('错误')
    }

})
router.post('/pc/addgroupgoods', async (ctx, next) => {//团购商品添加
    let data = ctx.request.body
    let arr = [data.groupgoods_id, data.groupgoods_desc, data.groupgoods_originalprice, data.groupgoods_groupbuyprice, data.groupgoods_url, data.groupgoods_detailurl, data.groupgoods_name, data.groupgoods_sale]
    console.log(arr)
    try {
        await addGroupGoods(arr);
        ctx.response.body = '';

    } catch (error) {
        console.log(error)
    }

})
router.post('/pc/editgoods', async (ctx, next) => {//普通商品编辑
    let setData = ctx.request.body
    console.log(setData)
    try {
        await updateGoods(setData)
        ctx.response.body = '';
    } catch (error) {
        console.log(error)
    }
})
router.post('/pc/editgroupgoods', async (ctx, next) => {//团购商品编辑
    let setData = ctx.request.body
    try {
        await updateGruoupGoods(setData)
        ctx.response.body = '';
    } catch (error) {
        console.log(error)
    }

})
router.post('/pc/issale', async (ctx, next) => {//普通商品上下架
    let setData = ctx.request.body
    try {
        sale(setData)
        ctx.response.body = '';
    } catch (error) {
    }
})
router.post('/pc/select', async (ctx, next) => {//普通商品模糊查询
    let setData = ctx.request.body
    console.log(setData)
    try {
        let total = (await select(setData)).length
        let result = await selectPage(setData)
        ctx.response.body = { result, total };
    } catch (error) {
        console.log(error)
    }
})
router.post('/pc/selectgroup', async (ctx, next) => {//团购商品模糊查询
    let setData = ctx.request.body
    console.log(setData)
    try {
        let total = (await selectGroup(setData)).length
        let goodsList = await (selectGroupPage(setData))
        ctx.response.body = {goodsList,total};
    } catch (error) {
        console.log(error)
    }
})
router.post('/pc/issalegroup', async (ctx, next) => {//普通商品上下架
    let setData = ctx.request.body
    try {
        await saleGroup(setData)
        ctx.response.body = '';
    } catch (error) {
        console.log(error)
    }
})
// router.post('/pc/tohome', async (ctx, next) => {//二次登录
//     const token = ctx.request.body.token
//     console.log(token)
//     ctx.response.body = '';

// })


// add router middleware:
app.use(router.routes());

app.listen(3001, '192.168.0.104');//3000端口监听
console.log('app started at port 3001...');
