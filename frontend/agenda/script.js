let Cases = document.getElementsByClassName('calendar-case')

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();

const monthName = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const UP_MONTH = 'upMonth';
const DOWN_MONTH = 'downMonth';

function CALENDRIER_REDUCER(action){
    switch (action) {
        case UP_MONTH:
            if (month < 12) month++
            else {
                year++
                month = 1
            }
            break;

        case DOWN_MONTH:
            if (month > 0) month--
            else{
                year--
                month = 12
            }
            break;
        
        default:
            break;
    }
    calendrier(year, month)
}

document.getElementById('calendar-before').onclick = function(){
    CALENDRIER_REDUCER(DOWN_MONTH)
    console.log(month)
}

document.getElementById('calendar-after').onclick = function(){
    CALENDRIER_REDUCER(UP_MONTH)
    console.log(month)
}

function calendrier(year, month) {
    const monthNb = month + 12 * (year - 2020)

    let cld = [{dayStart : 2, length: 31, year: 2020, month: "Janvier"}]

    for (let i = 0; i < monthNb - 1; i++) {
        let yearSimule = 2020 + Math.floor(i / 12)
        const monthsSimuleLongueur = [31, getFebruaryLength(yearSimule), 31, 30, 31, 30, 31,31, 30, 31, 30, 31]
        let monthSimuleIndex = (i + 1) - (yearSimule - 2020) * 12

        cld[i + 1] = {
            dayStart: (cld[i].dayStart + monthsSimuleLongueur[monthSimuleIndex - 1]) % 7,
            length: monthsSimuleLongueur[monthSimuleIndex],
            year: 2020 + Math.floor((i + 1) / 12),
            month: monthName[monthSimuleIndex]
        }

        if (cld[i + 1].month === undefined) {
            cld[i + 1].month = "janvier"
            cld[i + 1].length = 31
        }
    }

    for (let i = 0; i < Cases.length; i++) {
        Cases[i].innerText = ""
    }
    for (let i = 0; i < cld[cld.length - 1].length; i++) {
        Cases[i + cld[cld.length - 1].dayStart].innerText = i + 1
    }

    document.getElementById('calendar-title').innerText = cld[cld.length - 1].month + " " + cld[cld.length - 1].year
}
calendrier(year, month)

function getFebruaryLength(year) {
    if (year % 4 === 0) return 29
    else return 28
}