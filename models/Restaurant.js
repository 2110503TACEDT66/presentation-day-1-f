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
    district:{
        type:String,
        require:[true,'Please adda district']
    },
    province:{
        type:String,
        required:[true,'Please add a province']
    },
    postalcode:{
        type:String,
        required:[true,'Please add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type:String
    },
    region:{
        type:String,
        required:[true,'Please add a region']
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
});

module.exports=mongoose.model('Restaurant',RestaurantSchema);