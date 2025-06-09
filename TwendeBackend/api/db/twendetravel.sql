-- Users and Authentication
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    role ENUM('user', 'admin', 'support') DEFAULT 'user'
);

-- Countries and Destinations
CREATE TABLE countries (
    country_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    code CHAR(2) NOT NULL,
    currency_code CHAR(3) NOT NULL,
    exchange_rate DECIMAL(10,4),
    last_rate_update TIMESTAMP,
    travel_info TEXT,
    map_data JSON
);

CREATE TABLE destinations (
    destination_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    country_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    average_rating DECIMAL(3,2),
    map_3d_data JSON,
    offline_data JSON,
    FOREIGN KEY (country_id) REFERENCES countries(country_id)
);

-- Services and Pricing
CREATE TABLE service_types (
    service_type_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price_usd DECIMAL(10,2) NOT NULL
);

CREATE TABLE service_packages (
    package_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_usd DECIMAL(10,2) NOT NULL
);

CREATE TABLE package_services (
    package_id INT,
    service_type_id INT,
    PRIMARY KEY (package_id, service_type_id),
    FOREIGN KEY (package_id) REFERENCES service_packages(package_id),
    FOREIGN KEY (service_type_id) REFERENCES service_types(service_type_id)
);

-- Transportation and Routes
CREATE TABLE routes (
    route_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    origin_id BIGINT,
    destination_id BIGINT,
    provider VARCHAR(100),
    transport_type ENUM('flight', 'bus', 'train', 'car'),
    base_price_usd DECIMAL(10,2),
    duration_minutes INT,
    FOREIGN KEY (origin_id) REFERENCES destinations(destination_id),
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
);

-- Accommodations
CREATE TABLE accommodations (
    accommodation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    destination_id BIGINT,
    name VARCHAR(255) NOT NULL,
    type ENUM('hotel', 'bnb', 'apartment', 'hostel'),
    price_per_night_usd DECIMAL(10,2),
    rating DECIMAL(3,2),
    amenities JSON,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
);

-- Bookings and Transactions
CREATE TABLE bookings (
    booking_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    total_amount_usd DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE booking_services (
    booking_id BIGINT,
    service_type_id INT,
    status ENUM('pending', 'in_progress', 'completed'),
    price_usd DECIMAL(10,2),
    PRIMARY KEY (booking_id, service_type_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (service_type_id) REFERENCES service_types(service_type_id)
);

CREATE TABLE payments (
    payment_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    booking_id BIGINT,
    amount_usd DECIMAL(10,2),
    currency ENUM('USD', 'GHS', 'KES'),
    exchange_rate DECIMAL(10,4),
    amount_local DECIMAL(10,2),
    status ENUM('pending', 'completed', 'failed', 'refunded'),
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Chat and Support
CREATE TABLE chat_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    agent_id BIGINT,
    status ENUM('active', 'closed'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (agent_id) REFERENCES users(user_id)
);

CREATE TABLE chat_messages (
    message_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT,
    sender_id BIGINT,
    message_type ENUM('text', 'image', 'location'),
    content TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(session_id),
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

-- Reviews and Ratings
CREATE TABLE reviews (
    review_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    booking_id BIGINT,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Offline Data Management
CREATE TABLE offline_cache (
    cache_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    destination_id BIGINT,
    data_type ENUM('map', 'route', 'poi', 'guide'),
    cache_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (destination_id) REFERENCES destinations(destination_id)
);