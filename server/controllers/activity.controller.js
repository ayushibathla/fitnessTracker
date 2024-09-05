const { fitnessSchema } = require("../models/activity.model");
const { calculateWalkingCalories, calculateRunningCalories, calculateCyclingCalories, calculateSwimmingCalories } = require("../models/activity.model");
const verifyToken = require("../config/jwt.config");
const User = require("../models/user.model");

module.exports.CreateNewActivity = async (req, res) => {
    verifyToken(req, res, async () => {
        try {
            const user = req.user;
            const newActivity = new fitnessSchema({
                Duration: req.body.Duration,
                Distance: req.body.Distance,
                Intensity: req.body.Intensity,
                Weight: req.body.Weight,
                Height: req.body.Height,
                Age: req.body.Age,
                Gender: req.body.Gender,
                ActivityChecked: req.body.ActivityChecked,
                Owner: user.id
            });

            const savedActivity = await newActivity.save();
            await User.findByIdAndUpdate(user.id, { $push: { activities: savedActivity._id } });
            await User.findByIdAndUpdate(user.id, { $inc: { caloriesSum: savedActivity.CaloriesBurned } });

            console.log(savedActivity);
            res.json({ newActivity: savedActivity });
        } catch(err) {
            res.status(400).json(err);
        }
    });
};

module.exports.FindOneActivity = (req, res) => {
    fitnessSchema.findOne({ _id: req.params.activityId })
        .then(oneSingleActivity => {
            res.json(oneSingleActivity)
        })
        .catch((err) => {
            res.json(err)
        })
}
