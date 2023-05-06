const { connectDB } = require("../../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {User, Food, Order} = require("../../../models/Schemas");
const mongoose = require("mongoose");
const moment = require('moment-jalaali')

connectDB();

const addOrder = {
  path: "/api/addOrUpdateOrders",
  method: "post",
  checkTokenValidation: true,
  handler: async (req, res) => {
    const { data } = req.body;
    if(!data) return;
    try{
      let bulk = Order.collection.initializeUnorderedBulkOp();
      data.map((d, idx)=>bulk.find({date: d.date}).upsert().updateOne({$set:{date: d.date, defaultFood: d.defaultFood, orders: d.orders.map(or=>{return {userId: mongoose.Types.ObjectId(or.userId), food: or.food!==null?mongoose.Types.ObjectId(or.food):null}}), foods: d.foods.map(f=>mongoose.Types.ObjectId(f)), type: d.type}}))
      const orders = await bulk.execute();

      res.status(200).json(orders);
    } catch {
      res.json({ error: "usernam_or_password_is_incorrect" });
    }
  },
};

const getOrders = {
  path: "/api/getOrders",
  method: "post",
  checkTokenValidation: true,
  handler: async (req, res) => {
    const { user, fromDate, toDate } = req.body;
    try{
      if(!user){
        const orders = await Order.aggregate([
          {
            '$match': {
              'date': {
                '$gte': fromDate, 
                '$lte': toDate
              }
            }
          }
        ])
        const days = [...Array(moment(toDate).diff(moment(fromDate),'days')+1)].map((date,index)=>moment(fromDate).add(index,'days').format('YYYY-MM-DD'))
        res.status(200).json(days.map(d=>{if(orders.filter(o=>o.date===d).length > 0){return orders.filter(o=>o.date===d)[0]}else{return {date: d, type: 1, foods:[], defaultFood: null, orders:[]}}}));
      }
      else{
        const orders = await Order.aggregate([
          {
            '$match': {
              'date': {
                '$gte': fromDate, 
                '$lte': toDate
              }
            }
          }, {
            '$lookup': {
              'from': 'foods', 
              'localField': 'foods', 
              'foreignField': '_id', 
              'as': 'foods'
            }
          }
        ])
        const days = [...Array(moment(toDate).diff(moment(fromDate),'days')+1)].map((date,index)=>moment(fromDate).add(index,'days').format('YYYY-MM-DD').toString())
        res.status(200).json(days.map(d=>{if(orders.filter(o=>o.date===d).length > 0){return orders.filter(o=>o.date===d)[0]}else{return {date: d, type: 1, foods:[], defaultFood: null, orders:[]}}}));
      }
    } catch(error) {
      console.log(error)
      res.json({ error: "usernam_or_password_is_incorrect" });
    }
  },
};

const setOrder = {
  path: "/api/setOrder",
  method: "post",
  checkTokenValidation: false,
  handler: async (req, res) => {
    const { user, newOrders } = req.body;
    try{

      let bulk = Order.collection.initializeUnorderedBulkOp();
      // console.log(newOrders)
      // newOrders.map((o, idx)=>bulk.find({date: o.date, 'orders.userId': o.orders[0].userId}).updateOne({$setOnInsert: {$push: {orders: {userId: o.orders[0].userId, food: o.orders[0].food}}}}))

      newOrders.map((o, idx)=>bulk.find({date: o.date}).updateOne([
        {
          $set: {
            orders: {
              $function: {
                lang: "js",
                args: ["$orders", {userId: mongoose.Types.ObjectId(o.orders[0].userId), food: o.orders[0].food===null?null:mongoose.Types.ObjectId(o.orders[0].food)}],
                body: `function(orders, newOrder) {
                  let v = [];
                  
                  if(Array.isArray(orders)) {
                    v = orders.filter(x => x.userId.toString() !== newOrder.userId.toString())
                  };
                  v.push(newOrder);
                  return v;
                }`
              }
            }
          }
        }
      ]))
      const orders = await bulk.execute();

      res.status(200).json(orders);
    } catch(error) {
      console.log(error)
      res.json({ error: error });
    }
  },
};

const getOrderStatForPrint = {
  path: "/api/getOrderStatForPrint",
  method: "post",
  checkTokenValidation: true,
  handler: async(req, res)=>{
    const { id } = req.body;
    const ordersList = await Order.findById(id).populate({path: 'defaultFood', select:{'_id': 1, 'title': 1}}).populate({path: 'orders.userId', select:{'_id': 1, 'name': 1, 'unit': 1, 'active': 1}, model: 'users', populate: [{path: 'unit', select:{'_id': 1, 'title': 1}}]}).populate({path: 'orders.food', select:{'_id': 1, 'title': 1}})
    const users = await User.find({active: true}).populate({path: 'unit', select:{'_id': 1, 'title': 1}});
    const orderss = [...ordersList._doc.orders.filter(u=>u.userId.active === true)];
    
    const uuu = users.filter( u=> orderss.map(o=>mongoose.Types.ObjectId(o.userId._id).toString()).indexOf( mongoose.Types.ObjectId(u._id).toString() ) < 0);

    uuu.map(u=>orderss.push({userId: {_id: u._id, name: u.name, active: u.active, unit: u.unit}, food: ordersList._doc.defaultFood?{_id: ordersList._doc.defaultFood._id, title: ordersList._doc.defaultFood.title}:null}))
    // console.log(orderss)


    let re= [];
    const orderStat = orderss.reduce(function (r, a) {
      if(re.findIndex(x=>mongoose.Types.ObjectId(x.unitId).toString()===mongoose.Types.ObjectId(a.userId.unit._id).toString())< 0){
        re = [...re, {unitId: a.userId.unit._id, unitTitle: a.userId.unit.title, orders: []}];
      }

      if(re[re.findIndex(x=>mongoose.Types.ObjectId(x.unitId).toString()===mongoose.Types.ObjectId(a.userId.unit._id).toString())].orders.filter(ff=>ff.foodId==='null'?'null':mongoose.Types.ObjectId(ff.foodId).toString() === (a.food===null?'null':mongoose.Types.ObjectId(a.food._id).toString())).length === 0)
        re[re.findIndex(x=>mongoose.Types.ObjectId(x.unitId).toString()===mongoose.Types.ObjectId(a.userId.unit._id).toString())].orders.push({foodId: a.food===null?'null':a.food._id,foodTitle: a.food===null?'لغو':a.food.title, users: []}) 

      re[re.findIndex(x=>mongoose.Types.ObjectId(x.unitId).toString()===mongoose.Types.ObjectId(a.userId.unit._id).toString())].orders[re[re.findIndex(x=>mongoose.Types.ObjectId(x.unitId).toString()===mongoose.Types.ObjectId(a.userId.unit._id).toString())].orders.findIndex(x=>x.foodId==='null'?'null':mongoose.Types.ObjectId(x.foodId).toString()===(a.food===null?'null':mongoose.Types.ObjectId(a.food._id).toString()))].users.push({name: a.userId.name, active: a.userId.active, unit: a.userId.unit.title});
      return re;
    }, Object.create(null));
    return res.json(orderStat)
  }
}

const getOrderStat= {
  path: "/api/getOrderStat",
  method: "post",
  checkTokenValidation: true,
  handler: async(req, res)=>{
    const { fromDate, toDate } = req.body;
    const orderStat = await Order.aggregate([
      {
        '$match': {
          'date': {
            '$gte': fromDate, 
            '$lte': toDate
          }, 
          'type': 1
        }
      }, {
        '$unwind': {
          'path': '$orders'
        }
      }, {
        '$lookup': {
          'from': 'users', 
          'localField': 'orders.userId', 
          'foreignField': '_id', 
          'as': 'orderUser'
        }
      }, {
        '$unwind': {
          'path': '$orderUser'
        }
      }, {
        '$match': {
          'orderUser.active': true
        }
      }, {
        '$project': {
          'date': 1, 
          'defaultFood': 1, 
          'foods': 1, 
          'orders': 1, 
          'orderUser': {
            '_id': 1, 
            'name': 1, 
            'unit': 1
          }
        }
      }, {
        '$group': {
          '_id': '$_id', 
          'orders': {
            '$push': '$orders'
          }, 
          'ordersUser': {
            '$push': '$orderUser'
          }, 
          'date': {
            '$first': '$date'
          }, 
          'defaultFood': {
            '$first': '$defaultFood'
          }
        }
      }, {
        '$project': {
          'date': 1, 
          'orders': '$orders.food', 
          'defaultFood': 1
        }
      }, {
        '$unwind': {
          'path': '$orders'
        }
      }, {
        '$group': {
          '_id': {
            'date': '$date', 
            'food': '$orders', 
            'defaultFood': '$defaultFood', 
            'foods': '$foods'
          }, 
          'count': {
            '$sum': 1
          }
        }
      }, {
        '$project': {
          'date': '$_id.date', 
          'food': '$_id.food', 
          'defaultFood': '$_id.defaultFood', 
          'count': 1
        }
      }
    ])

    const userCount = await User.count({active: true});

    const orderStatG = orderStat.reduce(function (r, a) {
      r[a.date] = r[a.date] || {defaultFood: a.defaultFood, stat: [{food: a.defaultFood, count: userCount}]};
      r[a.date].defaultFood = a.defaultFood;
      if(mongoose.Types.ObjectId(a.food).toString() !== mongoose.Types.ObjectId(a.defaultFood).toString()) r[a.date].stat.push({food: a.food, count: a.count});
      if(r[a.date].stat.filter(f=>mongoose.Types.ObjectId(f.food).toString()===mongoose.Types.ObjectId(a.defaultFood).toString()).length > 0)
        r[a.date].stat.filter(f=>mongoose.Types.ObjectId(f.food).toString()===mongoose.Types.ObjectId(a.defaultFood).toString())[0].count-= ((mongoose.Types.ObjectId(a.food).toString()===mongoose.Types.ObjectId(a.defaultFood).toString())?0:a.count);
      return r;
    }, Object.create(null));
    return res.json(orderStatG)
  }
}

module.exports = { addOrder, getOrders, setOrder, getOrderStat, getOrderStatForPrint };
