const timeSchema = require('mongodb');
const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Plase add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 charector']
    },
    address:{
        type:String,
        required: [true,'Please add an address']
    },
    tel:{
        type:String,
        required: [true,'Please add an telephone number'],
        length:[10,'Name can not be more or less than 10 charector']
    },
    openingHours: {
        open: { type: String, required: true },
        close: { type: String, required: true }
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

RestaurantSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'restaurant',
    justOne:false
});


RestaurantSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log(`Reservation being remove form restaurant ${this._id}`);
    await this.model('Reservation').deleteMany({restrautant:this._id});
    next();
    console.log(`All menus being remove form restaurant ${this._id}`);
    await this.model('Menu').deleteMany({restrautant:this._id});
    next();
});


module.exports=mongoose.model('Restaurant',RestaurantSchema);