let submit_el = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");
let email = document.getElementById("email-input");
let password1 = document.getElementById("password-input1");
let password2 = document.getElementById("password-input2");
let stage = 1;

async function submit() {
    enable_activity_indicator(["#submit-button", "#register-link", "body > section.identification-section > main > form:nth-child(4) > a"],true)

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

    let response;
    if (stage === 1) {
        response = await fetch('/api/auth/register', {
            method: 'POST',
            body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    } else {
        let section_select = document.getElementById("section-select");
        let section_value = section_select.options[section_select.selectedIndex].value;

        let class_select = document.getElementById("class-select");
        let class_value = class_select.options[class_select.selectedIndex].value;

        let lang = document.querySelector('input[name="lang"]:checked').value;
        let class_division = document.querySelector('input[name="group"]:checked').value;

        response = await fetch('/api/auth/register', {
            method: 'POST',
            body: "email=" + encodeURIComponent(email.value) + "&password=" + encodeURIComponent(password1.value) + "&section=" + encodeURIComponent(section_value) + "&class=" + encodeURIComponent(class_value) + "&lang=" + encodeURIComponent(lang) + "&class_division=" + encodeURIComponent(class_division),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    }

    if (response.status == 200) {
        let json = await response.json();
        localStorage.setItem('api_key', json.api_key);
        localStorage.setItem('counter', 1);
        window.location.replace("/agenda");
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();

        if (json.kind === "unknown_email") {
            stage = 2;
            document.querySelector("main > form:nth-child(3)").style.display = "initial";
        } else {
            error_element.innerHTML = json.message_fr; // TODO: display english messages
            error_element.style.display = "block";
        }
    } else {
        alert("Unknown error");
    }
    enable_activity_indicator(["#submit-button", "#register-link", "body > section.identification-section > main > form:nth-child(4) > a"],false)

};
submit_el.onclick = submit;

// Submit on enter
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

// Animate radio inputs
var radio = document.getElementsByClassName('language-checkbox-radio');
for (var i = 0; i < radio.length; i++) {
    radio[i].addEventListener('click', function () {
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked == false) {
                radio[i].parentElement.classList.remove('language-checkbox-active');
            }
        }
        var parent = this.parentNode;
        parent.classList.add('language-checkbox-active');
    });
}
