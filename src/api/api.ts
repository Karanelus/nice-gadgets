import { Item } from "../types/itemDetail";
import { Product } from "../types/product";

export const getItems = async () => {
  try {
    const response = await fetch("/nice-gadgets/api/products.json");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const spitedCategories = data.reduce(
      (
        acc: Record<Product["category"], Product[]>,
        currentProduct: Product,
      ) => {
        const key = currentProduct.category;
        acc[key] = acc[key] ? [...acc[key], currentProduct] : [currentProduct];
        return acc;
      },
      {},
    );

    return {
      productsList: data,
      phonesList: spitedCategories.phones,
      tabletsList: spitedCategories.tablets,
      accessoriesList: spitedCategories.accessories,
    };
  } catch (err) {
    console.error("Something went wrong", err);
    throw err;
  }
};

export const getItem = async (productType: string, idItem: string) => {
  try {
    const dataResponse = await fetch(
      `/nice-gadgets/api/${productType}.json`,
    );

    if (!dataResponse.ok) {
      throw new Error("Network response was not ok");
    }

    const dataProducts: Item[] = await dataResponse.json();
    const product = dataProducts.find((item) => item.id === idItem);
    return { categoryList: dataProducts, itemInfo: product };
  } catch (err) {
    console.error("Error fetching data: ", err);
  }
};
