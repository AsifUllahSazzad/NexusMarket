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
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

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

    user_id UUID NOT NULL UNIQUE,

    studio_or_brand_name TEXT NOT NULL,

    trade_license TEXT NOT NULL UNIQUE,

    category TEXT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_merchant_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Buyer profile
CREATE TABLE buyer_profiles (
    buyer_id BIGINT GENERATED ALWAYS AS IDENTITY (START WITH 20000 INCREMENT BY 1) PRIMARY KEY,

    user_id UUID NOT NULL UNIQUE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_buyer_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


SELECT * FROM users;
SELECT * FROM merchant_profiles;
SELECT * FROM buyer_profiles;

DELETE FROM users WHERE user_id = 1;

DROP TABLE users CASCADE;


-- INSERT INTO merchant_profiles(user_id, studio_or_brand_name, trade_license, category, created_at, updated_at) VALUES();


-- SELECT NOW();