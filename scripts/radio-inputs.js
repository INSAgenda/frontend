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
