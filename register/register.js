let submit_el = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");
let email = document.getElementById("email-input");
let password1 = document.getElementById("password-input1");
let password2 = document.getElementById("password-input2");

async function submit() {
    if (password1.value != password2.value) {
        error_element.innerHTML = "Passwords don't match";
        error_element.style.display = "block";
        return false;
    }

    if (password1.value.length <= 5) {
        error_element.innerHTML = "Passwords must be longer than 5 characters";
        error_element.style.display = "block";
        return false;
    }

    let response = await fetch('/api/auth/register', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value),
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

submit_el.onclick = submit;

document.onkeydown = async function(e) {
    if (e.code === "Enter") {
        if (email.value === "") {
            email.focus();
            return;
        }

        if (password1.value === "") {
            password1.focus();
            return;
        }

        if (password2.value === "") {
            password2.focus();
            return;
        }

        await submit();
    }
}
