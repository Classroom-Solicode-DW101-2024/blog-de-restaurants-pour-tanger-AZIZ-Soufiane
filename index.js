const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());


function readRestaurantsFile() {
    return JSON.parse(fs.readFileSync('resturants.json', 'utf-8'));
}

function writeRestaurantsFile(restaurants) {
    fs.writeFileSync('resturants.json', JSON.stringify(restaurants, null, 4));
}


app.get('/resturants', (req, res) => {
    res.json(readRestaurantsFile());
});


app.post('/add-restaurant', (req, res) => {
    try {
        const newRestaurant = req.body;
        const restaurants = readRestaurantsFile();


        newRestaurant.id = Date.now();

        if (!newRestaurant.rating) {
            newRestaurant.rating = 4.0;
        }

        
        if (!newRestaurant.image) {
            newRestaurant.image = 'images/default-restaurant.jpg';
        }
        if (!newRestaurant.site) {
            newRestaurant.site = '#';
        }
        if (!newRestaurant.tel) {
            newRestaurant.tel = 'N/A';
        }

        restaurants.push(newRestaurant);
        writeRestaurantsFile(restaurants);

        res.status(201).json({
            message: 'Restaurant added successfully',
            restaurant: newRestaurant
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding restaurant', error: error.message });
    }
});


app.delete('/delete-restaurant/:name', (req, res) => {
    try {
        const restaurantName = decodeURIComponent(req.params.name);
        let restaurants = readRestaurantsFile();

        // Find the index of the restaurant
        const restaurantIndex = restaurants.findIndex(
            restaurant => restaurant.name === restaurantName
        );

        // If restaurant found, remove it
        if (restaurantIndex !== -1) {
            // Remove the restaurant from the array
            restaurants.splice(restaurantIndex, 1);
            
            // Write updated restaurants back to file
            writeRestaurantsFile(restaurants);

            res.status(200).json({
                message: 'Restaurant deleted successfully',
                restaurants: restaurants
            });
        } else {
            res.status(404).json({ message: 'Restaurant not found' });
        }
    } catch (error) {
        res.status(500).json({ 
            message: 'Error deleting restaurant', 
            error: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


