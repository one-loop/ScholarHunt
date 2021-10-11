var searchResults = document.querySelector('div.search-results');
var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('.search-bar');
var detailsPane = document.querySelector('.details');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    let searchTerm = searchBar.value;
    let scholarships = getScholarships(searchTerm);
    displayScholarships(scholarships)
})

function getScholarships(searchTerm) {
    let scholarships = [];
    const regex = new RegExp(`.*${searchTerm}.*`, 'i');
    for (let scholarship of scholarshipData) {
        if (regex.test(scholarship.scholarship) || regex.test(scholarship.provider) || regex.test(scholarship.country) || regex.test(scholarship.region) || regex.test(scholarship.degreeType) || regex.test(scholarship.field)) {
            scholarships.push(scholarship)
        }
    }
    return scholarships;
}

function displayScholarships(scholarshipsList) {
    // remove previous search results before rendering new ones
    searchResults.innerHTML = '';
    // remove duplicate objects from list
    // var scholarships = scholarshipsList.DistinctBy(schol => schol.link);
    const scholarships = Array.from(new Set(scholarshipsList.map(s => s.scholarship)))
        .map(scholarship => {
            return scholarshipsList.find(s => s.scholarship === scholarship)
        })


    for (let scholarship of scholarships) {
        // create elements
        let scholarshipPanel = document.createElement('div');
        let scholarshipIcon = document.createElement('div');
        let content = document.createElement('content');
        let scholarshipName = document.createElement('h3');
        let country = document.createElement('button');
        let deadline = document.createElement('button');
        let provider = document.createElement('button');

        // add classes
        scholarshipPanel.classList.add('scholarship-panel');
        scholarshipIcon.classList.add('scholarship-icon');
        content.classList.add('content');
        scholarshipName.classList.add('name');
        country.classList.add('tag'); deadline.classList.add('tag'); provider.classList.add('tag');

        // fill in content from json database
        country.append(scholarship.country)
        provider.append(scholarship.provider)
        deadline.append(scholarship.deadline)
        scholarshipName.append(scholarship.scholarship);
        scholarshipIcon.innerHTML = `
            <img src="${flags[scholarship.country]}" class="flag-icon"></img>
        `
        
        content.append(scholarshipName, country, provider, deadline);
        scholarshipPanel.append(scholarshipIcon, content);
        scholarshipPanel.id = scholarship.link.split('/')[3];
        displayScholarshipDetails(scholarshipPanel);
        
        // add the scholarship to the search results section
        searchResults.append(scholarshipPanel);
    }
}

function displayScholarshipDetails(scholarshipPanel) {
    // when clicking on a scholarship result, you can get extra details
    scholarshipPanel.addEventListener('click', () => {
        let provider = scholarshipPanel.children[1].children[2].innerText;
        let scholarshipName = scholarshipPanel.children[1].firstChild.innerText;
        for (let scholarship of scholarshipHTML) {
            if (scholarshipPanel.id === scholarship.id) {
                detailsPane.innerHTML = '';
                detailsPane.scrollTop = 0;
                axios.get(`https://api.unsplash.com/search/photos?query=${provider}&per_page=20&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k`)
                    .then(response => {
                        const regex = new RegExp(`.*${scholarshipPanel.id}.*`, 'i');
                        for (let scholarship of scholarshipData) {
                            if (regex.test(scholarship.link)) {
                                var scholarshipDetails = scholarship;
                                break;
                            }
                        }
                        const details = document.createElement('div');
                        const image = document.createElement('img');
                        image.src = response.data.results[Math.floor(Math.random() * 5) + 1].urls.regular;
                        image.classList.add('scholarship-image-banner');
                        detailsPane.append(image);
                        const table = document.createElement('table');
                        table.innerHTML = `<thead>
                                                <th>Provider</th>
                                                <th>Degree</th>
                                                <th>Deadline</th>
                                                <th>Country</th>
                                            </thead>
                                            <td>${scholarshipDetails.provider}</td>
                                            <td>${scholarshipDetails.degreeType}</td>
                                            <td>${scholarshipDetails.deadline}</td>
                                            <td>${scholarshipDetails.country}</td>
                                            `

                        details.innerHTML = `<h3>${scholarshipName}</h3>`;
                        details.append(table)
                        details.innerHTML += scholarship.html.replaceAll('#003366;', 'var(--secondary)').replaceAll('#ff0000', '#ff5370').split(`<span id="more-${scholarshipPanel.id}"></span>`)[1];
                        details.classList.add('details-text')
                        detailsPane.append(details);
                        detailsPane.classList.add('details-selected');
                    })
            }
        }
    })  
}


function darkModeToggle() {
    const darkModeToggle = document.querySelector('#flexSwitchCheckDefault');

    darkModeToggle.addEventListener('change', function() {
        if (darkModeToggle.checked) {
            document.querySelector('body').classList.remove('light');
            document.querySelector('body').classList.add('dark');
            localStorage.setItem('isDarkMode', true);
        } else {
            document.querySelector('body').classList.remove('dark');
            document.querySelector('body').classList.add('light');
            localStorage.setItem('isDarkMode', false);
        }
    })
}
darkModeToggle();

function setDarkMode() {
    if (localStorage.getItem('isDarkMode') === 'true') {
        document.querySelector('#flexSwitchCheckDefault').checked = true;
        document.querySelector('body').classList.remove('light');
        document.querySelector('body').classList.add('dark');
    } else {
        document.querySelector('#flexSwitchCheckDefault').checked = false;
        document.querySelector('body').classList.remove('dark');
        document.querySelector('body').classList.add('light');
    }
}

setDarkMode();

const flags = {
    'UK': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ec-1f1e7.svg',
    'USA': 'https://twemoji.maxcdn.com/v/latest/svg/1f1fa-1f1f8.svg',
    'Canada': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e8-1f1e6.svg',
    'Germany': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e9-1f1ea.svg',
    'Australia': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e6-1f1fa.svg',
    'Hong Kong': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ed-1f1f0.svg',
    'China': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e8-1f1f3.svg',
    'France': 'https://twemoji.maxcdn.com/v/latest/svg/1f1eb-1f1f7.svg',
    'India': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ee-1f1f3.svg',
    'Malaysia': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f2-1f1fe.svg',
    'Singapore': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f8-1f1ec.svg',
    'Japan': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ef-1f1f5.svg',
    'Spain': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ea-1f1f8.svg',
    'New Zealand': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f3-1f1ff.svg',
    'Korea': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f0-1f1f7.svg',
    'Singapore': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f8-1f1ec.svg',
    'Netherlands': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f3-1f1f1.svg',
    'Denmark': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e9-1f1f0.svg',
    'Sweden': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f8-1f1ea.svg',
    'Finland': 'https://twemoji.maxcdn.com/v/latest/svg/1f1eb-1f1ee.svg',
    'Austria': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e6-1f1f9.svg',
    'Mexico': 'https://twemoji.maxcdn.com/v/latest/svg/1f1f2-1f1fd.svg',
    'Belgium': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e7-1f1ea.svg',
    'Italy': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ee-1f1f9.svg',
    'Switzerland': 'https://twemoji.maxcdn.com/v/latest/svg/1f1e8-1f1ed.svg',
    'Ireland': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ee-1f1ea.svg',
    'Italy': 'https://twemoji.maxcdn.com/v/latest/svg/1f1ee-1f1f9.svg',
}