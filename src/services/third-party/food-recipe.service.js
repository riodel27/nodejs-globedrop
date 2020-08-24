/**NOTE: THIS FILE/SERVICE IS JUST FOR REDIS CACHE DEMONSTRATION... */

/** Third party API/Service Business logic here... */

const axios = require("axios");
const { not } = require("ramda");
const { promisify } = require("util");

class FoodRecipeService {
  constructor(container) {
    this.base_url = `http://www.recipepuppy.com/api/`;
    this.redis_client = container.get("redis.client");
    this.redis_client_async_get = promisify(this.redis_client.get).bind(
      this.redis_client
    );
  }

  async getRecipesByFoodItem(foodItem) {
    const query = foodItem.toLowerCase();

    // Check the redis store for the data first
    const recipe = await this.redis_client_async_get(query);

    if (not(recipe)) {
      // When the data is not found in the cache then we can make request to the server
      const response = await axios.get(`${this.base_url}?q=${query}`);

      // save the record in the cache for subsequent request
      this.redis_client.setex(
        query,
        1440,
        JSON.stringify(response.data.results)
      );

      return {
        error: false,
        message: `Recipe for ${query} from the server`,
        data: response.data.results,
      };
    }

    return {
      error: false,
      message: `Recipe for ${query} from the cache`,
      data: JSON.parse(recipe),
    };
  }
}

module.exports = FoodRecipeService;
