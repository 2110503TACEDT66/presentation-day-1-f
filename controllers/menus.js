const Reservation = require('../models/Reservation');
const Restaurant  = require('../models/Restaurant');
const Menu  = require('../models/Menu');

exports.getMenu = async (req,res,next)=>{
    try{
        let menu = await Restaurant.findById(req.params.id).name;
        menu = menu.populate({
            path:'menu',
            select:'name price'
        });
        if(!menu){
            return res.status(400).json({sucess:false});
        }
        res.status(200).json({
            sucess:true,
            date:menu});
    }catch(err){
        res.status(400).json({sucess:false});
    }
};

exports.createMenu = async (req,res,next)=>{
    const menu = await Menu.create(req.body);
    res.status(201).json({
        sucess:true,
        data:menu});
};

exports.updateMenu= async (req,res,next)=>{
    try{
        const menu = await Menu.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidator:true
        });
        if(!menu){
            return res.status(400).json({sucess:false,massage:`No item with the id of ${req.params.id}`});
        }
        res.status(200).json({sucess:true,data:menu});
    }catch(err){
        res.status(400).json({sucess:false});
    }
};

exports.deleteMenu=async (req,res,next)=>{
    try{
        let menu = await Menu.findById(req.params.id);
        if(!menu){
            return res.status(404).json({sucess:false,massage:`No item with the id of ${req.params.id}`});
        }
        await menu.deleteOne();
        res.status(200).json({
            sucess: true,
            data:{}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            massage:'Cannot delete this item'
        });
    }
};

