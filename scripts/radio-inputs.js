// Animate radio inputs
var radios = document.getElementsByClassName('language-checkbox-radio');
for (const radio of radios) {
    radio.addEventListener('click', function () {
        for (const radio of radios) {
            if (radio.checked == false) {
                radio.parentElement.classList.remove('language-checkbox-active');
            }
        }
        var parent = this.parentNode;
        parent.classList.add('language-checkbox-active');
    });
}
