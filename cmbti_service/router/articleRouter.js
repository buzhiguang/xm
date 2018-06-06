
const express = require('express')
const router = express.Router()
//时间处理模块
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const myUtill = require('../models/utill')
const checkLogin = require('../middlewares/checkLogin').checkLogin
const checkNotLogin = require('../middlewares/checkLogin').checkNotLogin 
// const User = require('../controllers/user')
const Article = require('../controllers/articleHandler')
const Account = require('../controllers/accountHandler')

const json = (d)=>{console.log(d);}
// 发表文章  input : {uid:'',title:'',category:'share',content:''}
const publishArticle = (req,res)=>{
    let options = req.body || {}
    options.uid = req.session.user._id;
    // 参数验证
    if(!options.uid || !options.title || !options.category || !options.content){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{

            { 
                // 过滤xss 
            }

            // let article = await Article.publishArticle(options)
            let aid = await Article.publishArticle(options)
            options.aid = aid
            //article._id 添加到account "已发表文章数组"
            let updated = await Account.addPublishLog(options)

            res.json({
                success: true,
                message: 'Publish success!'
            })

        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: 'Publish fail' 
            })
        }


    })()

}
// 删除文章（用户删除）  input : {uid:'',aid:''}
const deleteArticle = (req,res)=>{
    let options = req.body || {}
    options.uid = req.session.user._id;
    // 参数验证
    if(!options.uid || !options.aid ){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{
            // // 清除数据
            // let r1 = await Article.deleteArticle(options)
            // // 清除用户记录
            // let r2 = await Account.deletePublishLog(options)
            let success = await Promise.all([Article.deleteArticle(options),Account.deletePublishLog(options)])
            console.log('Success',success);
            res.json({
                success: true,
                message: 'Delete success!'
            })

        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: 'Delete fail' 
            })
        }


    })()

}
// 点击喜欢文章  input : {uid:'',aid:''}
const clickArticleLike = (req,res)=>{
    let options = req.body || {}
    options.uid = req.session.user._id;
    // 参数验证
    if(!options.uid || !options.aid ){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{
            let r = await Article.clickArticleLike(options)
            // 添加结果到账户记录
            // offset===1  aid添加到account likes_atricle数组中 offset===-1 从account likes_atricle数组中移除aid
            options.offset = r.count  //返回1 或-1
            let updated = await Account.clickLikeArticleLog(options)
            res.json({
                success: true,
                message: 'Success',
                result:r
            })

        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: 'catch error' 
            })
        }


    })()
}
// 文章评论  input : {aid:'',uid:'',content:''}
const addComment = (req,res)=>{
    let options = req.body || {}
    options.uid = req.session.user._id;
    // 参数验证
    if(!options.uid || !options.aid || !options.content ){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{
            let cid = await Article.addComment(options)  //返回cid
            options.cid = cid
            // 加入到个人记录
            let added = await Account.addCommentLog(options)
            // 记录加入account
            res.json({
                success: true,
                message: 'Success',
            })

        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: 'catch error' 
            })
        }


    })()
}
// 对文章评论点赞  input : {aid:'',uid:'',cid:''}
const clickCommentZan = (req,res)=>{
    let options = req.body || {}
    options.uid = req.session.user._id;
    // 参数验证
    if(!options.uid || !options.aid || !options.cid ){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{
            let r = await Article.clickCommentZan(options)  
            
            res.json({
                success: true,
                message: 'Success',
                result: r,

            })

        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: 'catch error' 
            })
        }
    })()
}
// 获取文章 options {keyword:'',category:'ask',likes:'Number',good:boolean}
const getArticle = (req,res)=>{
    let options = req.body || {}
    // 参数验证
    if(options.likes && !/^\d+$/.test(options.likes)){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{
            let r = await Article.getArticle(options)  
            
            res.json({
                success: true,
                message: 'Success',
                result: r,

            })

        }catch(err){
            console.log(err);
            return res.json({
                success: false,
                message: 'catch error' 
            })
        }
    })()
}
// aid获取文章 options {aid:''}
const getArticleById = (req,res)=>{
    let options = req.body || {}
    // 参数验证
    if(!options.aid || typeof(options.aid)!=='string'){
        return res.json({
            success: false,
            message: 'Params Error' 
        })
    }
    (async ()=>{
        try{
            let a = await Article.getArticleById(options) 
            let result = JSON.parse(JSON.stringify(a[0]))
            delete result.like
            // delete r[0].like 
            result.content = a[1].content
            let user = await Account.getUserInfoById({uid:a[0].uid})
            result.r_name = user.r_name
            result.avatar = user.avatar
            res.json({
                success: true,
                message: 'Success',
                result: result
            })

        }catch(err){
            return res.json({
                success: false,
                message: 'catch error' 
            })
        }
    })()
}
// aid 获取评论 options {aid:'必传',page:'必传',size:'必传'}
const getCommentByAid = (req,res)=>{
        let options = req.body || {}
        options.uid = req.session.user ? req.session.user._id : ''
        // options.eid = req.body.aid || ''
        // options.page = req.body.page || ''
      if(!options.aid || !myUtill.verifyNum(options.page) || !myUtill.verifyNum(options.size)){
          return res.json({
              success:false,
              message:'Params Error'
          })
      }
      (async ()=>{
          try{
                let size = myUtill.verifyNum(options.size) ? Number(options.size) : 5  //每次条数
                let page = myUtill.verifyNum(options.page) ? Number(options.page) : 1  //页数
                let list = await Article.getComment(options)
                let newList = JSON.parse(JSON.stringify(list.slice((options.page-1)*options.size, (options.page-1)*options.size + options.size)))
                let proArr = []
                newList.forEach((v,i)=>{
                    proArr.push(Account.getUserInfoById({uid:v.uid}))
                })
                let userList = await Promise.all(proArr)
                for(let i=0;i<newList.length;i++){
                    if(userList[i]){
                        newList[i].r_name = userList[i].r_name
                        newList[i].avatar = userList[i].avatar 
                    }else{
                        newList[i].r_name = '已注销'
                        newList[i].avatar = ''
                    }
                    if(options.uid){ //如果登錄，確認是否點過贊
                        newList[i].isZaned = newList[i].zan.indexOf(options.uid)===-1 ?  false : true
                    }
                    newList[i].zan = null
                }

                res.json({
                    success: true,
                    message: 'Success',
                    result: newList,
                    sss:options.uid?options.uid:'未登錄'
                })
            }catch(err){
                return res.json({
                    success: false,
                    message: 'catch error' 
                })
            }
      })()
}


router.post('/publish',checkLogin,publishArticle);
router.post('/getArticle',getArticle);
router.post('/getCommentByAid',getCommentByAid);
// // router.post('/login',checkNotLogin,login);
// router.post('/login',login);
// router.post('/emailRetrieve',emailRetrieve); //邮箱找回密码
// router.post('/reset',resetPassword);
// // router.post('/search',checkLogin,search)
// router.post('/delSession',delSession)
// router.post('/checkNotRegister',checkNotRegister)
module.exports = router