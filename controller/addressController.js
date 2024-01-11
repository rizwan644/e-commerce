const e = require("express");
const Address = require("../model/addressModel");
const User = require("../model/userModel");


//add address
const addAddress = async (req,res) =>{
    try {
        const userId = req.session.user._id;
        const {firstName,lastName,phone,email,address1,address2,city,state,country,pincode,} = req.body
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
          }     
          if (
            !firstName ||
            !lastName ||
            !phone ||
            !email ||
            !address1 ||
            // !address2 ||
            !country ||
            !city ||
            !state ||
            !pincode
          ) {
            return res.status(400).json({ message: "All fields are required" });
          }
          if (!/^\d{10}$/.test(phone)) {
            return res
              .status(500)
              .json({ message: "Mobile number must be 10 digits" });
          }
        let deliveryAddress =  {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            country:country,
            pincode: pincode,
        }
        const isAddress = await Address.findOne({ user: userId})
        if (isAddress) {
            await Address.updateOne({ user: userId }, {
                $push:{deliveryAddress}
            })
        } else {
            const newAddressInstance = new Address({
                user: userId,
                deliveryAddress
            })
            await newAddressInstance.save()            
        }
        // user.deliveryAddress.push(newAddress);
        await user.save();
        res.status(200).json({ message: "Address added successfully" });

    } catch (error) {
        console.log(error);
    }
}


//Delete Address 
const deleteAddress = async (req, res) => {
    try {
        const userId = req.params.userId;  // Extract userId from the request parameters
        const addressId = req.params.addressId;

        await Address.updateOne({ user: userId }, {
            $pull: { deliveryAddress: { _id: addressId } }
        });

        console.log("Deleted address with ID:", addressId);
        res.send("Address deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error");
    }
};

//Edit Address function on user side
const editAddress = async (req, res) => {
    try {
        const addressId = req.params.addressId;
        const { firstName, lastName, phone, email, address1, address2, city, state, country, pincode } = req.body;
        
        const userId = req.session.user._id;

        const newAddress = {
            userId: userId, // Set the user ID
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            email: email,
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
        };

        await Address.updateOne(
            { user: newAddress.userId, "deliveryAddress._id": addressId },
            {
                $set: {
                    "deliveryAddress.$.firstName": newAddress.firstName,
                    "deliveryAddress.$.lastName": newAddress.lastName,
                    "deliveryAddress.$.phone": newAddress.phone,
                    "deliveryAddress.$.email": newAddress.email,
                    "deliveryAddress.$.address1": newAddress.address1,
                    "deliveryAddress.$.address2": newAddress.address2,
                    "deliveryAddress.$.city": newAddress.city,
                    "deliveryAddress.$.state": newAddress.state,
                    "deliveryAddress.$.country": newAddress.country,
                    "deliveryAddress.$.pincode": newAddress.pincode,
                },
            }
        );
        res.status(200).json({ message: "Address updated successfully" });

    } catch (error) {
        console.log(error);
    }
};





module.exports = {
    addAddress,
    deleteAddress,
    editAddress
}