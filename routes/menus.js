const express = require('express');

const {getMenu,createMenu,updateMenu,deleteMenu} = require('../controllers/menus');

const router =express.Router({mergeParams:true});

const {protect,authorize} =require('../middleware/auth');

router.route('/').post(protect,authorize('admin','user'),createMenu);
router.route('/:id').get(protect,getMenu).put(protect,authorize('admin','user'),updateMenu).delete(protect,authorize('admin','user'),deleteMenu);

module.exports = router;