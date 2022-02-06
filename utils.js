function enable_activity_indicator(to_replace_selectors, on) {
    to_replace_selectors.forEach(select => {
        let el = document.querySelector(select);
       el.style.display = on ? "none" : "";
    });
    if(on) {
        document.querySelector(to_replace_selectors[0]).insertAdjacentHTML('afterend', '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
    } else {
        document.querySelector(".lds-ring").remove();
    }
}