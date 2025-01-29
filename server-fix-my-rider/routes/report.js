const express = require("express");
const Report = require("../models/ReportSchema"); // Adjust the path if needed
const verifyJWT = require("../middleware/verifyJWT");
const UserSchema = require("../models/UserSchema");
const router = express.Router();

// Create a report
router.post("/", verifyJWT, async (req, res) => {
  const { mechanicId, userId, reportType, reportDescription } = req.body;
  const reportedBy = req?.user?.userId;
  // Validate required fields
  if (!reportedBy || !reportType || !reportDescription) {
    return res
      .status(400)
      .json({ message: "Required fields are missing.", success: false });
  }

  try {
    const newReport = new Report({
      reportedBy,
      mechanicId,
      userId,
      reportType,
      reportDescription,
    });

    const savedReport = await newReport.save();
    res.status(201).json({
      message: "Reported successfully.",
      savedReport,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create the report.", error, success: false });
  }
});

router.get("/", verifyJWT, async (req, res) => {
  try {
    // Fetch reports and populate user, reportedBy, and mechanic details
    const reportedUsers = await Report.find({})
      .populate("userId", "username email phone address") // Populate user details
      .populate("reportedBy", "username email") // Populate reporter details
      .populate("mechanicId", "name phone image slug isBlocked") // Populate mechanic details
      .exec();

    // Fetch related users linked to each mechanic
    const mechanicUserMap = await Promise.all(
      reportedUsers.map(async (report) => {
        if (report.mechanicId) {
          const relatedUsers = await UserSchema.find({
            mechanicId: report.mechanicId._id,
          }).select("username email phone address");
          return { mechanicId: report.mechanicId._id, relatedUsers };
        }
        return { mechanicId: null, relatedUsers: [] };
      })
    );

    // Attach related users to each report
    const enrichedReports = reportedUsers.map((report) => {
      const mechanicData = mechanicUserMap.find(
        (data) => String(data.mechanicId) === String(report.mechanicId?._id)
      );
      return {
        ...report._doc, // Spread the report data
        relatedUsers: mechanicData ? mechanicData.relatedUsers : [],
      };
    });

    if (enrichedReports.length === 0) {
      return res.status(404).json({
        message: "No reported users found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Reported users retrieved successfully.",
      reportedUsers: enrichedReports,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch reported users.",
      error,
      success: false,
    });
  }
});

module.exports = router;
