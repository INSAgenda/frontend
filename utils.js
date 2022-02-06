function enable_activity_indicator(to_replace_selectors, state) {
    // to_replace_selectors: array of selectors to replace with the activity indicator
    // state: true to enable, false to disable
    to_replace_selectors.forEach(selector => {
        document.querySelector(selector).style.display = state ? "none" : "";
    });
    if(state) {
        document.querySelector(to_replace_selectors[0]).insertAdjacentHTML('afterend', '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>');
    } else {
        document.querySelector(".lds-ring").remove();
    }
}