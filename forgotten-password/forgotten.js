let submit_el = document.getElementById("submit-button");
let error_element = document.getElementById("error-message");
let email = document.getElementById("email-input");
let confirm_el = document.getElementById("confirm-message");
async function submit() {
    let selector_list = [".submit-buttons", ".error-message-text"];

    confirm_el.hidden = true;
    if (email.value.length < 1) {
        error_element.innerHTML = "Please enter an email address";
        error_element.style.display = "block";
        return false;
    }else{
        error_element.style.display = "none";
    }

    enable_activity_indicator(selector_list, true);
    let response = await fetch('/api/auth/send-password-reset-email', {
        method: 'POST',
        body: "email=" + encodeURIComponent(email.value),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    if (response.status == 200) {
        confirm_el.hidden = false;
    } else if (response.status == 400 || response.status == 500) {
        let json = await response.json();
        error_element.innerHTML = json.message_fr; // TODO: display english messages
        error_element.style.display = "block";
    } else {
        alert("Unknown error");
    }
    enable_activity_indicator(selector_list, false);
};

submit_el.onclick = submit;

document.onkeydown = async function(e) {
    if (e.code === "Enter") {
        if (email.value === "") {
            email.focus();
            return;
        }
        await submit();
    }
}
