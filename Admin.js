let ResturantsArray = [];

fetch('http://localhost:3000/resturants').then(resturants => {
    let resturantsInfo = resturants.json();
    console.log(resturantsInfo);
    return resturantsInfo;
}).then((resturantsInfo) => {
    ResturantsArray = resturantsInfo;
    DisplayResturants(ResturantsArray);
});


function deleteRestaurant(restaurantName) {
    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ${restaurantName}?`)) {
        return;
    }

    // Send DELETE request to backend
    fetch(`http://localhost:3000/delete-restaurant/${encodeURIComponent(restaurantName)}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            // If response is not OK, throw an error
            return response.json().then(err => { throw new Error(err.message); });
        }
        return response.json();
    })
    .then(data => {
        // Refresh the restaurants list
        fetch('http://localhost:3000/resturants')
            .then(response => response.json())
            .then(restaurants => {
                ResturantsArray = restaurants;
                DisplayResturants(ResturantsArray);
                alert('Restaurant deleted successfully!');
            });
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`Failed to delete restaurant: ${error.message}`);
    });
}

function DisplayResturants(resturants) {
    let ResturantsContainer = document.getElementById("resturants-Grid");
    ResturantsContainer.innerHTML = ""; 

    resturants.forEach(resturant => {
        const row = document.createElement("tr");
        
        row.innerHTML = `
            <td><img src="${resturant.image}" alt="${resturant.name}" class="restaurant-image"></td>
            <td>${resturant.name}</td>
            <td>${resturant.specialty}</td>
            <td>${resturant.rating} ⭐</td>
            <td><button class="delete-btn" data-name="${resturant.name}">Delete</button></td>
        `;
        
        const deleteBtn = row.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            deleteRestaurant(resturant.name);
        });

        ResturantsContainer.appendChild(row);
    });
}

// Add event listener to dynamically added delete buttons
document.addEventListener('DOMContentLoaded', function() {
    const ResturantsContainer = document.getElementById("resturants-Grid");
    
    ResturantsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('delete-btn')) {
            const restaurantName = event.target.getAttribute('data-name');
            deleteRestaurant(restaurantName);
        }
    });
});


function searchRestaurants() {
    const searchCriteria = document.getElementById("searchCriteria").value;
    const searchInput = document.getElementById("searchInput").value.toLowerCase();  

    
    if (!searchInput) {
        DisplayResturants(ResturantsArray);
        return;
    }

    let filteredRestaurants = ResturantsArray.filter(restaurant => {
        if (searchCriteria === "all") {
            return (
                restaurant.name.toLowerCase().includes(searchInput) ||
                restaurant.specialty.toLowerCase().includes(searchInput)
            );
        } else if (searchCriteria === "name") {
            return restaurant.name.toLowerCase().includes(searchInput);
        } else if (searchCriteria === "specialty") {
            return restaurant.specialty.toLowerCase().includes(searchInput);
        }
    });

    if (filteredRestaurants.length === 0) {
        const ResturantsContainer = document.getElementById("resturants-Grid");
        ResturantsContainer.innerHTML = "<tr><td>No restaurants found matching the criteria.</td></tr>";
    } else {
        DisplayResturants(filteredRestaurants);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (searchBtn) {
        searchBtn.addEventListener('click', searchRestaurants);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            DisplayResturants(ResturantsArray);
        });
    }
});




document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('restaurantForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const specialty = document.getElementById('specialty').value;
        const address = document.getElementById('adress').value;
        const description = document.getElementById('description').value;
        
        // Get image file
        const imageFile = document.getElementById('image').files[0];
        
        // Create FormData for image upload (if needed)
        const formData = new FormData();
        formData.append('image', imageFile);

        // Prepare restaurant object
        const newRestaurant = {
            name: name,
            specialty: specialty,
            address: address,
            description: description,
            rating: 4.0, // Default rating
            image: `images/${imageFile.name}`, // Adjust path as needed
            site: '#', // You can modify this
            tel: 'N/A' // You can modify this
        };

        // Send POST request to add restaurant
        fetch('http://localhost:3000/add-restaurant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRestaurant)
        })
        .then(response => response.json())
        .then(data => {
            alert('Restaurant added successfully!');
            
            // Optional: Refresh the restaurant list
            fetch('http://localhost:3000/resturants')
                .then(res => res.json())
                .then(restaurants => {
                    DisplayResturants(restaurants);
                });
            
            // Reset the form
            form.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add restaurant');
        });
    });
});



