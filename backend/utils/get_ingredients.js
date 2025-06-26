
async function getIngredients() {
    try {
        const ingredients = await ingredients.find()
            .populate('Product_ingredients.Ingredient2', '_id','name','stock_quantity','unit') // Populate product details
            .exec();

        console.log(ingredients);
    } catch (error) {
        console.error(error);
    }
}

getIngredients();