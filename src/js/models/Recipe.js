import axios from 'axios';
import { key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        await axios({
            "method":"GET",
            "url":`https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${this.id}/information`,
            "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": key,
            "useQueryString":true
            }
            })
            .then((response)=>{
              
              

              this.title = response.data.title;
              this.img = response.data.image;
              this.source = response.data.sourceUrl;
              this.ingredients = response.data.extendedIngredients;
              this.author = response.data.sourceName;
              this.cookTime = response.data.readyInMinutes;
              this.servings = response.data.servings;
              
              
            })
            .catch((error)=>{
              console.log(error)
            })
    }

    parseIngredients() {
      const unitsLong = ['tablespoons']
      const newIngredients = this.ingredients.map(el => {
        let objIng = {
          amount: el.amount,
          name: el.originalName,
          unit: el.unit
        }

        return objIng;
      });

      this.ingredients = newIngredients
    }

    updateServings (type) {
      //servings
      const newServings = (type === 'dec') ? this.servings - 1 : this.servings + 1;

      this.ingredients.forEach(ing => {
        ing.amount *= (newServings / this.servings);
      })
      //ingredients
      this.servings = newServings;
    }
}