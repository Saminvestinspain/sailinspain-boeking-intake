// ============================================================
// GOOGLE APPS SCRIPT — Plak dit in Google Apps Script Editor
// ============================================================
// SETUP:
// 1. Ga naar Google Sheets → maak een nieuw spreadsheet
// 2. Noem het "Sail in Spain — Boekingen"
// 3. Ga naar Extensions → Apps Script
// 4. Plak deze hele code daar
// 5. Vervang EMAIL hieronder door je eigen e-mailadres
// 6. Klik Deploy → New deployment → Web app
//    - Execute as: Me
//    - Who has access: Anyone
// 7. Kopieer de URL en plak die in index.html (SCRIPT_URL)
// ============================================================

const EMAIL = 'backoffice@investinspain.be';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName('Boekingen');

    // Maak headers aan als het sheet leeg is
    if (!sheet) {
      sheet = ss.insertSheet('Boekingen');
      sheet.appendRow([
        'Timestamp', 'Naam', 'ID/Paspoort', 'Adres', 'Leeftijden',
        'Trip type', 'Vertrekhaven', 'Gasten', 'Startdatum', 'Einddatum',
        'Starttijd', 'Eindtijd', 'Basisprijs', 'Crew cost', 'Fuel', 'Totaal',
        'Catering', 'Gerechten', 'Dranken', 'Wijn detail',
        'Cava/Champagne', 'Speciale wensen', 'Opmerkingen'
      ]);
    }

    // Voeg rij toe
    sheet.appendRow([
      new Date().toLocaleString('nl-BE'),
      data.name || '',
      data.idnr || '',
      data.address || '',
      data.ages || '',
      data.tripType || '',
      data.port || '',
      data.guests || '',
      data.dateFrom || '',
      data.dateTo || '',
      data.timeStart || '',
      data.timeEnd || '',
      data.base || '',
      data.crew || '',
      data.fuel || '',
      data.total || '',
      data.catering || '',
      data.foods || '',
      data.drinks || '',
      data.wine || '',
      data.bubbly || '',
      data.special || '',
      data.notes || ''
    ]);

    // Stuur e-mail
    const subject = '⛵ Nieuwe boeking: ' + (data.name || 'Onbekend') + ' — ' + (data.dateFrom || 'geen datum');
    const body = formatEmail(data);
    MailApp.sendEmail(EMAIL, subject, body);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function formatEmail(d) {
  let msg = '=== SAIL IN SPAIN — NIEUWE BOEKING ===\n\n';

  msg += '--- KLANT ---\n';
  msg += 'Naam:          ' + (d.name || '-') + '\n';
  msg += 'Adres:         ' + (d.address || '-') + '\n';
  msg += 'ID/Paspoort:   ' + (d.idnr || '-') + '\n';
  msg += 'Leeftijden:    ' + (d.ages || '-') + '\n\n';

  msg += '--- CHARTER ---\n';
  msg += 'Trip type:     ' + (d.tripType || '-') + '\n';
  msg += 'Vertrekhaven:  ' + (d.port || '-') + '\n';
  msg += 'Gasten:        ' + (d.guests || '-') + '\n';
  msg += 'Datum:         ' + (d.dateFrom || '-');
  if (d.dateTo && d.dateTo !== d.dateFrom) msg += ' t/m ' + d.dateTo;
  msg += '\n';
  msg += 'Tijd:          ' + (d.timeStart || '-') + ' – ' + (d.timeEnd || '-') + '\n\n';

  msg += '--- PRIJS ---\n';
  msg += 'Basisprijs:    € ' + (d.base || '-') + '\n';
  msg += 'Crew cost:     € ' + (d.crew || '-') + '\n';
  msg += 'Fuel:          € ' + (d.fuel || '-') + '\n';
  msg += 'Totaal:        € ' + (d.total || '-') + '\n\n';

  msg += '--- CATERING & DRANKEN ---\n';
  msg += 'Catering:      ' + (d.catering || '-') + '\n';
  msg += 'Gerechten:     ' + (d.foods || '-') + '\n';
  msg += 'Dranken:       ' + (d.drinks || '-') + '\n';
  msg += 'Wijn detail:   ' + (d.wine || '-') + '\n';
  msg += 'Cava/Champ.:   ' + (d.bubbly || '-') + '\n';
  msg += 'Speciale wens: ' + (d.special || '-') + '\n\n';

  if (d.notes) {
    msg += '--- INTERNE NOTITIES ---\n';
    msg += d.notes + '\n\n';
  }

  msg += '---\nVerzonden via Sail in Spain intake formulier\n';
  return msg;
}

// Test functie — optioneel
function doGet(e) {
  return ContentService
    .createTextOutput('Sail in Spain webhook is actief!')
    .setMimeType(ContentService.MimeType.TEXT);
}
