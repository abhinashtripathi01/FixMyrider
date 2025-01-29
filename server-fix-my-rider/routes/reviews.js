const router = require("express").Router();
const Review = require("../models/ReviewSchema");
const { Mechanic } = require("../models/MechanicSchema");
const verifyJWT = require("../middleware/verifyJWT");

router.use(verifyJWT);
// Get all reviews
router.route("/reviews").get((req, res) => {
  Review.find()
    .then((reviews) => res.json(reviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get a review by ID
router.route("/reviews/:id").get((req, res) => {
  Review.findById(req.params.id)
    .populate({
      path: "userId", // Populate userId
      select: "address email phone image username", // Select the fields you want to include
    })
    .then((review) => {
      if (!review) {
        return res.status(404).json("Review not found");
      }
      res.json(review);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Create a new review
router.route("/add").post((req, res) => {
  const newReview = new Review({
    userId: req.user.userId,
    name: req.user.name,
    mechanicId: req.body.mechanicId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  // Find the mechanic associated with the review
  Mechanic.findOne({ _id: req.body.mechanicId })
    .then((mech) => {
      if (!mech) {
        return res.status(404).json({ message: "mechanic not found" });
      }

      // Calculate the new average rating and update the mechanic document
      let newNumReviews = mech.numReviews + 1;
      let newTotalRating = mech.rating * mech.numReviews + req.body.rating;
      let newAvgRating = newTotalRating / newNumReviews;

      Mechanic.updateOne(
        { _id: mech._id },
        { $set: { rating: newAvgRating, numReviews: newNumReviews } }
      )
        .then(() => {
          newReview
            .save()
            .then((review) => res.json({ message: "Review added" }))
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Update a review
router.route("/:id").put((req, res) => {
  Review.findById(req.params.id)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      // Find the mechanic associated with the review
      Mechanic.findOne({ _id: review.mechanicId })
        .then((mech) => {
          if (!mech) {
            return res.status(404).json({ message: "mechanic not found" });
          }

          // Calculate the new average rating and update the mechanic document
          let newTotalRating =
            mech.rating * mech.numReviews - review.rating + req.body.rating;
          let newAvgRating = newTotalRating / mech.numReviews;

          Mechanic.updateOne(
            { _id: mech._id },
            { $set: { rating: newAvgRating } }
          )
            .then(() => {
              review.userId = req.user.userId;
              review.rating = req.body.rating;
              review.comment = req.body.comment;

              review
                .save()
                .then(() => res.json({ message: "Review updated" }))
                .catch((err) => res.status(400).json("Error: " + err));
            })
            .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

// Delete a review
router.route("/:id").delete(async (req, res) => {
  try {
    const { id } = req.params;

    // Get the existing review
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Update the corresponding mechanic's rating and number of reviews
    const mech = await Mechanic.findById(review.mechanicId);
    if (!mech) {
      return res.status(404).json({ message: "mechanic not found" });
    }
    if (mech.numReviews > 1) {
      mech.rating =
        (mech.rating * mech.numReviews - review.rating) / (mech.numReviews - 1);
    } else {
      mech.rating = 0;
    }
    mech.numReviews -= 1;
    await mech.save();

    // Delete the review
    await review.delete();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all reviews for a mechanic
router.route("/mechanic/:id").get((req, res) => {
  Review.find({ mechanicId: req.params.id })
    .populate({
      path: "userId", // Populate userId
      select: "address email phone image username", // Select the fields you want to include
    })
    .then((reviews) => res.json(reviews))
    .catch((err) => res.status(400).json("Error: " + err));
});

// Get a user's review for a mechanic
router.route("/mechanic/:mechanicId/user/:userId").get((req, res) => {
  Review.findOne({
    mechanicId: req.params.mechanicId,
    userId: req.params.userId,
  })
    .then((review) => {
      if (review) {
        res.json(review);
      } else {
        res.json(null);
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
