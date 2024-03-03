const Reservation = require('../models/Reservation');
const Restaurant  = require('../models/Restaurant');

exports.getReservations=async (req,res,next)=>{
    let query;
    if(req.user.role !== 'admin'){
        query = Reservation.find({user:req.user.id}).populate({
            path:'restaurant',
            select:'name province tel'
        });
    }else{
        if(req.params.restaurantId){
            console.log(req.params.restaurantId);
            query = Reservation.find({hospital:req.params.restaurantId}).populate({
                path:'restaurant',
                select:'name province tel'
            });
        }else{
        query = Reservation.find().populate({
            path:'restaurant',
            select:'name province tel'
        });
        }
    }
    try{
        const reservations = await query;
        res.status(200).json({
            sucess: true,
            count:reservations.length,
            data:reservations
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            massage:'Cannot find Appointment'
        });
    }
};

exports.getReservation=async (req,res,next)=>{
    try{
        const reservation = await Reservation.findById(req.params.id).populate({
            path:'restaurant',
            select:'name province tel'
        });
        if(!reservation){
            return res.status(404).json({sucess:false,massage:`No reservation with the id of ${req.parms.id}`});
        }
        res.status(200).json({
            sucess: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            massage:'Cannot find Reservation'
        });
    }
};

exports.addReservation=async (req,res,next)=>{
    try{
        req.body.restaurant = req.params.restaurantId;
        req.body.id = req.user.id;
        const existedReservation = await Reservation.find({user:req.user.id});
        if(existedReservation.length>=3&&req.user.role!=='admin'){
            return res.status(400).json({
                sucess:false,
                massage:`The user with the id ${req.user.id} has already made 3 reservation`
            });
        }
        const restaurant = await Restaurant.findById(req.params.restaurantId);
        if(!restaurant){
            return res.status(404).json({sucess:false,massage:`No restaurant with the id of ${req.parms.restaurantId}`});
        }

        //convert time to int
        const { apptDate } = req.body;
        const { open, close } = restaurant.openingHours;
        const apptdate = apptDate.slice(11,16);
        const openTime = parseInt(open.slice(0,2))*60 + parseInt(open.slice(3,5));
        let closeTime = parseInt(close.slice(0,2))*60 + parseInt(close.slice(3,5));
        let apptTime = parseInt(apptdate.slice(0,2))*60 + parseInt(apptdate.slice(3,5));
        // console.log(closeTime)
        // console.log(openTime)
        // console.log(apptTime)
        if(closeTime < openTime) {
            closeTime += 1440;
            if(apptTime < closeTime && apptTime< openTime) {
                apptTime += 1440;
            }   
        }
        if(apptTime >= closeTime || apptTime < openTime) {
            return res.status(400).json({
                success: false,
                message: 'Reservation must be within restaurant opening hours'
            });
        }
        const reservation = await Reservation.create(req.body);
        res.status(200).json({
            sucess: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            massage:'Cannot Create Reservation'
        });
    }
};

exports.updateReservation=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({sucess:false,massage:`No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                sucess:false,
                massage:`User ${req.user.id} is not authorize to update this bootcamp`
            });
        }
        reservation = await Reservation.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        res.status(200).json({
            sucess: true,
            data:reservation
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            massage:'Cannot update Reservation'
        });
    }
};

exports.deleteReservation=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);
        if(!reservation){
            return res.status(404).json({sucess:false,massage:`No reservation with the id of ${req.params.id}`});
        }
        if(reservation.user.toString()!==req.user.id&&req.user.role!=='admin'){
            return res.status(401).json({
                sucess:false,
                massage:`User ${req.user.id} is not authorize to delete this bootcamp`
            });
        }
        await reservation.deleteOne();
        res.status(200).json({
            sucess: true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            massage:'Cannot delete Reservation'
        });
    }
};