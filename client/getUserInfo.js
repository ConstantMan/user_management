const cardFullname = document.getElementById("FullnameCard");
const firstnameInput = document.getElementById("FirstnameInput");
const surnameInput = document.getElementById("SurnameInput");
const usernameInput = document.getElementById("UsernameInput");
const emailInput = document.getElementById("EmailInput");
const phoneInput = document.getElementById("PhoneInput");
const addressInput = document.getElementById("AddressInput");
const genderInput = document.getElementById("GenderInput");

const url = "/users/user";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    cardFullname.textContent = `${data.firstname} ${data.surname}`;
    firstnameInput.value = data.firstname;
    surnameInput.value = data.surname;
    usernameInput.value = data.username;
    emailInput.value = data.email;
    phoneInput.value = data.phone;
    addressInput.value = data.address;
    genderInput.value = data.gender;
  })
  .catch((error) => {
    console.error("Error:", error);
  });
