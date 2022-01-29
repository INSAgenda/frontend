let submit = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");

submit.onclick = async function() {
    let email = document.getElementById("email-input").value;
    let password1 = document.getElementById("password-input1").value;
    let password2 = document.getElementById("password-input2").value;

    if (password1 != password2) {
        error_element.innerHTML = "Passwords don't match";
        error_element.style.display = "block";
        return false;
    }
    // TODO: check length
    if (password1.length <= 5) {
        error_element.innerHTML = "Passwords must be longer than 5 characters";
        error_element.style.display = "block";
        return false;
    }

    let response = await fetch('/api/auth/register', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password1),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (response.status == 200) {
        let json = await response.json();
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        error_element.innerHTML = json.message_fr; // TODO: display english messages
        error_element.style.display = "block";
    } else {
        alert("Unknown error");
    }
};