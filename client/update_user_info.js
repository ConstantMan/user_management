const cardFullname = document.getElementById("FullnameCard");
const firstnameInput = document.getElementById("FirstnameInput");
const surnameInput = document.getElementById("SurnameInput");
const usernameInput = document.getElementById("UsernameInput");
const emailInput = document.getElementById("EmailInput");
const phoneInput = document.getElementById("PhoneInput");
const addressInput = document.getElementById("AddressInput");
const genderInput = document.getElementById("GenderInput");

document.addEventListener("DOMContentLoaded", (event) => {
  loadUserInfo();

  document.getElementById("editButton").addEventListener("click", function () {
    const isReadOnly = document
      .getElementById("FirstnameInput")
      .hasAttribute("readonly");
    if (isReadOnly) {
      enableEdit();
      this.textContent = "Save";
    } else {
      saveChanges();
      this.textContent = "Edit";
    }
  });
});

function enableEdit() {
  document.querySelectorAll("input").forEach((input) => {
    input.removeAttribute("readonly");
  });
}

function saveChanges() {
  const userInfo = {
    firstname: firstnameInput.value,
    surname: surnameInput.value,
    username: usernameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    gender: genderInput.value,
  };

  fetch("/update_user_info", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("User information updated successfully.");
        disableEdit();
      } else {
        alert("An error occurred while updating user information.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function disableEdit() {
  document.querySelectorAll("input").forEach((input) => {
    input.setAttribute("readonly", true);
  });
}

function loadUserInfo() {
  fetch("/users/user")
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
}
