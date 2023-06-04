const router = require("express").Router();

const {getAllListings, getSingleListing, createListing, editListing, deleteListing} = require("../controllers/listingController");
const { verifyUser } = require("../middlewares/verifyToken");

router.post("/create-listing",verifyUser, createListing);

router.get("/all-listings", getAllListings);

router.get("/:id", getSingleListing);

router.put("/edit-listing/:id",verifyUser,editListing);

router.delete("/delete-listing/:id",verifyUser,deleteListing);


module.exports = router;