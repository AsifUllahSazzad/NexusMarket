-- create a user table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile_phone VARCHAR(30) NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'buyer'
        CHECK (role IN ('buyer', 'admin')),
    agreement_accepted BOOLEAN NOT NULL
        CHECK (agreement_accepted = TRUE),
    agreement_accepted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS buyer_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    delivery_city VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS merchant_applications (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    brand_name VARCHAR(150) NOT NULL,
    primary_product_category VARCHAR(100) NOT NULL,
    verification_type VARCHAR(20) NOT NULL
        CHECK (verification_type IN ('trade_license', 'nid')),
    verification_code TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'approved', 'rejected')),
    reviewed_by BIGINT REFERENCES users(id),
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



CREATE UNIQUE INDEX IF NOT EXISTS
    merchant_applications_one_active_per_user
ON merchant_applications (user_id)
WHERE status IN ('pending', 'approved');



CREATE INDEX IF NOT EXISTS idx_merchant_applications_user_id
    ON merchant_applications(user_id);

CREATE INDEX IF NOT EXISTS idx_merchant_applications_status
    ON merchant_applications(status);


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



-- ----------------------------
SELECT * FROM users;
SELECT * FROM buyer_profiles;
SELECT * FROM merchant_applications;

DELETE FROM users WHERE full_name = 'Asif';

INSERT INTO buyer_profiles(user_id, delivery_city) VALUES()


SELECT current_database(), current_user;