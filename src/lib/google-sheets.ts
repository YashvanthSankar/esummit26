import { google } from 'googleapis';

const SHEET_ID = process.env.GOOGLE_SHEET_ID || '1OLo4MY6CK5-Gbl66sjwa1BEw21tsP4R7NCXa5mhx-r4';

// Service account credentials from environment
function getAuth() {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;

    if (!credentials) {
        console.error('[Sheets] No Google service account credentials found');
        return null;
    }

    try {
        const parsedCredentials = JSON.parse(credentials);

        const auth = new google.auth.GoogleAuth({
            credentials: parsedCredentials,
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return auth;
    } catch (error) {
        console.error('[Sheets] Failed to parse credentials:', error);
        return null;
    }
}

// Get sheets client
async function getSheetsClient() {
    const auth = getAuth();
    if (!auth) return null;

    return google.sheets({ version: 'v4', auth });
}

// Append a row to a specific sheet
export async function appendToSheet(
    sheetName: string,
    values: (string | number | boolean | null)[]
): Promise<boolean> {
    try {
        const sheets = await getSheetsClient();
        if (!sheets) {
            console.log('[Sheets] Skipping sync - no credentials configured');
            return false;
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: `${sheetName}!A:Z`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [values],
            },
        });

        console.log(`[Sheets] Appended row to ${sheetName}`);
        return true;
    } catch (error) {
        console.error('[Sheets] Append error:', error);
        return false;
    }
}

// Sync a new user profile to the "Users" sheet
export async function syncUserToSheet(profile: {
    id: string;
    email: string;
    full_name: string;
    phone: string;
    college_name: string;
    roll_number?: string | null;
    role: string;
    created_at?: string;
}): Promise<boolean> {
    const values = [
        profile.id,
        profile.full_name || '',
        profile.email || '',
        profile.phone || '',
        profile.college_name || '',
        profile.roll_number || '',
        profile.role || 'external',
        profile.created_at || new Date().toISOString(),
    ];

    return appendToSheet('Users', values);
}

// Sync a ticket to the "Tickets" sheet
export async function syncTicketToSheet(ticket: {
    id: string;
    user_id?: string | null;
    pending_email?: string | null;
    pending_name?: string | null;
    type: string;
    amount: number;
    status: string;
    pax_count: number;
    booking_group_id?: string | null;
    utr?: string | null;
    created_at?: string;
}, userName?: string, userEmail?: string): Promise<boolean> {
    const values = [
        ticket.id,
        userName || ticket.pending_name || '',
        userEmail || ticket.pending_email || '',
        ticket.type,
        ticket.amount,
        ticket.status,
        ticket.pax_count,
        ticket.booking_group_id || '',
        ticket.utr || '',
        ticket.created_at || new Date().toISOString(),
    ];

    return appendToSheet('Tickets', values);
}

// Update a specific cell (used for status updates)
export async function updateSheetCell(
    sheetName: string,
    rowIndex: number,
    columnIndex: number,
    value: string | number
): Promise<boolean> {
    try {
        const sheets = await getSheetsClient();
        if (!sheets) return false;

        const columnLetter = String.fromCharCode(65 + columnIndex); // 0 = A, 1 = B, etc.
        const range = `${sheetName}!${columnLetter}${rowIndex + 1}`;

        await sheets.spreadsheets.values.update({
            spreadsheetId: SHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[value]],
            },
        });

        console.log(`[Sheets] Updated ${range} to ${value}`);
        return true;
    } catch (error) {
        console.error('[Sheets] Update error:', error);
        return false;
    }
}

// Find row by ID in a sheet
export async function findRowById(
    sheetName: string,
    id: string
): Promise<number | null> {
    try {
        const sheets = await getSheetsClient();
        if (!sheets) return null;

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: `${sheetName}!A:A`,
        });

        const rows = response.data.values;
        if (!rows) return null;

        for (let i = 0; i < rows.length; i++) {
            if (rows[i][0] === id) {
                return i;
            }
        }

        return null;
    } catch (error) {
        console.error('[Sheets] Find error:', error);
        return null;
    }
}
