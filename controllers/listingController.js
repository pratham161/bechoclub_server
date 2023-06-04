const Listing = require("../models/Listing");
const User = require("../models/User");


exports.createListing = async (req, res) => {
  try {
    const { title, intialPrice, desc, images } = req.body;
    if (req.user.isAdharVerified) {
      const listing = await Listing.create({
        title: title,
        intialPrice: intialPrice,
        finalPrice: intialPrice,
        desc: desc,
        images: images,
        seller: req.user.id,
      });
      return res.status(200).json({ listing: listing });
    } else {
      return res.status(403).json({ message: "please complete adhar kyc" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


exports.getAllListings = async (req,res)=>{
    try {
        const listings = await Listing.find()
        res.status(200).json({listings:listings});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

exports.getSingleListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const keyWords = listing.title.split(" ");
    const seller = await User.findById(listing.seller).select(
      "fullName profile_img"
    );
    const simalars = await Listing.find({
      title: { $regex: keyWords[0] },
    }).select("images title initialPrice");
    if (listing !== null) {
      return res.status(200).json({
        listing: listing,
        seller: seller,
        simalars: simalars,
      });
    } else {
      return res.status(404).json({ message: "Not Found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.editListing = async (req, res) => {
  try {
    const { title, intialPrice, desc, images } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (listing.seller === req.user.id) {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        {
          title: title,
          intialPrice: intialPrice,
          desc: desc,
          images: images,
        },
        { new: true }
      );
      return res.status(200).json({ updatedListing: updatedListing });
    } else {
      return res.status(403).json({ message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing.seller === req.user.id) {
      await Listing.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Listing successfully deleted" });
    } else {
      return res.status(403).json({ message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};