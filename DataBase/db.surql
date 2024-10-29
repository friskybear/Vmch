
DEFINE TABLE users SCHEMAFULL;
DEFINE FIELD full_name ON users TYPE string;
DEFINE FIELD national_code ON users TYPE string;
DEFINE FIELD phone_number ON users TYPE string;
DEFINE FIELD email ON users TYPE string;
DEFINE FIELD password_hash ON users TYPE string;
DEFINE FIELD wallet_balance ON users TYPE number DEFAULT 0;
DEFINE FIELD time on users type object;
DEFINE FIELD time.created_at ON users TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON users TYPE datetime VALUE time::now();

DEFINE TABLE doctors SCHEMAFULL;
DEFINE FIELD full_name ON doctors TYPE string;
DEFINE FIELD medical_code ON doctors TYPE string;
DEFINE FIELD national_code ON doctors TYPE string;
DEFINE FIELD phone_number ON doctors TYPE string;
DEFINE FIELD email ON doctors TYPE string;
DEFINE FIELD password_hash ON doctors TYPE string;
DEFINE FIELD specialization ON doctors TYPE string;
DEFINE FIELD category ON doctors TYPE record<categories>;
DEFINE FIELD profile_image ON doctors TYPE string;
DEFINE FIELD consultation_fee ON doctors TYPE number;
DEFINE FIELD admin_commission_percentage ON doctors TYPE number;
DEFINE FIELD wallet_balance ON doctors TYPE number DEFAULT 0;
DEFINE FIELD status ON doctors TYPE string ASSERT $value IN ['active', 'disabled'];
DEFINE FIELD availability ON doctors TYPE number DEFAULT 10;
DEFINE FIELD card_number ON doctors TYPE array<string>;
DEFINE FIELD time on doctors type object;
DEFINE FIELD time.created_at ON doctors TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON doctors TYPE datetime VALUE time::now();

DEFINE TABLE admins SCHEMAFULL;
DEFINE FIELD full_name ON admins TYPE string;
DEFINE FIELD email ON admins TYPE string;
DEFINE FIELD password_hash ON admins TYPE string;
DEFINE FIELD time on admins type object;
DEFINE FIELD time.created_at ON admins TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON admins TYPE datetime VALUE time::now();

DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD doctor ON sessions TYPE record<doctors>;
DEFINE FIELD patiant ON sessions TYPE record<users>;
DEFINE FIELD status ON sessions TYPE string DEFAULT 'new' ASSERT $value IN ['new', 'waiting' ,'answered', 'ended'];
DEFINE FIELD end_time ON sessions TYPE option<datetime>;
DEFINE FIELD rating ON sessions TYPE option<number>;
DEFINE FIELD feedback ON sessions TYPE option<string>;
DEFINE FIELD fee_paid ON sessions TYPE number DEFAULT 0;
DEFINE FIELD admin_share ON sessions TYPE number DEFAULT 0;
DEFINE FIELD time on sessions type object;
DEFINE FIELD time.created_at ON sessions TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON sessions TYPE datetime VALUE time::now();

-- Create Categories Table
DEFINE TABLE categories SCHEMAFULL;
DEFINE FIELD name ON categories TYPE string;
DEFINE FIELD time on categories type object;
DEFINE FIELD time.created_at ON categories TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON categories TYPE datetime VALUE time::now();

-- Create Payments Table
DEFINE TABLE payments SCHEMAFULL;
DEFINE FIELD user ON payments TYPE record<users>;
DEFINE FIELD doctor ON payments TYPE record<doctors>;
DEFINE FIELD amount ON payments TYPE number;
DEFINE FIELD payment_method ON payments TYPE string ASSERT $value IN ['wallet', 'direct'];
DEFINE FIELD status ON payments TYPE string ASSERT $value IN ['pending', 'completed', 'failed'];
DEFINE FIELD time on payments type object;
DEFINE FIELD time.created_at ON payments TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON payments TYPE datetime VALUE time::now();

-- Create Withdrawals Table
DEFINE TABLE withdrawals SCHEMAFULL;
DEFINE FIELD doctor ON withdrawals TYPE option<record<doctors>>;
DEFINE FIELD user ON withdrawals TYPE option<record<users>>;
DEFINE FIELD amount ON withdrawals TYPE number;
DEFINE FIELD status ON withdrawals TYPE string ASSERT $value IN ['pending', 'approved', 'denied'];
DEFINE FIELD time on withdrawals type object;
DEFINE FIELD time.created_at ON withdrawals TYPE datetime DEFAULT time::now();
DEFINE FIELD time.updated_at ON withdrawals TYPE datetime VALUE time::now();

-- Create Notifications Table
DEFINE TABLE notifications SCHEMAFULL;
DEFINE FIELD doctor ON notifications TYPE option<record<doctors>>;
DEFINE FIELD user ON notifications TYPE option<record<users>>;
DEFINE FIELD message ON notifications TYPE string;
DEFINE FIELD type ON notifications TYPE string ASSERT $value IN ['performance', 'session', 'general'];
DEFINE FIELD status ON notifications TYPE string ASSERT $value IN ['new', 'read'];
DEFINE FIELD time on notifications type object;
DEFINE FIELD time.created_at ON notifications TYPE datetime DEFAULT time::now();

-- Create Logs Table
DEFINE TABLE logs SCHEMAFULL;
DEFINE FIELD admin ON logs TYPE record<admin>;
DEFINE FIELD action ON logs TYPE string;
DEFINE FIELD details ON logs TYPE string;
DEFINE FIELD time on logs type object;
DEFINE FIELD time.created_at ON logs TYPE datetime DEFAULT time::now();
