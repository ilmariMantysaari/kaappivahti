import { db } from ".";
import { ProductDetails } from "./productSearch";

export const insertProduct = async (product: ProductDetails) => {
  return db("products")
    .insert({
      barcode: product.barcode,
      product_name: product.name,
      pic_url: product.picUrl,
      created: new Date(),
      active: true,
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      return false;
    });
};

export const insertToPantry = async (barCode: string, date?: Date) => {
  return db("pantry")
    .insert({
      product_barcode: barCode,
      date: date || new Date(),
    })
    .then(() => {
      return true;
    });
};

export const removeFromPantry = (pantryId: number) => {
  return db("pantry")
    .delete()
    .where("id", pantryId)
    .then(() => {
      return true;
    });
};

// Get all products and their info from pantry
export const listPantry = async () => {
  return db("pantry")
    .select(
      "pantry.id",
      "products.barcode",
      "products.product_name",
      "products.pic_url",
      "pantry.date"
    )
    .innerJoin("products", "products.barcode", "pantry.product_barcode");
};
