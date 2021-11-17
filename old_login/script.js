const allInputs = document.querySelectorAll(".language-checkbox");
allInputs.forEach(input => {
    input.addEventListener("click", e => {
        if (e.target.checked) {
            e.target.parentElement.style.background = "var(--dark_grey)";
            e.target.parentElement.style.color = "var(--white)";
        } else {
            e.target.parentElement.style.background = "var(--white)";
            e.target.parentElement.style.color = "#44444499";
        }
    })
})