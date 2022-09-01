let k = new URLSearchParams(window.location.search).get("k");
window.history.replaceState({}, document.title, "/fast-login");
let message = document.getElementById("message");
let title = document.getElementById("title");

(async () => {
    try {
        let response = await fetch('/api/auth/fast-login', {
            method: 'POST',
            body: "k=" + encodeURIComponent(k),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        
        if (response.status == 200) {
            let json = await response.json();
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
            message.innerText = json.message_fr;
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
        message.innerText = "Une erreur inconnue s'est produite. Notre équipe a été avertie, et nous travaillons à corriger le problème. Merci de réessayer plus tard.";
    }
})();
