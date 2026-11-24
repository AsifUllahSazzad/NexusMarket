import {
  createProduct,
  deleteProduct,
  getMerchantProducts,
  getProductById,
  updateMerchantProduct,
  updateMerchantProductStatus,
  updateMerchantProductStock,
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

// Update Only Single Product Status
export const changeProductStatus = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);

    const status =
      typeof req.body.status === "string"
        ? req.body.status.trim().toLowerCase()
        : "";

    // Validate authenticated user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Validate product ID
    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // Update database
    const product = await updateMerchantProductStatus(
      userId,
      productId,
      status,
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you do not own this product.",
      });
    }

    // Success
    return res.status(200).json({
      success: true,
      message: "Product status updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Change product status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product status.",
    });
  }
};

// Update Only Single Product Stock
export const changeProductStock = async (req, res) => {
  try {
    const userId = req.user?.id;
    const productId = Number(req.params.productId);
    const { change } = req.body;

    // Validate authenticated user
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Validate product ID
    if (!Number.isSafeInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    // Only allow +1 or -1
    if (change !== 1 && change !== -1) {
      return res.status(400).json({
        success: false,
        message: "Stock change must be either 1 or -1.",
      });
    }

    // Update database
    const product = await updateMerchantProductStock(userId, productId, change);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found, unauthorized, or insufficient stock.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product stock updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Change product stock error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product stock.",
    });
  }
};

// Update Product Details
export const editMerchantProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const merchantId = req.user?.id;

    // 1. Authentication check
    if (!merchantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Receive request data
    const {
      productName,
      sku,
      imageUrl,
      description,
      category,
      price,
      stockQuantity,
      status,
    } = req.body;

    // Optional fields
    const normalizedSku =
      typeof sku === "string" && sku.trim() ? sku.trim().toUpperCase() : null;

    const normalizedImageUrl =
      typeof imageUrl === "string" && imageUrl.trim() ? imageUrl.trim() : null;

    const normalizedDescription =
      typeof description === "string" && description.trim()
        ? description.trim()
        : null;

    const normalizedStatus =
      typeof status === "string" ? status.toLowerCase() : "";

    const parsedStock = Number(stockQuantity);
    const parsedPrice = Number(price);

    // Update database
    const updatedProduct = await updateMerchantProduct({
      productId,
      merchantId: String(merchantId),
      productName: productName.trim(),
      sku: normalizedSku,
      imageUrl: normalizedImageUrl,
      description: normalizedDescription,
      category: category.trim(),
      price: parsedPrice,
      stockQuantity: parsedStock,
      status: normalizedStatus,
    });

    // Product not found or not owned by merchant
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Edit merchant product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

// Delete Single Product
export const removeProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const merchantId = req.user.id;

    // Validate product ID
    if (!/^[1-9]\d*$/.test(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const deletedProduct = await deleteProduct(productId, merchantId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// Get one product belonging to logged-in merchant -> Not use
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
