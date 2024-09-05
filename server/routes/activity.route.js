const Activitycontroller = require("../controllers/activity.controller");
const verifyToken = require("../config/jwt.config");

module.exports=(app)=>{
   
    app.get("/activity/:activityId" ,verifyToken ,Activitycontroller.FindOneActivity)
    app.post("/activity", verifyToken, Activitycontroller.CreateNewActivity)

}