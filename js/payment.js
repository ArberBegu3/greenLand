const cardNameRegex = /^[A-Za-z\s]+$/;  // Emri i kartes mund te permbaje vetem shkronja dhe hapesira
const cardNumberRegex = /^\d{4} \d{4} \d{4} \d{4}$/;  // 16 shifra me hapesira pas çdo 4 shifrash
const expirationDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;  // Formati MM/YY, muaji mes 01-12
const cvvRegex = /^\d{3}$/;  // Saktesisht 3 shifra per CVV

// Funksioni per te validuar formularin
function validateForm() {
    const cardName = document.querySelector("#card-name").value;
    const cardNumber = document.querySelector("#card-number").value;
    const expirationDate = document.querySelector("#expiration-date").value;
    const cvv = document.querySelector("#cvv").value;

    let isValid = true;

    // Validimi i Emrit te Kartes
    if (!cardNameRegex.test(cardName)) {
        document.querySelector("#card-name").classList.add("error");
        document.querySelector("#name-error").style.display = "block";  // Trego mesazhin e gabimit
        document.querySelector("label[for='card-name'] .label-text").style.color = "red";
        isValid = false;
    } else {
        document.querySelector("#card-name").classList.remove("error");
        document.querySelector("#name-error").style.display = "none";  // Fshij mesazhin e gabimit
        document.querySelector("label[for='card-name'] .label-text").style.color = "";
    }

    // Validimi i Numrit te Kartes
    if (!cardNumberRegex.test(cardNumber)) {
        document.querySelector("#card-number").classList.add("error");
        document.querySelector("#card-number-error").style.display = "block";  // Trego mesazhin e gabimit
        document.querySelector("label[for='card-number'] .label-text").style.color = "red";
        isValid = false;
    } else {
        document.querySelector("#card-number").classList.remove("error");
        document.querySelector("#card-number-error").style.display = "none";  // Fshij mesazhin e gabimit
        document.querySelector("label[for='card-number'] .label-text").style.color = "";
    }

    // Validimi i Dates se Skadences
    if (!expirationDateRegex.test(expirationDate)) {
        document.querySelector("#expiration-date").classList.add("error");
        document.querySelector("#expiration-date-error").style.display = "block";  // Trego mesazhin e gabimit
        document.querySelector("label[for='expiration-date'] .label-text").style.color = "red";
        isValid = false;
    } else {
        document.querySelector("#expiration-date").classList.remove("error");
        document.querySelector("#expiration-date-error").style.display = "none";  // Fshij mesazhin e gabimit
        document.querySelector("label[for='expiration-date'] .label-text").style.color = "";
    }

    // Validimi i CVV-s
    if (!cvvRegex.test(cvv)) {
        document.querySelector("#cvv").classList.add("error");
        document.querySelector("#cvv-error").style.display = "block"; 
        document.querySelector("label[for='cvv'] .label-text").style.color = "red"; 
        isValid = false;
    } else {
        document.querySelector("#cvv").classList.remove("error");
        document.querySelector("#cvv-error").style.display = "none";  // Fshij mesazhin e gabimit
        document.querySelector("label[for='cvv'] .label-text").style.color = "";
    }

    return isValid;
}

// Shtimi i ngjarjes per butonin "Paguaj"
document.querySelector(".pay-button").addEventListener("click", function (event) {
    event.preventDefault();  // Parandalon dergimin e formularit per te bere validimin

    if (validateForm()) {
        // Nese te gjitha fushat jane valide, pastroje localStorage dhe trego modalin e suksesit
        localStorage.clear();
        document.querySelector("#success-modal").style.display = "block";  // Trego modalin e suksesit
    }
});

// Fshij modalin e suksesit kur te klikoni mbi te
document.querySelector("#success-modal").addEventListener("click", function () {
    document.querySelector("#success-modal").style.display = "none";  // Fshij modalin kur te klikohet
});

// Formato automatikisht Numrin e Kartës (pas çdo 4 shifrash)
const cardNumberInput = document.getElementById("card-number");
cardNumberInput.addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Hiq çdo karakter qe nuk eshte numerik

    // Limit the input to 16 digits
    if (input.length > 16) {
        input = input.slice(0, 16); // Keep only the first 16 digits
    }

    // Formato kartën (krijo hapesira çdo 4 shifra)
    let formattedCardNumber = input.match(/.{1,4}/g)?.join(" ") || input;
    
    e.target.value = formattedCardNumber; // Perdor vleren e re ne fushen e inputit
});

// Formato automatikisht Daten e Skadences (MM/YY)
const expirationDateInput = document.getElementById("expiration-date");
expirationDateInput.addEventListener("input", function (e) {
    let input = e.target.value.replace(/\D/g, ''); // Hiq çdo karakter qe nuk eshte numerik
    if (input.length >= 2) {
        // Shto shenjen '/' pas dy shifrave te para (muaji)
        input = input.slice(0, 2) + '/' + input.slice(2, 4);
    }
    e.target.value = input; // Perdor vleren e re ne fushen e inputit

    // Expiration month check (MM should be between 01 and 12)
    if (input.length >= 2) {
        let month = parseInt(input.slice(0, 2));
        if (month > 12) {
            e.target.value = '12/' + input.slice(3, 5); // If month > 12, set to 12
        }
    }

    // Expiration year check (YY should be not less than current year)
    if (input.length === 5) {
        const currentYear = new Date().getFullYear();
        const currentYearLastTwoDigits = currentYear % 100; // Get the last two digits of the current year
        let enteredYear = parseInt(input.slice(3, 5));

        if (enteredYear < currentYearLastTwoDigits) {
            e.target.value = input.slice(0, 2) + '/' + currentYearLastTwoDigits.toString().padStart(2, '0');
        }
    }
});
