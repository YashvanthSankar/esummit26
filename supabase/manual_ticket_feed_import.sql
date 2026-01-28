-- ============================================
-- Manual Ticket Import from CSV Feed
-- E-Summit '26 - IIITDM Kancheepuram
-- Generated: January 28, 2026
-- ============================================
-- 
-- This script inserts pending tickets for roll numbers.
-- When users login with their IIITDM email (@iiitdm.ac.in),
-- the claim_pending_tickets() trigger will auto-link their QR.
--
-- IMPORTANT: Run this in Supabase SQL Editor
-- ============================================

-- Helper function to generate QR secret
CREATE OR REPLACE FUNCTION generate_ticket_qr_secret()
RETURNS TEXT AS $$
BEGIN
    RETURN 'ES26-' || encode(gen_random_bytes(12), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create a booking group for CSV imports
INSERT INTO booking_groups (id, purchaser_id, ticket_type, total_amount, pax_count)
SELECT 
    'a0000000-0000-0000-0000-000000000001'::uuid,
    id,
    'csv_import',
    0,
    1
FROM profiles 
WHERE role = 'admin' 
LIMIT 1
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT TICKETS FOR ALL ROLL NUMBERS
-- Status: paid (they already paid offline)
-- ============================================

-- Batch 1: Individual roll numbers from CSV
INSERT INTO tickets (pending_email, pending_name, pending_phone, type, amount, status, qr_secret, pax_count, booking_group_id)
VALUES
-- 13/01/2026 entries
('me24b1048@iiitdm.ac.in', 'Girish', '9121066909', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1007@iiitdm.ac.in', 'CS25B1007', '9376234999', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1043@iiitdm.ac.in', 'CS25B1043', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec23b1083@iiitdm.ac.in', 'Akash', '9140813627', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec23b1045@iiitdm.ac.in', 'EC23B1045', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec23b1082@iiitdm.ac.in', 'EC23B1082', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23i1055@iiitdm.ac.in', 'CS23I1055', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 14/01/2026 entries
('me25i1040@iiitdm.ac.in', 'Nishanth Mishra', '9108816758', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2018@iiitdm.ac.in', 'CS25B2018', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1036@iiitdm.ac.in', 'ME25I1036', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1016@iiitdm.ac.in', 'ME25B1016', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1037@iiitdm.ac.in', 'CS25B1037', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2022@iiitdm.ac.in', 'CS25B2022', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1017@iiitdm.ac.in', 'ME25I1017', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2052@iiitdm.ac.in', 'CS25B2052', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2053@iiitdm.ac.in', 'CS25B2053', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25i1069@iiitdm.ac.in', 'CS25I1069', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23b1091@iiitdm.ac.in', 'Shashankh', '8197608619', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23i1021@iiitdm.ac.in', 'CS23I1021', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23i1036@iiitdm.ac.in', 'CS23I1036', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23i1042@iiitdm.ac.in', 'CS23I1042', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23i1060@iiitdm.ac.in', 'CS23I1060', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2025@iiitdm.ac.in', 'Mayank', '9106840517', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1004@iiitdm.ac.in', 'ME25I1004', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2010@iiitdm.ac.in', 'ME25B2010', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1009@iiitdm.ac.in', 'ME25B1009', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2054@iiitdm.ac.in', 'CS25B2054', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1010@iiitdm.ac.in', 'ME25B1010', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1122@iiitdm.ac.in', 'EC25B1122', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2026@iiitdm.ac.in', 'ME25B2026', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ph25b1009@iiitdm.ac.in', 'PH25B1009', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2016@iiitdm.ac.in', 'EC25I2016', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2034@iiitdm.ac.in', 'CS25B2034', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1121@iiitdm.ac.in', 'EC25B1121', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1013@iiitdm.ac.in', 'Yasheshai', '6300725112', 'solo', 199, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1001@iiitdm.ac.in', 'Keerthana', '7330717913', 'solo', 199, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2004@iiitdm.ac.in', 'Nikhil', '8985776333', 'solo', 199, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 15/01/2026 entries
('cs24b1022@iiitdm.ac.in', 'Pruthvi', '8341119219', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1071@iiitdm.ac.in', 'Jay', '8109886775', 'solo', 199, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2047@iiitdm.ac.in', 'Snehith', '6281318297', 'solo', 149, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b2013@iiitdm.ac.in', 'Tarun', '9791506107', 'solo', 149, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1001@iiitdm.ac.in', 'Aditya', '9786527857', 'solo', 149, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1080@iiitdm.ac.in', 'Juhitha', '7095345110', 'solo', 149, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25m2009@iiitdm.ac.in', 'Ajay', '9715572697', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25m2006@iiitdm.ac.in', 'EC25M2006', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1078@iiitdm.ac.in', 'Vishnupriya', '8688595561', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1073@iiitdm.ac.in', 'CS25B1073', '7901304455', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1050@iiitdm.ac.in', 'CS25B1050', '9346620703', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1067@iiitdm.ac.in', 'Krishna', '8977360782', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1064@iiitdm.ac.in', 'EC24B1064', '8639236149', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1012@iiitdm.ac.in', 'EC24B1012', '9573218259', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1106@iiitdm.ac.in', 'EC24B1106', '8019172791', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1119@iiitdm.ac.in', 'EC24B1119', '8252827110', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b1033@iiitdm.ac.in', 'CS24B1033', '9347598855', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1073@iiitdm.ac.in', 'EC24B1073', '9493124579', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec23b1025@iiitdm.ac.in', 'EC23B1025', '8106843027', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1090@iiitdm.ac.in', 'EC25B1090', '9521211410', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1015@iiitdm.ac.in', 'EC25I1015', '7415371948', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1013@iiitdm.ac.in', 'EC25I1013', '7014862568', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1119@iiitdm.ac.in', 'EC25B1119', '9492438797', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec23b1002@iiitdm.ac.in', 'EC23B1002', '9391637484', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('id25b1018@iiitdm.ac.in', 'ID25B1018', '9834108388', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ph25b1008@iiitdm.ac.in', 'PH25B1008', '7249370516', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 16/01/2026 entries
('cs24i1004@iiitdm.ac.in', 'Varun', '8050588903', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1012@iiitdm.ac.in', 'CS24I1012', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1030@iiitdm.ac.in', 'CS24I1030', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1038@iiitdm.ac.in', 'CS24I1038', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1044@iiitdm.ac.in', 'CS24I1044', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1016@iiitdm.ac.in', 'CS24I1016', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2003@iiitdm.ac.in', 'Ameer Anees', '8374408255', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2022@iiitdm.ac.in', 'Shraddha', '8807532431', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2044@iiitdm.ac.in', 'Dhanush S', '8919006742', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 17/01/2026 entries
('me24b1006@iiitdm.ac.in', 'Keerthan', '7904019586', 'solo', 176, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1039@iiitdm.ac.in', 'ME24B1039', NULL, 'solo', 176, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1027@iiitdm.ac.in', 'ME24B1027', NULL, 'solo', 176, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b2007@iiitdm.ac.in', 'ME24B2007', NULL, 'solo', 176, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b2031@iiitdm.ac.in', 'ME24B2031', NULL, 'solo', 176, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1058@iiitdm.ac.in', 'Siddantha', '9176604270', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 18/01/2026 entries
('ec25b1108@iiitdm.ac.in', 'Ganga', '9870146796', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 19/01/2026 entries
('me24b2029@iiitdm.ac.in', 'Haridharan', '8072396722', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25i1045@iiitdm.ac.in', 'Abhay', '8870413960', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1026@iiitdm.ac.in', 'ME25I1026', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1030@iiitdm.ac.in', 'ME25I1030', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25i1067@iiitdm.ac.in', 'CS25I1067', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1031@iiitdm.ac.in', 'Darshita', '7075764826', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b2017@iiitdm.ac.in', 'Love', '9711192106', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1045@iiitdm.ac.in', 'Shreyas Vissvajit', '7339659549', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 20/01/2026 entries
('me24b1008@iiitdm.ac.in', 'Abishek', '8838027964', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1012@iiitdm.ac.in', 'Shri Rishabh', '8925644448', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b2023@iiitdm.ac.in', 'ME24B2023', '7812877734', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b2049@iiitdm.ac.in', 'ME24B2049', '7010610149', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1072@iiitdm.ac.in', 'ME24B1072', '9345302608', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1069@iiitdm.ac.in', 'ME24B1069', '9345772134', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1010@iiitdm.ac.in', 'ME24B1010', '8887624980', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b1109@iiitdm.ac.in', 'CS24B1109', '6382508209', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1132@iiitdm.ac.in', 'EC24B1132', '9342273585', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24i1026@iiitdm.ac.in', 'ME24I1026', '7893208752', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ph25b1015@iiitdm.ac.in', 'Saksham', '9506163020', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 21/01/2026 entries
('ec25b1129@iiitdm.ac.in', 'Dhananjay', '8484980242', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('id25b1008@iiitdm.ac.in', 'Aniruth Aadityaa', '9629867264', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me23b1031@iiitdm.ac.in', 'Harish Prasanna', '8056228477', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1015@iiitdm.ac.in', 'Tanuj', '8295947004', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1096@iiitdm.ac.in', 'Yugaan', '9789942749', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1073@iiitdm.ac.in', 'ME25B1073', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1076@iiitdm.ac.in', 'ME25B1076', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1006@iiitdm.ac.in', 'ME25B1006', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b1029@iiitdm.ac.in', 'Jitenshu', '9837225324', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1049@iiitdm.ac.in', 'CS24I1049', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1028@iiitdm.ac.in', 'CS24I1028', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b1062@iiitdm.ac.in', 'CS24B1062', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23b1058@iiitdm.ac.in', 'CS23B1058', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b2010@iiitdm.ac.in', 'CS24B2010', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b1015@iiitdm.ac.in', 'CS24B1015', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24i2007@iiitdm.ac.in', 'EC24I2007', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b1009@iiitdm.ac.in', 'ME24B1009', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23b1040@iiitdm.ac.in', 'CS23B1040', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b1043@iiitdm.ac.in', 'CS24B1043', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('id25b1005@iiitdm.ac.in', 'Mathav', '9363784797', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1038@iiitdm.ac.in', 'ME25B1038', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2029@iiitdm.ac.in', 'ME25B2029', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1042@iiitdm.ac.in', 'ME25B1042', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1024@iiitdm.ac.in', 'Arvindh', '6369986819', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec24b1003@iiitdm.ac.in', 'EC24B1003', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ph25b1012@iiitdm.ac.in', 'PH25B1012', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2018@iiitdm.ac.in', 'ME25B2018', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1104@iiitdm.ac.in', 'EC25B1104', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2038@iiitdm.ac.in', 'ME25B2038', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2044@iiitdm.ac.in', 'ME25B2044', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2002@iiitdm.ac.in', 'ME25B2002', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1003@iiitdm.ac.in', 'EC25I1003', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2014@iiitdm.ac.in', 'EC25I2014', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1075@iiitdm.ac.in', 'Jerin', '7418155711', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1074@iiitdm.ac.in', 'ME25B1074', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1081@iiitdm.ac.in', 'ME25B1081', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2054@iiitdm.ac.in', 'ME25B2054', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1049@iiitdm.ac.in', 'ME25B1049', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1024@iiitdm.ac.in', 'ME25B1024', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1079@iiitdm.ac.in', 'ME25B1079', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2050@iiitdm.ac.in', 'ME25B2050', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 22/01/2026 entries
('ec25b1113@iiitdm.ac.in', 'Saranya', '8838647477', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24b2052@iiitdm.ac.in', 'Manoj', '8309808395', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1024@iiitdm.ac.in', 'Achchuthan', '9940043872', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 24/01/2026 entries
('me25i1034@iiitdm.ac.in', 'Jayaprakash P', NULL, 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1032@iiitdm.ac.in', 'Sanjai Kumar V', '9345513772', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2021@iiitdm.ac.in', 'Mishal Mouriya', '8072585089', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1093@iiitdm.ac.in', 'George Scaria', '8075331351', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1040@iiitdm.ac.in', 'D Pritika', '8008222828', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs24i1013@iiitdm.ac.in', 'Santhosini', '7989057515', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1036@iiitdm.ac.in', 'Bhanu Prakash', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25b1035@iiitdm.ac.in', 'Sam Thomas', NULL, 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25i1057@iiitdm.ac.in', 'Dinesh', NULL, 'solo', 190, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 26/01/2026 entries
('ec25b1069@iiitdm.ac.in', 'Chaitanya', '9848204596', 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1066@iiitdm.ac.in', 'Chaitan', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1052@iiitdm.ac.in', 'Rithish', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1015@iiitdm.ac.in', 'Dhruv', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1011@iiitdm.ac.in', 'Pankaj', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me24b2015@iiitdm.ac.in', 'Vishnu', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2012@iiitdm.ac.in', 'Vaahul', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1010@iiitdm.ac.in', 'Jayahemanth', NULL, 'solo', 170, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1055@iiitdm.ac.in', 'Sri Ram', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1085@iiitdm.ac.in', 'Kannayya', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1065@iiitdm.ac.in', 'Satwik', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1107@iiitdm.ac.in', 'Rohit', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1078@iiitdm.ac.in', 'Dharni Dhar', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2017@iiitdm.ac.in', 'Ajay Dev', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1077@iiitdm.ac.in', 'Sham', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1016@iiitdm.ac.in', 'Aaditya Singh', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs25i1005@iiitdm.ac.in', 'Gaurav P', '8332809140', 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),

-- 27/01/2026 entries
('ec25b1036@iiitdm.ac.in', 'Suriya Vardhan', '7032982400', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1005@iiitdm.ac.in', 'Deepak Krishna', '9847538718', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i2002@iiitdm.ac.in', 'Navaneeth Palla', '9490021115', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('cs23b2020@iiitdm.ac.in', 'Sakthi', '7305929539', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b1084@iiitdm.ac.in', 'Tarun', '7305010770', 'solo', 200, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1029@iiitdm.ac.in', 'Umath Raja', '7093370668', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25i1006@iiitdm.ac.in', 'Nikilesh', '9543729958', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1037@iiitdm.ac.in', 'Sahana', '6383714026', 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1027@iiitdm.ac.in', 'EC25B1027', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1070@iiitdm.ac.in', 'EC25B1070', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25b1062@iiitdm.ac.in', 'EC25B1062', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ec25i1006@iiitdm.ac.in', 'EC25I1006', NULL, 'solo', 150, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('id25b1017@iiitdm.ac.in', 'Reethwick', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('me25b2053@iiitdm.ac.in', 'Akhil', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ph25b1003@iiitdm.ac.in', 'Suhaas', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('ph25b1014@iiitdm.ac.in', 'Pranav', NULL, 'solo', 180, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid),
('id25b1007@iiitdm.ac.in', 'Harsh', NULL, 'solo', 190, 'paid', generate_ticket_qr_secret(), 1, 'a0000000-0000-0000-0000-000000000001'::uuid)

ON CONFLICT DO NOTHING;

-- ============================================
-- SUMMARY
-- ============================================
-- This script inserts ~180+ ticket entries
-- All marked as status='paid' 
-- 
-- HOW IT WORKS:
-- 1. Tickets are created with pending_email = rollnumber@iiitdm.ac.in
-- 2. When user logs in with Google (their IIITDM email)
-- 3. The claim_pending_tickets() trigger auto-links their ticket
-- 4. User sees their QR immediately in /dashboard/pass
--
-- VERIFY: After running, check tickets table
SELECT COUNT(*) as total_tickets FROM tickets WHERE status = 'paid';
SELECT COUNT(*) as pending_tickets FROM tickets WHERE pending_email IS NOT NULL AND user_id IS NULL;
