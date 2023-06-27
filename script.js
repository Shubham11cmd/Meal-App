const input = document.querySelector('#search');
const card = document.querySelector('#card-container');
const singleCard = document.querySelector('#single-card-container');
const favouritesMeals = document.querySelector('#favourites-meals');

async function fetchMealsFromApi(url) {
    let data = await fetch(url);
    let results = await data.json();
    return results.meals;
}

// display all meal items for a given input search value
function displayMealList() {
    let generatedHtml = "";
    let favouriteMealArray = JSON.parse(localStorage.getItem("favouriteMealArray")) ?? [];
    let searchQuery = input.value;
    let baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchQuery}`;
    const meals = fetchMealsFromApi(baseUrl);
    meals
        .then((mealsArray) => {
            console.log(mealsArray);
            if(mealsArray.length) {
                mealsArray.forEach((meal) => {

                    // check if the meal is in the favourite list
                    let isFav = false;
                    const favItem = favouriteMealArray.find(item => item == meal.idMeal);
                    if(favItem) {
                        isFav = true;
                    }
                    if(isFav) {
                        generatedHtml += `
                        <div id="card" class="card m-3 p-1" style="width: 20rem;">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button type="button" class="btn btn-outline-light" onclick="displayMealDetails(${meal.idMeal})">View Details</button>
                                    <button id="main${meal.idMeal}" class="btn btn-outline-dark active" onclick="toggleFavouriteMealArray(${meal.idMeal})" style="border-radius:50%"><i class="fa fa-heart-o"></i></button>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        generatedHtml += `
                        <div id="card" class="card m-3 p-2" style="width: 20rem;">
                            <img src="${meal.strMealThumb}" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">${meal.strMeal}</h5>
                                <div class="d-flex justify-content-between mt-5">
                                    <button type="button" class="btn btn-outline-light" onclick="displayMealDetails(${meal.idMeal})">View Details</button>
                                    <button id="main${meal.idMeal}" class="btn btn-outline-dark" onclick="toggleFavouriteMealArray(${meal.idMeal})" style="border-radius:50%"><i class="fa fa-heart-o"></i></button>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                });
            } else {
                generatedHtml += `
                <div class="page-wrap d-flex flex-row align-items-center">
                    <div class="container">
                        <div class="row justify-content-center">
                            <div class="col-md-12 text-center">
                                <span class="display-1 d-block">404</span>
                                <div class="mb-4 lead">
                                    The meal you are looking for was not found.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `;
                
            }
            card.innerHTML = generatedHtml;
        })
}

// display details of a particular meal item
async function displayMealDetails(id) {

    // scroll to the top of page
    window.scrollTo(0,0)

    let url=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    let generatedHtml="";
    await fetchMealsFromApi(url).then(meals=>{
        generatedHtml += `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${meals[0].strMealThumb}" class="img-fluid rounded-start" alt="...">
                </div>
                <div id="details" class="col-md-8">
                <div id="card-details" class="card-body">
                    <h5 class="card-title"><b>Name</b>: ${meals[0].strMeal}</h5>
                    <p class="card-text"><b>Instructions</b>: ${meals[0].strInstructions}</p>
                    <p class="card-text"><small class="text-body-secondary"><b>Category</b>: ${meals[0].strCategory}</small></p>
                </div>
                </div>
            </div>
        </div>
      `;
    });
    singleCard.innerHTML = generatedHtml;
}

// Add or remove meal item from the favourite list
function toggleFavouriteMealArray(id) {
    // get the favourite meal array from the local storage
    let favouriteMealArray = JSON.parse(localStorage.getItem("favouriteMealArray")) ?? [];

    // check if item already exist in the favourites
    const addedItem = favouriteMealArray.find(item => item == id);
    
    if(addedItem) {
        //remove meal from the array
        const index = favouriteMealArray.indexOf(addedItem);
        favouriteMealArray.splice(index, 1);
    } else {
        favouriteMealArray.push(id);
    }
    localStorage.setItem("favouriteMealArray", JSON.stringify(favouriteMealArray));
    console.log(favouriteMealArray, '[array]');

    displayMealList();
    displayFavouriteMealList();
}

async function displayFavouriteMealList() {
    let favouriteMealArray = JSON.parse(localStorage.getItem("favouriteMealArray")) ?? [];
    let generatedHtml="";

    if(favouriteMealArray.length>0) {
        for (let index = 0; index < favouriteMealArray.length; index++) {
            let url=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${favouriteMealArray[index]}`;
            await fetchMealsFromApi(url)
                .then((meal) => {
                    generatedHtml += `
                    <div id="card" class="card m-3 p-1" style="width: 20rem;">
                        <img src="${meal[0].strMealThumb}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${meal[0].strMeal}</h5>
                            <div class="d-flex justify-content-between mt-5">
                                <button type="button" class="btn btn-outline-light" onclick="displayMealDetails(${meal[0].idMeal})">View Details</button>
                                <button id="main${meal[0].idMeal}" class="btn btn-outline-dark active" onclick="toggleFavouriteMealArray(${meal[0].idMeal})" style="border-radius:50%"><i class="fa fa-heart-o"></i></button>
                            </div>
                        </div>
                    </div>
                    `;
                })
        };
    } else {
        generatedHtml += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    favouritesMeals.innerHTML = generatedHtml;
}