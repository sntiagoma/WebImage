var express = require("express");
var router = express.Router();
var Bill = require("../models/bills.js");

//Controladores

//GET /
findAllBills = function(req,res){
    Bill.find(function(err, bills){
        if(!err) res.send(bills);
        else console.log("ERROR:" + err);
    })
};

//GET /:id
findBillById = function (req, res) {
    Bill.findById(req.params.id,function(err, bill){
        if(!err) res.send(bill);
        else console.log("ERROR:" + err);
    })
};

//POST /:id
addBill = function (req,res) {
    console.log("Doing... POST");
    console.log(req.body);
    var bill = new Bill({
        date: new Date(),
        seller: req.body.seller,
        medium: req.body.medium
    });
    bill.save(function(err){
        if(!err) console.log("Factura guardada");
        else console.log("ERROR: "+err);
    });
    res.send(bill);
};

//PUT /:id
updateBill = function (req, res) {
    Bill.findById(req.params.id, function (err, bill) {
        bill.seller = req.body.seller;
        bill.save(function (err) {
            if(!err) {console.log("Bill Actualizada");res.send(bill)}
            else {console.log("ERROR: "+err);res.send({error: 'error', 'message': "WTF"})}
        });
    });
};

//DELETE /:id
deleteBill = function (req,res) {
  Bill.findById(req.params.id, function(err,bill){
      if(bill==null) res.send(250);
      bill.remove(function (err) {
          if(!err) console.log("Bill Borrada");
          else console.log("ERROR: "+err);
      });
      if(!err)res.send(200);
      else res.send(240);
  });
};
router.get('/bills',findAllBills);
router.get('/bills/:id',findBillById);
router.post('/bills',addBill);
router.put('/bills/:id',updateBill);
router.delete('/bills/:id',deleteBill);

module.exports = router;