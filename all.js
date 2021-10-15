// var searchResults = document.querySelector('div.search-results');
// var searchForm = document.querySelector('.search-form');
// var searchBar = document.querySelector('.search-bar');
// var detailsPane = document.querySelector('.details');
var mainContainer = document.querySelector('.text-container');

var countries = {}, result = [];
for (let scholarship of scholarshipData) {
    try {
        if (!(scholarship.country in countries)) {
            countries[scholarship.country] = [];
            result.push(countries[scholarship.country]);
        }
        if (!(countries[scholarship.country].some((obj) => obj.link === scholarship.link))) {
            // don't allow the same scholarship to be added to the country twice
            countries[scholarship.country].push(scholarship)
        }
    } catch (err) {
        console.log('error', err)
    }
}

console.log(countries)

for (let country in countries) {
    const countryDiv = document.createElement('div');
    const countryTitle = document.createElement('h3');
    // countryTitle.append(toTitleCase(country))
    countryTitle.append(country)
    countryTitle.classList.add('country-title')
    countryDiv.append(countryTitle)
    for (let scholarship of countries[country]) {
        const countryLink = document.createElement('a');
        countryLink.href = scholarship.link;
        countryLink.innerText = scholarship.scholarship;
        countryDiv.append(countryLink)
    }
    mainContainer.append(countryDiv);
}
mainContainer.innerHTML += '<p>Scholarship data extracted from scholars4dev.com</p>'


// function toTitleCase(str) {
//     return str.toLowerCase().split(' ').map(function (word) {
//       return (word.charAt(0).toUpperCase() + word.slice(1));
//     }).join(' ');
//   }