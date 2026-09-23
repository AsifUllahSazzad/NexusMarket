users
  │
  ├── buyer_profiles
  │
  └── merchant_profiles
          │
          └── products
                 │
                 └── order_items
orders ───────────┘
  │
  └── payments

products
  ├── product_images
  └── categories

users
  ├── addresses
  ├── cart
  └── wishlist

-- Users table for authentication data check
CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,

    full_name TEXT NOT NULL,

    email TEXT NOT NULL UNIQUE,

    phone VARCHAR(20) NOT NULL UNIQUE,

    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('buyer', 'merchant', 'admin')),

    is_active BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Merchant profile
CREATE TABLE merchant_profiles (
    merchant_id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 10000 INCREMENT BY 1) PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    studio_or_brand_name TEXT NOT NULL,

    trade_license TEXT NOT NULL UNIQUE,

    delivery_city TEXT,

    category TEXT,

    agreed_to_code BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_merchant_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Buyer profile
CREATE TABLE buyer_profiles (
    buyer_id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 1 INCREMENT BY 1) PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_buyer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);