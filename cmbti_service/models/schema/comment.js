const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    eid:String,
    list:Array,
    create_time: Date,
    cid:String
    // list:[
    //     {
    //         uid:'',
    //         res:'',
    //         data:'',
    //         c_time:'',
    //         zan:['eid','eid'...]
    //     }
    // ]

})

const Comment = module.exports = mongoose.model('Comment', commentSchema) 