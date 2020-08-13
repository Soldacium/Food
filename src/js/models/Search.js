import axios from 'axios';
import { key } from '../config';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults(query) {
        
        
        await axios({
            "method":"GET",
            "url":"https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/search",
            "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
            "x-rapidapi-key": key,
            "useQueryString":true
            },"params":{
            "number":"30",
            "query":this.query
            }
            })
            .then((response)=>{
              this.result = response.data.results;
              
            })
            .catch((error)=>{
              console.log(error)
            })
    }
}



