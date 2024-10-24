
const express = require('express')
const app = express()
const cors = require("cors");
const { initializeDatabase} = require("./db/db.connect")
const Hotel = require("./models/hotel.models");
initializeDatabase();

app.use(cors())
app.use(express.json())

// const newHotel1 = {
//     name: "Lake View",
//     category: "Mid-Range",
//     location: "124 Main Street, Anytown",
//     rating: 3.2,
//     reviews: [],
//     website: "https://lake-view-example.com",
//     phoneNumber: "+1234555890",
//     checkInTime: "2:00 PM",
//     checkOutTime: "12:00 PM",
//     amenities: ["Laundry", "Boating"],
//     priceRange: "$$$ (31-60)",
//     reservationsNeeded: true,
//     isParkingAvailable: false,
//     isWifiAvailable: true,
//     isPoolAvailable: false,
//     isSpaAvailable: false,
//     isRestaurantAvailable: false,
//     photos: ["https://example.com/hotel1-photo1.jpg", "https://example.com/hotel1-photo2.jpg"],
//   };

//   const newHotel2 = {
//     name: "Sunset Resort",
//     category: "Resort",
//     location: "12 Main Road, Anytown",
//     rating: 4.0,
//     reviews: [],
//     website: "https://sunset-example.com",
//     phoneNumber: "+1299655890",
//     checkInTime: "2:00 PM",
//     checkOutTime: "11:00 AM",
//     amenities: ["Room Service", "Horse riding", "Boating", "Kids Play Area", "Bar"],
//     priceRange: "$$$$ (61+)",
//     reservationsNeeded: true,
//     isParkingAvailable: true,
//     isWifiAvailable: true,
//     isPoolAvailable: true,
//     isSpaAvailable: true,
//     isRestaurantAvailable: true,
//     photos: ["https://example.com/hotel2-photo1.jpg", "https://example.com/hotel2-photo2.jpg"],
//   };

async function createHotel(newHotel){
    try{
        const hotel = new Hotel(newHotel)
        const saveHotel = await hotel.save()
        return saveHotel
    } catch(error) {
        throw error
    }
}

app.post('/hotels', async(req, res)=> {
    try{
        const savedHotel = await createHotel(req.body)
        res.status(201).json({message: "New hotel added successfully", hotel: savedHotel})
    }catch(error){
        res.status(500).json({error: "Failed to add hotel"})
    }
})

//1. read all hotels from the Database
async function readAllHotel(){
    try{
        const allHotel = await Hotel.find()
        return allHotel
    } catch(error){
        throw error
    }
}

app.get('/hotels', async(req, res) => {
    try{
        const hotels = await readAllHotel()
        if(hotels.length != 0){
            res.json(hotels)
        }else{
            res.status(404).json({error: "Hotel not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch hotels"})
    }
})

//2. read a hotel by its name
async function readByName(hotelName){
    try{
        const hotelByName = await Hotel.find({name: hotelName})
        return hotelByName
    } catch(error){
        throw error
    }
}

app.get('/hotels/:hotelName', async(req, res) => {
    try{
        const hotels = await readByName(req.params.hotelName)
        if(hotels.length != 0){
            res.json(hotels)
        }else{
            res.status(404).json({error: "Hotel not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch hotels"})
    }
})

//3. read a hotel by phone number

async function readHotelsByPhoneNumber(phone){
    try{
        const hotelsByPhoneNumber = await Hotel.find({phoneNumber: phone})
        return hotelsByPhoneNumber
    } catch(error){
        throw error
    }
}

app.get('/hotels/directory/:phone', async(req, res) => {
    try{
        const hotels = await readHotelsByPhoneNumber(req.params.phone)
        if(hotels.length != 0){
            res.json(hotels)
        }else{
            res.status(404).json({error: "Hotel not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch hotels"})
    }
})

//4. read hotel by rating
async function readHotelsByRating(hotelRating){
    try{
        const hotelsByRating = await Hotel.find({rating: hotelRating})
        return hotelsByRating
    } catch(error){
        throw error
    }
}

app.get('/hotels/rating/:hotelRating', async(req, res) => {
    try{
        const hotels = await readHotelsByRating(req.params.hotelRating)
        if(hotels.length != 0){
            res.json(hotels)
        }else{
            res.status(404).json({error: "Hotel not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch hotels"})
    }
})

//5. read hotel by category
async function readHotelsByCategory(hotelCategory){
    try{
        const hotelsByCategory = await Hotel.find({category: hotelCategory})
        return hotelsByCategory
    } catch(error){
        throw error
    }
}

app.get('/hotels/category/:hotelCategory', async(req, res) => {
    try{
        const hotels = await readHotelsByCategory(req.params.hotelCategory)
        if(hotels.length != 0){
            res.json(hotels)
        }else{
            res.status(404).json({error: "Hotel not found."})
        }
    }catch(error){
        res.status(500).json({error: "Failed to fetch hotels"})
    }
})

async function deleteHotel(hotelId) {
    try{
        const deletedHotel = await Hotel.findByIdAndDelete(hotelId)
        return deletedHotel
    }catch(error){
        console.log(error)
    }
}

app.delete('/hotels/:hotelId', async(req, res)=> {
    try{
        const hotelDeleted = await deleteHotel(req.params.hotelId)
        if(hotelDeleted){
            res.status(200).json({message: "Hotel deleted successfully"})
        }
    }catch{
        res.status(500).json({error: "Failed to delete hotel"})
    }
})

async function updateHotel(hotelId, dataToUpdate) {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, dataToUpdate, {new: true})
        return updatedHotel
    }catch(error){
        console.log("Error in updating Hotel detail", error)
    }
}

app.post('/hotels/:hotelId', async(req, res)=> {
    try{
        const updatedHotel = await updateHotel(req.params.hotelId, req.body)
        // console.log(req.body)
        // console.log(req.params.hotelId)
        if(updatedHotel){
            res.status(200).json({message: "Hotel updated successfully", updatedHotel: updatedHotel})
        }else{
            res.status(404).json({error: "Hotel not found"})
        }
    }catch(error){
        res.status(500).json({error: "Failed to update hotel"})
    }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log(` Server is running on ${PORT}`)
})



