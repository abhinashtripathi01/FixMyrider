const router = require("express").Router();
const { Mechanic } = require("../models/MechanicSchema");
const User = require("../models/UserSchema");
const verifyJWT = require("../middleware/verifyJWT");
const MechanicRequestSchema = require("../models/MechanicRequestSchema");
const { titleToSlug } = require("../utils/commonFunctions");

router.use(verifyJWT);

//to get all the mechanic requests with status pending
router.route("/").get(async (req, res) => {
  try {
    const mechanicRequest = await MechanicRequestSchema.find({
      status: "pending",
    });
    res.status(200).json(mechanicRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// to get mechanic request by ID
router.route("/:id").get((req, res) => {
  MechanicRequestSchema.findById(req.params.id)
    .then((mechanic) => res.json(mechanic))
    .catch((err) => res.status(400).json("Error: " + err));
});

//to add new mechanic request
router.route("/add").post(async (req, res) => {
  const mechanicRequest = await MechanicRequestSchema.findOne({
    $or: [{ email: req.body.email }, { userId: req.body.userId }],
  });
  if (mechanicRequest) {
    return res.status(400).json({ message: "You have already Requested!" });
  } else {
    if (
      !req.body.name ||
      !req.body.image ||
      !req.body.description ||
      !req.body.coordinates ||
      !req.body.address ||
      !req.body.userId ||
      !req.body.document1 ||
      !req.body.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the required fields.",
      });
    }

    const newMechanicRequest = new MechanicRequestSchema({
      email: req.user.email,
      name: req.body.name,
      image: req.body.image,
      phone: req.body.phone,
      description: req.body.description,
      coordinates: req.body.coordinates,
      address: req.body.address,
      userId: req.body.userId,
      document1: req.body.document1,
      document2: req.body.document2,
    });
    newMechanicRequest
      .save()
      .then(() =>
        res.json({
          success: true,
          message: "Registration request successful.",
        })
      )
      .catch((err) =>
        res.status(400).json({ success: false, message: err.message })
      );
  }
});

//to delete/reject mechanic request
router.route("/:id").delete((req, res) => {
  MechanicRequestSchema.findByIdAndDelete(req.params.id)
    .then(res.json({ message: "Successfully Rejected" }))
    .catch((err) => res.status(400).json("Error: " + err));
});

// to accept mechanic request and add new mechanic in database
router.post("/:id/accept", async (req, res) => {
  try {
    const mechanicRequest = await MechanicRequestSchema.findById(req.params.id);
    if (!mechanicRequest) {
      return res.status(404).json({ message: "Mechanic request not found" });
    }

    const newMechanic = new Mechanic({
      name: mechanicRequest.name,
      slug: titleToSlug(mechanicRequest.name),
      image: mechanicRequest.image,
      description: mechanicRequest.description,
      type: mechanicRequest.type,
      rating: 0,
      coordinates: mechanicRequest.coordinates,
      address: mechanicRequest.address,
      numReviews: 0,
      menu: [],
      userId: mechanicRequest.userId,
      phone: mechanicRequest.phone,
    });

    await newMechanic.save();

    mechanicRequest.status = "accepted";
    await mechanicRequest.save();

    // Find the user associated with the mechanic request
    const user = await User.findById(mechanicRequest.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "seller";
    user.mechanicId = newMechanic._id;
    await user.save();

    res.status(200).json({ message: "Mechanic Accepted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
