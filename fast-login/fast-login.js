let k = new URLSearchParams(window.location.search).get("k");
let p = window.location.pathname;
let api_p = p === "/invitation" ? "/api/auth/invitation" : "/api/auth/fast-login";
window.history.replaceState({}, document.title, p);
let message = document.getElementById("message");
let title = document.getElementById("title");
let login_button = document.getElementsByClassName("primary-button")[0];

(async () => {
    try {
        let response = await fetch(api_p, {
            method: 'POST',
            body: "k=" + encodeURIComponent(k),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        
        if (response.status == 200) {
            let json = await response.json();
            let theme = localStorage.getItem("setting-theme");
            let auto_theme = localStorage.getItem("auto-theme");
            localStorage.clear();
            localStorage.setItem("setting-theme", theme);
            localStorage.setItem("auto-theme", auto_theme);
            
            localStorage.setItem('api_key', json.api_key);
            localStorage.setItem('counter', 1);
            title.innerText = "Connecté!";
            title.style.color = "green";
            message.innerText = "Nous vous redirigeons.";
            window.location.replace("/agenda");
        } else if (response.status == 400 || response.status == 500) {
            let json = await response.json();
            title.innerText = "Échec";
            title.style.color = "red";
            if (typeof json.messages !== 'undefined') {
                message.innerText = json.messages["fr"];
            } else {
                message.innerText = json.message_fr;
            }
            login_button.style.display = "block";
        } else {
            throw new Error(await response.text());
        }
    } catch(e) {
        title.innerText = "Échec";
        title.style.color = "red";
        message.innerText = "Une erreur inconnue s'est produite.";
        while (typeof Sentry === 'undefined') {
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        Sentry.captureException(e);
        message.innerText = "Une erreur inconnue s'est produite. Notre équipe a été avertie et nous travaillons à la résolution du problème.";    
    }
})();
