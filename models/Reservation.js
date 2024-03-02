const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    apptDate:{
        type:Date,
        require:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        require :true
    },
    restaurant:{
        type:mongoose.Schema.ObjectId,
        ref:'Restaurant',
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
}
);

module.exports=mongoose.model('Reservation',ReservationSchema);