import { ALL, APPLIANCES, INGREDIENTS, REMOVE, USTENSILS } from "../../../@types/constants.js";
import { fetchRecipes } from "../models/recipe.js";
import { search } from "./search.js";
/** @typedef {import('../../../@types/index.js').Recipe} Recipe*/

/** @type {Recipe[]} */
let recipes = [];
/** @type {Recipe[]} */
let allRecipes = [];

const filterCallbacks = {
	ingredients(element) {
		return (recipe) => recipe.ingredients.some((i) => i.ingredient.toLowerCase() === element);
	},
	appliances(element) {
		return (recipe) => recipe.appliance.toLowerCase() === element;
	},
	ustensils(element) {
		return (recipe) => recipe.ustensils.some((u) => u.toLowerCase() === element);
	},
	/** @param {string} element */
	all(element) {
		return (
			/** @param {Recipe} recipe*/
			(recipe) =>
				recipe.name.toLowerCase().includes(element) ||
				recipe.ingredients.some((i) => i.ingredient.toLowerCase().startsWith(element)) ||
				recipe.description.toLowerCase().includes(element)
		);
	},
};

export async function filterRecipes(filterType) {
	if (allRecipes.length === 0) {
		allRecipes = await fetchRecipes();
		recipes = allRecipes;
	}

	if (filterType) {
		switch (filterType.type) {
			case INGREDIENTS:
				recipes = recipes.filter(filterCallbacks.ingredients(filterType.element));
				break;
			case APPLIANCES:
				recipes = recipes.filter(filterCallbacks.appliances(filterType.element));
				break;
			case USTENSILS:
				recipes = recipes.filter(filterCallbacks.ustensils(filterType.element));
				break;
			case REMOVE:
				recipes = allRecipes;
				filterType.element.forEach((filter) => {
					recipes = recipes.filter(filterCallbacks[filter.type](filter.text));
				});
				search();
				break;
			case ALL:
				recipes = recipes.filter(filterCallbacks.all(filterType.element));
				break;
			default:
				console.error("Invalid filter type");
				break;
		}
	}

	return recipes;
}
