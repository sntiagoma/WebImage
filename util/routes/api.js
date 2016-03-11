var express = require("express");
var router = express.Router();
var Bill = require("../../models/bills.js");

module.exports = function() {
    findAllBills = function(req, res) {
        Bill.find(function(err, bills) {
            if (!err) res.send(bills);
        })
    };
    findBillById = function(req, res) {
        Bill.findById(req.params.id, function(err, bill) {
            if (!err) res.send(bill);
        })
    };
    addBill = function(req, res) {
        var bill = new Bill({
            date: new Date(),
            seller: req.body.seller,
            medium: req.body.medium
        });
        bill.save(function(err) {
        });
        res.send(bill);
    };
    updateBill = function(req, res) {
        Bill.findById(req.params.id, function(err, bill) {
            bill.seller = req.body.seller;
            bill.save(function(err) {
                if (!err) {
                    res.send(bill);
                }else{
                    res.send({ error: 'error', 'message': "WTF" });
                }
            });
        });
    };
    deleteBill = function(req, res) {
        Bill.findById(req.params.id, function(err, bill) {
            if (bill == null) res.send(250);
            bill.remove(function(err) {
            });
            if (!err) res.send(200);
            else res.send(240);
        });
    };
    router.get('/bills', findAllBills);
    router.get('/bills/:id', findBillById);
    router.post('/bills', addBill);
    router.put('/bills/:id', updateBill);
    router.delete('/bills/:id', deleteBill);
    return router;
};
