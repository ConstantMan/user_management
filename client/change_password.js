document
    .getElementById("changePasswordButton")
    .addEventListener("click", () => {
        execute();
    });

document.addEventListener("keypress", (event) => {
    if (event.key === "Enter") execute();
});

function execute() {
    const username = document.getElementById("username").value;
    const currentPassword = document.getElementById("current_password").value;
    const newPassword = document.getElementById("new_password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    const responseLabel = document.getElementById("Response");
    const messageBox = document.getElementById("message");

    const url = "/users/change_password";

    const data = {
        username: username,
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            if (!data.success) {
                const message = data.message;
                messageBox.style.display = "block";
                responseLabel.style.color = "#aa0436";
                responseLabel.innerHTML =
                    '<i class="fa-solid fa-triangle-exclamation"></i>  ' + message;
            } else {
                location.replace("/user_page");
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
