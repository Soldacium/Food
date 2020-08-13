
import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
}

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResultPages.innerHTML = '';
};

export const highlightSelected = id => {
    const allPrev = Array.from(document.querySelectorAll('.results__link'));
    allPrev.forEach(el => {
        el.classList.remove('result__link-active');
    })
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('result__link-active')
};

//make titles smaller through algorithm
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];

    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => { //split title by space and analyze, could also be just forEach
            if (acc + cur.length <= limit) {
                newTitle.push(cur)
            }
            return acc + cur.length;
        }, 0) 

        //return the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => { //results__link--active, recipe id useful for recipe.js
    const markup = 
    `
    <li>
        <a class="results__link " href="#${recipe.id}">
            <figure class="results__fig">
                <img src="https://spoonacular.com/recipeImages/${recipe.image}" alt="${recipe.id}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title) }</h4>
                <p class="results__author">${recipe.title}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResultList.insertAdjacentHTML('beforeend',markup)
};
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left': 'right'}"></use>
    </svg>
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
</button>
`; //data-[name] saves data in element
const renderButtons = (page, numResults, resultsPerPage) => {
    const pages = Math.ceil(numResults / resultsPerPage) ;

    let button;
    if (page === 1 && pages > 1){
        // next
        button = createButton(page, 'next')
    } else if (page < pages){
        //both
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}`

    } else if(page === pages && pages > 1){
        // prev
        button = createButton(page, 'prev')
    }

    elements.searchResultPages.insertAdjacentHTML('afterbegin',button)

};


export const renderResults = (recipes, page = 1, resultsPerPage = 10) => {
    //render results
    const start = (page - 1) * resultsPerPage;
    const end = page * resultsPerPage;

    recipes.slice(start,end).forEach(recipe => {
        renderRecipe(recipe)
    });

    //render buttons
    renderButtons(page, recipes.length, resultsPerPage)
}