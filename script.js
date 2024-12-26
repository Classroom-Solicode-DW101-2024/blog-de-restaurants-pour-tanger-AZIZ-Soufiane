let ResturantsArray =[];

fetch('http://localhost:3000/resturants').then(resturants =>{
    let resturantsInfo = resturants.json();
    console.log(resturantsInfo);
    return resturantsInfo;
}).then((resturantsInfo) => {

    resturantsInfo.forEach(resturant => {
        ResturantsArray.push(resturant);
    });

    DisplayResturants(ResturantsArray );
});


function DisplayResturants(resturants){
    let ResturantsContainer = document.getElementById("resturants-Grid");

    ResturantsContainer.innerHTML="";

    resturants.forEach(resturant => {
        const card = document.createElement("div");
        card.className = "restaurant-card";

        card.innerHTML= `<a href="resturants.html?name=${encodeURIComponent(resturant.name)}" class="card-link">
            <img src="${resturant.image}" alt="${resturant.name}">
            <h3>${resturant.name}</h3>
            <p>${resturant.specialty}</p>
            <p>${resturant.rating} ⭐</p>
        </a>`
    ; ;
    ResturantsContainer.appendChild(card);

    });
   
}


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
        const restaurantsList = document.getElementById("resturants-Grid");
        restaurantsList.innerHTML = "<p>No restaurants found matching the criteria.</p>";
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

