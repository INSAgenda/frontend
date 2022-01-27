//JS File
//If radio button is checked, add background red to tgis parent label

var radio = document.getElementsByClassName('language-checkbox-radio');

//Detect when radio button is checked
for (var i = 0; i < radio.length; i++) {
    radio[i].addEventListener('click', function () {
        //Remove all parent backgrounds when their child is unchecked
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked == false) {
                radio[i].parentElement.classList.remove('language-checkbox-active');
            }
        }
        var parent = this.parentNode;
        parent.classList.add('language-checkbox-active');
    });
}

