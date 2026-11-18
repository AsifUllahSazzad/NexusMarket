-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_phone VARCHAR(30) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'buyer'
        CHECK (role IN ('buyer', 'merchant', 'admin')),
    agreement_accepted BOOLEAN NOT NULL
        CHECK (agreement_accepted = TRUE),
    agreement_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create buyer_profiles table
CREATE TABLE IF NOT EXISTS buyer_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    delivery_city VARCHAR(100) NOT NULL
);

-- Create merchant_applications table
CREATE TABLE IF NOT EXISTS merchant_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(150) NOT NULL,
    primary_product_category VARCHAR(100) NOT NULL,
    trade_license_code TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by BIGINT REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create unique index to ensure one active merchant application per user
CREATE UNIQUE INDEX IF NOT EXISTS
    merchant_applications_one_active_per_user
ON merchant_applications (user_id)
WHERE status IN ('pending', 'approved');

-- Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_merchant_applications_user_id
    ON merchant_applications(user_id);

-- Create index on status for faster queries
CREATE INDEX IF NOT EXISTS idx_merchant_applications_status
    ON merchant_applications(status);

-- Create resubmission history table for merchant applications
CREATE TABLE IF NOT EXISTS merchant_application_submissions (
    submission_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    application_id BIGINT NOT NULL
        REFERENCES merchant_applications(id)
        ON DELETE CASCADE,

    version INTEGER NOT NULL,

    owner_name VARCHAR(150) NOT NULL,
    brand_name VARCHAR(150) NOT NULL,
    primary_product_category VARCHAR(100) NOT NULL,

    trade_license_code TEXT NOT NULL,
    mobile_phone VARCHAR(30) NOT NULL,

    compliance_note TEXT,

    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_application_version
        UNIQUE (application_id, version),

    CONSTRAINT positive_submission_version
        CHECK (version >= 1)
);


-- Create a product table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    merchant_id BIGINT NOT NULL
        REFERENCES users(id) ON DELETE CASCADE,

    product_name VARCHAR(200) NOT NULL,

    sku VARCHAR(80),

    image_url TEXT,

    description TEXT,

    category VARCHAR(100) NOT NULL,

    price NUMERIC(12, 2) NOT NULL
        CHECK (price >= 0),

    stock_quantity INTEGER NOT NULL DEFAULT 0
        CHECK (stock_quantity >= 0),

    status VARCHAR(20) NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'active', 'archived')),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


BEGIN;

ALTER TABLE users
DROP CONSTRAINT users_role_check;

ALTER TABLE users
ADD CONSTRAINT users_role_check
CHECK (role IN ('buyer', 'merchant', 'admin'));

COMMIT;









-- verify table
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
      'users',
      'buyer_profiles',
      'merchant_applications'
  )
ORDER BY table_name;





SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'merchant_applications'
ORDER BY indexname;


SELECT to_regclass(
    'public.merchant_application_submissions'
);




-- ----------------------------
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'users'::regclass
  AND contype = 'c';


  
SELECT * FROM users;
SELECT * FROM merchant_applications;
select * from merchant_application_submissions;
SELECT * FROM buyer_profiles;
SELECT * FROM products;

SELECT to_regclass('public.products');


DROP TABLE products;

--   DROP DATABASE nexusmarketdb WITH (FORCE);

-- CREATE DATABASE nexusmarketdb;


SELECT EXISTS (
        SELECT 1
        FROM merchant_applications
        WHERE user_id = $1
          AND status = 'approved'
      ) AS is_approved;



SELECT id, password_hash, role
FROM users
WHERE email = 'asif@gmail.com' AND role = 'merchant';

SELECT to_regclass('public.products');