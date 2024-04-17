const Request = require('../schema/Requests')
const User = require('../schema/User')
const Distributor = require('../schema/Distributor')

const jwt = require('jsonwebtoken')


// Create a new booking request
const createRequest = async (req, res) => {
    try {
        const { senderUser, receiverDistributor, bookingDetails } = req.body;
        // console.log(senderUser, receiverDistributor, bookingDetails)
        
        // Check if all required fields are provided
        if (!senderUser || !receiverDistributor || !bookingDetails) {
            return res.status(400).json({ success: false, message: 'Please provide all required fields' });
        }

        // Check if senderUser exists and is a user
        const isUser = await User.findById(senderUser);
        if (!isUser) {
            return res.status(400).json({ success: false, message: 'Sender must be a user' });
        }
        // console.log(isUser)

        // Check if receiverDistributor exists and is a distributor
        const isDistributor = await Distributor.findOne({ distributionLocation: receiverDistributor });
        if (!isDistributor) {
            return res.status(400).json({ success: false, message: 'Receiver must be a distributor' });
        }
        // console.log(isDistributor)

        // Extract distributorId from the found distributor
        const distributorId = isDistributor._id;
        // console.log(distributorId)

        // // Create a new request object
        const request = new Request({senderUser,receiverDistributor:distributorId,bookingDetails});
        
        // Save the request to the database
        await request.save();

        // Respond with a success message
        res.status(201).json({ success: true, message: 'Request created successfully' });
    } catch (error) {
        console.error('Error creating request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

// request status to show the user
const showUserRequestStatus = async (req, res) => {
    try {
       const userId = req.params.id;
    //    console.log(distributorId)
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Id not provided' });
        }

        const requests = await Request.find({ senderUser: userId }).populate('receiverDistributor').populate('senderUser')
        .exec(); //to execute
        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: 'No requests found' });
        }

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({ success: false, message: 'Failed to get requests' });
    }
}


//for showing the requested data to the distributor
const showRequest = async (req, res) => {
    try {
       const distributorId = req.params.id;
    //    console.log(distributorId)
        
        if (!distributorId) {
            return res.status(401).json({ success: false, message: 'Id not provided' });
        }

        const requests = await Request.find({ receiverDistributor: distributorId }).populate('receiverDistributor').populate('senderUser')
        .exec(); //to execute
        if (requests.length === 0) {
            return res.status(404).json({ success: false, message: 'No requests found' });
        }

        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        console.error('Error getting requests:', error);
        res.status(500).json({ success: false, message: 'Failed to get requests' });
    }
}



module.exports = {
     createRequest ,
        showRequest,
        showUserRequestStatus
    }