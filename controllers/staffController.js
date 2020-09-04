const asyncHandlers = require('../middleware/async');
const User = require('../models/user');


// @Method: POST
// @Route : api/createStaff 
// @Desc  : Handling the staff registration
exports.createStaff = asyncHandlers(async (req, res, next) => {

  try {

    const { name, email, password, loggedInRole, createdBy } = req.body;

    if (loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });

    }
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Please enter all the fields." });
    }

    let staff = await User.findOne({ email });

    if (staff) {
      return res.status(400).json({ success: false, message: 'Staff already exists' });
    }

    let role = 'staff'
    staff = await User.create({
      name, email, password, role, createdBy
    });

    res.status(200).json({ success: true, message: 'Staff added succesfully', data: staff._doc });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }

})

// @Method: GET
// @Route : api/getStaffs 
// @Desc  : Get all the staff details
exports.getStaffs = asyncHandlers(async (req, res, next) => {

  try {
    const { loggedInEmail, loggedInRole } = req.query;
    if (loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });
    }
    let allStaff = await User.find({ createdBy: loggedInEmail, role: "staff" }).lean();
    res.status(200).json({ success: true, message: 'Got all staff details', data: allStaff });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }


})

// @Method: PUT
// @Route : api/updateStaffs 
// @Desc  : Get all the staff details
exports.updateStaffs = asyncHandlers(async (req, res, next) => {

  try {

    const { loggedInEmail, loggedInRole } = req.body;
    if (loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });
    }
    let reqBody = req.body
    let updateUserObj = {}
    if (reqBody.name) updateUserObj.name = reqBody.name
    if (reqBody.email) updateUserObj.email = reqBody.email
    if (reqBody.password) updateUserObj.password = reqBody.password
    if (reqBody.role) updateUserObj.role = reqBody.role
    updateUserObj.updatedBy = loggedInEmail

    updateUserObj = { $set: updateUserObj }

    let updatedStaff = await User.findOneAndUpdate({ _id: req.body._id }, updateUserObj, { new: true }).lean()

    res.status(200).json({ success: true, message: 'Staff details up  dated sucessfully', data: updatedStaff });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }

})

// @Method: DELETE
// @Route : api/deleteStaff 
// @Desc  : Delete staff by Id
exports.deleteStaff = asyncHandlers(async (req, res, next) => {
  try {
    const { loggedInEmail, loggedInRole, id } = req.body;
    if (loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });
    }
    let deletedStaff = await User.deleteOne({ _id: req.body.id }).lean()
    res.status(200).json({ success: true, message: 'Staff details deleted sucessfully', data: deletedStaff });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }

}) 
