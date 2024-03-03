const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    price:{
        type:String,
        require :true
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        require:true
    }
}
);

module.exports=mongoose.model('Menu',MenuSchema);