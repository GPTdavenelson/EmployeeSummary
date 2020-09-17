function generatePhoneNumber() {
    const newNumber = Math.floor(1000000000 + Math.random() * 900000);
    console.log(newNumber);
    return newNumber;
}

module.exports = {
    generatePhoneNumber,
};
