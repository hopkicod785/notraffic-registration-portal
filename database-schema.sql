-- Vehicle Detection System Registration Database Schema
-- This SQL file contains the table definitions for Supabase

-- Installations table
CREATE TABLE IF NOT EXISTS installations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    intersection_name TEXT NOT NULL,
    end_user TEXT NOT NULL,
    distributor TEXT NOT NULL,
    cabinet_type TEXT NOT NULL,
    tls_connection TEXT NOT NULL,
    detection_io TEXT NOT NULL,
    phasing_files TEXT[] DEFAULT '{}',
    timing_files TEXT[] DEFAULT '{}',
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    estimated_install_date DATE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled'))
);

-- Mobility accounts table
CREATE TABLE IF NOT EXISTS mobility_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    end_user TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_installations_status ON installations(status);
CREATE INDEX IF NOT EXISTS idx_installations_install_date ON installations(estimated_install_date);
CREATE INDEX IF NOT EXISTS idx_installations_end_user ON installations(end_user);
CREATE INDEX IF NOT EXISTS idx_mobility_accounts_status ON mobility_accounts(status);
CREATE INDEX IF NOT EXISTS idx_mobility_accounts_email ON mobility_accounts(email);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_installations_updated_at 
    BEFORE UPDATE ON installations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mobility_accounts_updated_at 
    BEFORE UPDATE ON mobility_accounts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE installations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mobility_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on your security requirements)
CREATE POLICY "Enable read access for all users" ON installations FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON installations FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON installations FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON mobility_accounts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON mobility_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON mobility_accounts FOR UPDATE USING (true);

-- Insert sample data (optional)
INSERT INTO installations (
    intersection_name, end_user, distributor, cabinet_type, tls_connection, 
    detection_io, contact_name, contact_email, contact_phone, estimated_install_date, status
) VALUES 
(
    'Main St & 1st Ave', 'City of Example', 'ABC Traffic Solutions', 
    'Type A - Standard', 'TLS 1.3', '8-Channel Standard', 
    'John Smith', 'john.smith@example.com', '(555) 123-4567', 
    '2024-02-15', 'pending'
),
(
    'Oak St & 2nd Ave', 'State DOT', 'XYZ Traffic Systems', 
    'Type B - Enhanced', 'TLS 1.2 + 1.3', '16-Channel Enhanced', 
    'Jane Doe', 'jane.doe@state.gov', '(555) 987-6543', 
    '2024-02-20', 'completed'
);

INSERT INTO mobility_accounts (
    first_name, last_name, email, phone, end_user, status
) VALUES 
(
    'John', 'Smith', 'john.smith@example.com', '(555) 123-4567', 'City of Example', 'active'
),
(
    'Jane', 'Doe', 'jane.doe@state.gov', '(555) 987-6543', 'State DOT', 'active'
);
