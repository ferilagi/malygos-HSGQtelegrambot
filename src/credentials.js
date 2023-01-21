const fs = require('fs');

const authFile = './src/authuserlist.json';
if (!fs.existsSync(authFile)) {
    fs.writeFileSync(authFile, '[]', 'utf-8');
}

const loadAuth = () => {
    const fileBuffer = fs.readFileSync(authFile);
    const contacts = JSON.parse(fileBuffer);
    return contacts;
}

const saveAuth = (nama, telegramId) => {
    const contact = { nama, telegramId};
    // const fileBuffer = fs.readFileSync(authFile);
    // const contacts = JSON.parse(fileBuffer);
    
    const contacts = loadAuth();
    // cek duplikat
    const duplikat = contacts.find((contact) => contact.telegramId === telegramId);
    if (!duplikat) {
        contacts.push(contact);
        fs.writeFileSync(authFile, JSON.stringify(contacts));
    }

}

const findAuth = (telegramId) => {
    const contacts = loadAuth();
    // cek terdaftar / belum
    const finding = contacts.find((contact) => contact.telegramId === telegramId);
    if (finding) {
        return true
    } else {
        return false
    }
}

module.exports = {saveAuth, findAuth}
