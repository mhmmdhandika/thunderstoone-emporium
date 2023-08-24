export const getProductDataFromRows = (row) => {
  const products = [];

  row.forEach((item) => {
    const productIndex = products.findIndex(
      (product) => product.id === item.product_id
    );

    if (productIndex === -1) {
      const newProduct = {
        id: item.product_id,
        title: item.product_title,
        description: item.product_description,
        variations: [],
        images: [],
      };

      if (item.variation_id) {
        newProduct.variations.push({
          id: item.variation_id,
          color: item.variation_color,
          size: item.variation_size,
          price: item.variation_price,
          stock: item.variation_stock,
        });
      }

      if (item.image_id) {
        newProduct.images.push({
          id: item.image_id,
          image_path: item.image_path,
        });
      }

      products.push(newProduct);
    } else {
      if (item.variation_id) {
        products[productIndex].variations.push({
          id: item.variation_id,
          color: item.variation_color,
          size: item.variation_size,
          price: item.variation_price,
          stock: item.variation_stock,
        });
      }

      if (item.image_id) {
        const imageIndex = products[productIndex].images.findIndex(
          (image) => image.id === item.image_id
        );

        if (imageIndex === -1) {
          products[productIndex].images.push({
            id: item.image_id,
            image_path: item.image_path,
          });
        }
      }
    }
  });
  return products;
};
