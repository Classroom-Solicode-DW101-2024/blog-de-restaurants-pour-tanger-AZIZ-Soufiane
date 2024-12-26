// Function to get URL parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1]);
}

// Fetch and display restaurant details
document.addEventListener('DOMContentLoaded', function() {
    // Get the restaurant name from URL
    const restaurantName = getUrlParameter('name');

    // Fetch restaurant details
    fetch('http://localhost:3000/resturants')
        .then(response => response.json())
        .then(restaurants => {
            // Find the specific restaurant
            const restaurant = restaurants.find(rst => rst.name === restaurantName);
            
            if (restaurant) {
                displayRestaurantDetails(restaurant);
            } else {
                console.error('Restaurant not found');
            }
        })
        .catch(error => {
            console.error('Error fetching restaurant details:', error);
        });
});

// Function to display restaurant details
function displayRestaurantDetails(restaurant) {
    const restauInfoContainer = document.getElementById('restauInfoCotainer');
    
    restauInfoContainer.innerHTML = `
        <div id="restauInfo-img">
            <img src="${restaurant.image}" alt="${restaurant.name}">
        </div>
        <div id="restauInfo-text">
            <h3>${restaurant.name}</h3>
            <p>Specialty: ${restaurant.specialty}</p>
            <p>Rating: ${restaurant.rating} ⭐</p>
            <p>Address: ${restaurant.address}</p>
            <p>Telephone: ${restaurant.tel}</p>
            <p>Website: <a href="${restaurant.site}" target="_blank">${restaurant.site}</a></p>
            <h5>Description</h5>
            <p id="DESCRIPTION">${restaurant.description}</p>
        </div>
    `;
}