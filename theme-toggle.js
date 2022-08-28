const storageKey = 'setting-theme'
const authoThemeKey = 'auto-theme'


const getSystemPreference = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
}

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey)
  else
    return getSystemPreference()
}

const reflectPreference = () => {
  if ((localStorage.getItem(authoThemeKey)) && (localStorage.getItem(authoThemeKey) === 'true')){
    let theme = getSystemPreference()
    document.firstElementChild.setAttribute('data-theme', getSystemPreference());
  }else{
    let colorPreference = getColorPreference()
    document.firstElementChild.setAttribute('data-theme', getColorPreference())
  }
}

reflectPreference()

window.onload = () => {
  reflectPreference()
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', ({matches:isDark}) => {   
    // TODO: same call in webapp when selecting auto-theme
    reflectPreference()
  })