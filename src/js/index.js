// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import {elements, renderLoader, clearLoader} from './views/base'

/* GLOBAL STATE 
    -search
    -curr recipe
    -shopping list
    -linked recipes
*/
const state = {}

const controlSearch = async () => {
    //get query
    const query = searchView.getInput();

    if (query) {
        //  New search
        state.search = new Search(query);

        // Waiting for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultList);
        

        // Search
        await state.search.getResults();
        clearLoader();

        //displey results
        searchView.renderResults(state.search.result);
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch()
});

elements.searchResultPages.addEventListener('click', (e) => { // we add event listener even before buttons are made
    const btn = e.target.closest('.btn-inline') //we look for any buttons
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); //change data from string to number
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

//search.getResults()

//recipe contraoller
/*
const r = new Recipe(479101);
r.getRecipe();
*/

const controlRecipie = async () => { 
    const id = window.location.hash.replace('#', '');

    if (id ) {
        //Prepare UI for changes
        recipeView.clearRecipe()
        renderLoader(elements.recipe)

        // highlight selected item
        if(state.search) searchView.highlightSelected(id)
        //create new recipe data
        state.recipe = new Recipe(id)

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //get recipe data

            //render
            console.log(state.recipe)   
            
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                )
        } catch (err) {
            console.log(err)
        }



    }

}

window.addEventListener('hashchange', () => { //add event listener to change in site address
    controlRecipie()
})

window.addEventListener('load',controlRecipie);

/***** LIST CONTRAOLLER */

const controlList = () => {
    //new list
    if (!state.list) state.list = new List();

    //add ingredient to list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.amount,el.unit,el.name);
        listView.renderItem(item)
    })

}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // handle delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')){
        state.list.deleteItem(id);
        listView.deleteItem(id)
    } else if (e.target.matches('.shopping__count-value')) { //update whenever we click
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id, val)
    }

    console.log(id)
})


/****** LIKE CONTROLLER */
/* TESTING */
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumLikes());



const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // check if already liked
    if (!state.likes.isLiked(currentID)){
        //add like to state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );
        //toggle like
        likesView.toggleLikeBtn(true);

        //UI
        likesView.renderLike(newLike);
        

    } else {
        state.likes.deleteLike(currentID)

        likesView.toggleLikeBtn(false);

        likesView.deleteLike(currentID);
        
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
}



//recipe button clicks using 'matches'
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //decrease button clicked
        if (state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIng(state.recipe)
           
        }
        
    }else if (e.target.matches('.btn-increase, .btn-increase *')){
        //decrease button clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    
    } else if (e.target.matches('.recipe__btn--add,.recipe__btn--add *')){
        //add items
        controlList()
    }else if (e.target.matches('.recipe__love,.recipe__love *')){
        controlLike()
    }
     
});


window.l = new List();