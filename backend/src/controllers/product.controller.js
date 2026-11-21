import {
  createProduct,
  getMerchantProducts,
  getProductById,
} from "../models/productModel.js";

// Create product
export const createProductController = async (req, res, next) => {
  try {
    const {
      productName,
      imageUrl,
      sku,
      category,
      price,
      stockQuantity,
      status,
      description,
    } = req.body;

    // Merchant ID comes from verified JWT
    const merchantId = req.user.id;

    console.log("-->Before Database");

    const product = await createProduct(merchantId, {
      productName: productName.trim(),
      sku: sku.trim(),
      imageUrl: imageUrl,
      description: typeof description === "string" ? description.trim() : null,
      category: category.trim(),
      price: price,
      stockQuantity: Number(stockQuantity),
      status: status,
    });

    console.log("-->After Database");

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
  } catch (error) {
    console.log("Error Find");
    // Duplicate SKU for the same merchant
    if (
      error.code === "23505" &&
      error.constraint === "idx_products_merchant_sku"
    ) {
      return res.status(409).json({
        success: false,
        message: "You already have a product with this SKU.",
      });
    }

    next(error);
  }
};

// Get all products belonging to logged-in merchant
export const getMerchantProductsController = async (req, res, next) => {
  try {
    const merchantId = req.user.id;

    const products = await getMerchantProducts(merchantId);

    return res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get one product belonging to logged-in merchant
export const getMerchantProductByIdController = async (req, res, next) => {
  try {
    const merchantId = req.user.id;
    const { productId } = req.params;

    if (!/^\d+$/.test(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const product = await getProductById(productId, merchantId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
