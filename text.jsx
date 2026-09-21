// nexus-market/
// │
// ├── frontend/
// │   ├── public/
// │   │   └── images/
// │   │
// │   ├── src/
// │   │   ├── assets/
// │   │   │
// │   │   ├── components/
// │   │   │   ├── common/
// │   │   │   │   ├── Navbar.jsx
// │   │   │   │   ├── Footer.jsx
// │   │   │   │   ├── Loader.jsx
// │   │   │   │   └── Modal.jsx
// │   │   │   │
// │   │   │   ├── product/
// │   │   │   │   ├── ProductCard.jsx
// │   │   │   │   ├── ProductGrid.jsx
// │   │   │   │   ├── ProductFilter.jsx
// │   │   │   │   └── ProductRating.jsx
// │   │   │   │
// │   │   │   ├── cart/
// │   │   │   │   ├── CartItem.jsx
// │   │   │   │   └── CartSummary.jsx
// │   │   │   │
// │   │   │   └── seller/
// │   │   │       ├── Sidebar.jsx
// │   │   │       └── SellerNavbar.jsx
// │   │   │
// │   │   ├── pages/
// │   │   │   ├── home/
// │   │   │   │   └── Home.jsx
// │   │   │   │
// │   │   │   ├── shop/
// │   │   │   │   ├── Shop.jsx
// │   │   │   │   ├── Category.jsx
// │   │   │   │   └── SearchResults.jsx
// │   │   │   │
// │   │   │   ├── product/
// │   │   │   │   └── ProductDetails.jsx
// │   │   │   │
// │   │   │   ├── cart/
// │   │   │   │   └── Cart.jsx
// │   │   │   │
// │   │   │   ├── checkout/
// │   │   │   │   ├── Checkout.jsx
// │   │   │   │   └── OrderSuccess.jsx
// │   │   │   │
// │   │   │   ├── auth/
// │   │   │   │   ├── Login.jsx
// │   │   │   │   ├── Register.jsx
// │   │   │   │   ├── ForgotPassword.jsx
// │   │   │   │   └── ResetPassword.jsx
// │   │   │   │
// │   │   │   ├── account/
// │   │   │   │   ├── Profile.jsx
// │   │   │   │   ├── Orders.jsx
// │   │   │   │   ├── OrderDetails.jsx
// │   │   │   │   ├── Wishlist.jsx
// │   │   │   │   └── Addresses.jsx
// │   │   │   │
// │   │   │   ├── seller/
// │   │   │   │   ├── Dashboard.jsx
// │   │   │   │   ├── Products.jsx
// │   │   │   │   ├── AddProduct.jsx
// │   │   │   │   ├── EditProduct.jsx
// │   │   │   │   ├── Orders.jsx
// │   │   │   │   └── Settings.jsx
// │   │   │   │
// │   │   │   └── admin/
// │   │   │       ├── Dashboard.jsx
// │   │   │       ├── Users.jsx
// │   │   │       ├── Sellers.jsx
// │   │   │       ├── Products.jsx
// │   │   │       ├── Categories.jsx
// │   │   │       ├── Orders.jsx
// │   │   │       └── Payments.jsx
// │   │   │
// │   │   ├── layouts/
// │   │   │   ├── MainLayout.jsx
// │   │   │   ├── AuthLayout.jsx
// │   │   │   ├── SellerLayout.jsx
// │   │   │   └── AdminLayout.jsx
// │   │   │
// │   │   ├── routes/
// │   │   │   ├── AppRoutes.jsx
// │   │   │   ├── ProtectedRoute.jsx
// │   │   │   ├── SellerRoute.jsx
// │   │   │   └── AdminRoute.jsx
// │   │   │
// │   │   ├── services/
// │   │   │   ├── api.js
// │   │   │   ├── authService.js
// │   │   │   ├── productService.js
// │   │   │   ├── cartService.js
// │   │   │   ├── orderService.js
// │   │   │   └── paymentService.js
// │   │   │
// │   │   ├── context/
// │   │   │   ├── AuthContext.jsx
// │   │   │   ├── CartContext.jsx
// │   │   │   └── WishlistContext.jsx
// │   │   │
// │   │   ├── hooks/
// │   │   │   ├── useAuth.js
// │   │   │   ├── useCart.js
// │   │   │   └── useProducts.js
// │   │   │
// │   │   ├── utils/
// │   │   │   ├── formatPrice.js
// │   │   │   └── constants.js
// │   │   │
// │   │   ├── App.jsx
// │   │   ├── main.jsx
// │   │   └── index.css
// │   │
// │   ├── .env
// │   ├── .env.example
// │   ├── .gitignore
// │   ├── package.json
// │   └── README.md
// │
// │
// ├── backend/
// │   ├── src/
// │   │   ├── config/
// │   │   │   ├── db.js
// │   │   │   └── env.js
// │   │   │
// │   │   ├── controllers/
// │   │   │   ├── authController.js
// │   │   │   ├── userController.js
// │   │   │   ├── productController.js
// │   │   │   ├── categoryController.js
// │   │   │   ├── cartController.js
// │   │   │   ├── wishlistController.js
// │   │   │   ├── orderController.js
// │   │   │   ├── paymentController.js
// │   │   │   ├── sellerController.js
// │   │   │   └── adminController.js
// │   │   │
// │   │   ├── routes/
// │   │   │   ├── authRoutes.js
// │   │   │   ├── userRoutes.js
// │   │   │   ├── productRoutes.js
// │   │   │   ├── categoryRoutes.js
// │   │   │   ├── cartRoutes.js
// │   │   │   ├── wishlistRoutes.js
// │   │   │   ├── orderRoutes.js
// │   │   │   ├── paymentRoutes.js
// │   │   │   ├── sellerRoutes.js
// │   │   │   └── adminRoutes.js
// │   │   │
// │   │   ├── models/
// │   │   │   ├── userModel.js
// │   │   │   ├── productModel.js
// │   │   │   ├── categoryModel.js
// │   │   │   ├── cartModel.js
// │   │   │   ├── wishlistModel.js
// │   │   │   ├── orderModel.js
// │   │   │   └── paymentModel.js
// │   │   │
// │   │   ├── middleware/
// │   │   │   ├── authMiddleware.js
// │   │   │   ├── roleMiddleware.js
// │   │   │   ├── errorMiddleware.js
// │   │   │   ├── uploadMiddleware.js
// │   │   │   └── validateMiddleware.js
// │   │   │
// │   │   ├── services/
// │   │   │   ├── authService.js
// │   │   │   ├── emailService.js
// │   │   │   ├── paymentService.js
// │   │   │   └── tokenService.js
// │   │   │
// │   │   ├── validators/
// │   │   │   ├── authValidator.js
// │   │   │   ├── productValidator.js
// │   │   │   └── orderValidator.js
// │   │   │
// │   │   ├── utils/
// │   │   │   ├── jwt.js
// │   │   │   ├── password.js
// │   │   │   └── response.js
// │   │   │
// │   │   ├── app.js
// │   │   └── server.js
// │   │
// │   ├── uploads/
// │   │   └── products/
// │   │
// │   ├── .env
// │   ├── .env.example
// │   ├── .gitignore
// │   ├── package.json
// │   └── README.md
// │
// ├── database/
// │   ├── migrations/
// │   ├── seeds/
// │   └── schema.sql
// │
// ├── .gitignore
// ├── README.md
// └── package.json