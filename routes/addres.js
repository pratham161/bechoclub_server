const router = require("express").Router();
const Address = require("../models/Address");
const { verifyUser} = require("../middlewares/verifyToken");

// TODO: write a route for getting all the addresses route should be admin restricted

router.post("/create-Address", verifyUser, async (req, res) => {
 try {
  let addresses = await Address.find({user:req.user.id});
  if(addresses.length === 2){
    return res.status(403).json({message:"each user can have only 2 addresses"});
  }
  if(req.user.isAdharVerified){
    await Address.create({
      user: req.user.id,
      details: req.body.details
    });
  }

 } catch (error) {
  console.log(error);
  res.status(500).json({ message: "Internal server error" });
 }
});


module.exports = router