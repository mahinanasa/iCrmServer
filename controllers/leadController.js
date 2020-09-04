const asyncHandlers = require('../middleware/async');
const Lead = require('../models/leads');

// @Method: POST
// @Route : api/auth/register 
// @Desc  : Handling the Lead registration
exports.createLead = asyncHandlers(async (req, res, next) => {

  try {
    const { name, email, phone, loggedInRole, loggedInEmail } = req.body;

    if (loggedInRole !== 'staff' && loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });
    }

    if (!email || !phone || !name) {
      return res.status(400).json({ success: false, message: "Please enter all the fields." });
    }

    let lead = await Lead.findOne({ email });

    if (lead) {
      return res.status(400).json({ success: false, message: 'Lead already exists' });
    }
    let createdBy = loggedInEmail
    lead = await Lead.create({
      name, email, phone, createdBy
    });

    res.status(200).json({ success: true, message: 'Lead added succesfully', data: lead._doc });

  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }

})


// @Method: Get
// @Route : api/getLeads 
// @Desc  : Get all the Lead details
exports.getLeads = asyncHandlers(async (req, res, next) => {
  try {
    const { loggedInEmail, loggedInRole } = req.query;;
    if (loggedInRole !== 'staff' && loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });
    }
    let allLeads = await Lead.find({ createdBy: loggedInEmail }).lean()
    res.status(200).json({ success: true, message: 'Got all lead details', data: allLeads });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }


})

// @Method: PUT
// @Route : api/updateLead 
// @Desc  : update the Lead detail
exports.updateLead = asyncHandlers(async (req, res, next) => {
  const { loggedInEmail, loggedInRole } = req.body;
  if (loggedInRole !== 'superAdmin') {
    return res.status(400).json({ success: false, message: 'No valid authorisation' });
  }
  let reqBody = req.body
  let updateLeadObj = {}
  if (reqBody.name) updateLeadObj.name = reqBody.name
  if (reqBody.email) updateLeadObj.email = reqBody.email
  if (reqBody.phone) updateLeadObj.phone = reqBody.phone
  updateLeadObj.updatedBy = loggedInEmail

  updateLeadObj = { $set: updateLeadObj }

  let updatedLead = await Lead.findOneAndUpdate({ _id: req.body._id }, updateLeadObj, { new: true }).lean()

  res.status(200).json({ success: true, message: 'Lead details updated sucessfully', data: updatedLead });
})

// @Method: DELETE
// @Route : api/deleteLead
// @Desc  : Delete lead by Id
exports.deleteLead = asyncHandlers(async (req, res, next) => {
  try {
    const { loggedInEmail, loggedInRole, id } = req.body;
    if (loggedInRole !== 'superAdmin') {
      return res.status(400).json({ success: false, message: 'No valid authorisation' });
    }
    let deletedLead = await Lead.deleteOne({ _id: req.body.id })
    res.status(200).json({ success: true, message: 'Lead details updated sucessfully', data: deletedLead });
  } catch (error) {
    console.log(error)
    res.status(400).json({ success: false, message: error.message, data: [] });
  }

}) 