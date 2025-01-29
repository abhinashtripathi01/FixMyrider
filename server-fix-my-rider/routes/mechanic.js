const router = require("express").Router();
const { Mechanic } = require("../models/MechanicSchema");
const verifyJWT = require("../middleware/verifyJWT");
const { titleToSlug } = require("../utils/commonFunctions");
const User = require("../models/UserSchema");
const Order = require("../models/OrderSchema"); // Import Order model

router.use(verifyJWT);

//to get all the mechanic
router.route("/").get((req, res) => {
  Mechanic.find()
    // .populate("service")
    .then((mechanics) => res.json(mechanics))
    .catch((err) => res.status(400).json("Error: " + err));
});

// to get mechanic by slug
router.route("/:slug").get(async (req, res) => {
  try {
    // Find the mechanic by slug
    const mechanic = await Mechanic.findOne({ slug: req.params.slug })
      .populate({
        path: "service",
        match: { isDeleted: false },
      })
      .exec();

    if (!mechanic) {
      return res.status(404).json("Mechanic not found");
    }

    // Find the user based on userId in the mechanic document
    const user = await User.findById(mechanic.userId).select("phone email");

    // Combine mechanic data with user phone number
    const response = {
      ...mechanic.toObject(), // Convert Mongoose document to plain object
      phone: user ? user.phone : null, // Include phone if user is found
      email: user ? user.email : null, // Include phone if user is found
    };

    // Send the combined data as a response
    res.json(response);
  } catch (err) {
    res.status(400).json("Error: " + err);
  }
});

// Get mechanic by auth token
router.get("/fetch/user", verifyJWT, async (req, res) => {
  try {
    const mechanic = await Mechanic.findById(req.user.mechanicId).populate({
      path: "service",
      match: { isDeleted: false }, // Add this match condition to filter out deleted menu items
    });
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }
    res.status(200).json(mechanic);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

//to update mechanic data
router.route("/update/:id").post((req, res) => {
  Mechanic.findById(req.params.id)
    .then((mechanic) => {
      (mechanic.name = req.body.name),
        (mechanic.slug = titleToSlug(req.body.name)),
        (mechanic.image = req.body.image),
        (mechanic.description = req.body.description),
        (mechanic.address = req.body.address),
        (mechanic.phone = req.body.phone);

      mechanic
        .save()
        .then((mechanic) =>
          res.json({ success: true, message: "Updated Successfully" })
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//to delete mechanic data
router.route("/:id").delete((req, res) => {
  Mechanic.findByIdAndDelete(req.params.id)
    .then(res.json("Successfully Deleted"))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Route to fetch nearby Mechanic based on user's location
router.route("/fetch/nearby").get(async (req, res) => {
  const { latitude, longitude } = req.query; // User's location coordinates
  const maxDistance = 10000; // Maximum distance in meters for nearby mechanics

  // Find mechanic with coordinates within the maximum distance using $geoNear aggregation
  Mechanic.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(latitude), parseFloat(longitude)],
        },
        distanceField: "distance",
        maxDistance: maxDistance,
        spherical: true,
      },
    },
    { $sort: { distance: 1 } }, // Sort by distance in ascending order
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        image: 1,
        description: 1,
        type: 1,
        rating: 1,
        coordinates: 1,
        // numReviews: 1,
        // menu: 1,
        userId: 1,
        address: 1,
        distance: { $divide: ["$distance", 1000] }, // Convert distance to kilometers
        isBlocked: 1,
      },
    },
  ]).exec((err, mechanics) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    res.json(mechanics);
  });
});

//to block user
router.route("/block/:id").post((req, res) => {
  Mechanic.findById(req.params.id)
    .then((mechanic) => {
      mechanic.isBlocked = true;
      mechanic
        .save()
        .then((mechanic) =>
          res.json({ message: `${mechanic.name} Blocked Successfully` })
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

//to unblock user
router.route("/unblock/:id").post((req, res) => {
  Mechanic.findById(req.params.id)
    .then((mechanic) => {
      mechanic.isBlocked = false;
      mechanic
        .save()
        .then((mechanic) =>
          res.json({ message: `${mechanic.name} Unblocked Successfully` })
        )
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/stats/:mechanicId").get(async (req, res) => {
  try {
    const { mechanicId } = req.params;

    // Fetch the mechanic's information
    const mechanic = await Mechanic.findById(mechanicId);
    if (!mechanic) {
      return res.status(404).json({ message: "Mechanic not found" });
    }

    // Count total orders for the mechanic
    const totalOrders = await Order.countDocuments({ mechanicId });

    // Count pending orders for the mechanic
    const pendingOrders = await Order.countDocuments({
      mechanicId,
      status: { $in: ["Requested"] },
    });

    // Send combined mechanic data and stats
    res.json({
      totalOrders,
      pendingOrders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
