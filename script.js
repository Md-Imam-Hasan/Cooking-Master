const form = document.getElementById('form');
const search = document.getElementById('search');
const showFoodIngredients = document.getElementById("show-food-ingredients");
const showFood = document.getElementById("show-food");

const init = () => {
  showFoodIngredients.style.display = 'none';
  showFood.className = '';
  showFood.innerHTML = '';
}
// api URL 
const apiURL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

// adding event listener in form
form.addEventListener('submit', (e) => {
  const searchValue = search.value.trim();
  e.preventDefault();
  if (!searchValue) {
    alert("There is nothing to search");
  }
  else {
    searchFood(searchValue);
  }
});

// Search Food
const searchFood = async searchValue => {
  const searchResult = await fetch(`${apiURL}${searchValue}`);
  const data = await searchResult.json();
  displayFoods(data);
}

// Displaying Food Items
const displayFoods = foodItems => {
  init();
  if (foodItems.meals === null) {
    errorMessage();
  } else {
    renderFoodItems(foodItems.meals);
  }
}

const errorMessage = () => {
  const message = `
    <div class="text-center">
      <h1>Sorry, This Food Recipe Is Not Available Now </h1>
    </div>`;
  showFood.innerHTML = message;
}

const renderFoodItems = foodItemMeals => {
  showFood.className = 'showing-food';
  foodItemMeals.forEach(foodItem => {
    const foodItemDiv = document.createElement('div');
    foodItemDiv.className = 'food-item';
    const foodItemInfo = `
      <a onclick="displayFoodIngredients('${foodItem.strMeal}')" href="#show-food-ingredients">
        <img src="${foodItem.strMealThumb}" class="food-image img-fluid" alt="food-image">
        <h5 class="food-name my-3">${foodItem.strMeal}</h5>
      </a>`;
    foodItemDiv.innerHTML = foodItemInfo;
    showFood.appendChild(foodItemDiv);
  });
}

// Displaying Food Ingredients
const displayFoodIngredients = async foodName => {
  const foodItem = await fetch(`${apiURL}${foodName}`);
  const data = await foodItem.json();
  renderFoodIngredients(data.meals[0]);
}

const renderFoodIngredients = foodItem => {
  showFoodIngredients.style.display = 'block';
  showFoodIngredients.innerHTML = `
    <img src="${foodItem.strMealThumb}" class="food-image img-fluid mb-4" alt="food-image">
    <div class="ms-4">
      <h2 class="food-name mb-3">${foodItem.strMeal}</h2>
      <h5 >Ingredients</h5>
    </div>`;
    addIngredientList(foodItem);
}

const addIngredientList = foodItem =>{
  for (let i = 1; ; i++) {
    const ingredient = 'strIngredient' + i;
    const measure = 'strMeasure' + i;
    if (!foodItem[ingredient]) break;
    else {
      const ingredients = document.createElement("div");
      ingredients.className = 'ms-4';
      const ingredientInfo = `
      <span><i class="fas fa-check-square icon"></i></span>&nbsp&nbsp ${foodItem[ingredient]} ${foodItem[measure]}<span> </span>`;
      ingredients.innerHTML = ingredientInfo;
      showFoodIngredients.appendChild(ingredients);
    }
  }
}