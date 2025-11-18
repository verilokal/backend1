ALTER TABLE business
ADD UNIQUE (registered_business_name),
ADD UNIQUE (registration_number),
ADD UNIQUE (email);