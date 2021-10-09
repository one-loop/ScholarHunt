var searchResults = document.querySelector('div.search-results');
var searchForm = document.querySelector('.search-form');
var searchBar = document.querySelector('.search-bar');
var detailsPane = document.querySelector('.details');

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    let searchTerm = searchBar.value;
    console.log(searchTerm);
    let scholarships = getScholarships(searchTerm);
    console.log(scholarships);
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

    console.log(scholarships)

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
        console.log(provider)
        for (let scholarship of scholarshipHTML) {
            if (scholarshipPanel.id === scholarship.id) {
                axios.get(`https://api.unsplash.com/search/photos?query=${provider}&per_page=20&client_id=gK52De2Tm_dL5o1IXKa9FROBAJ-LIYqR41xBdlg3X2k`)
                    .then(response => {
                        detailsPane.innerHTML = '';
                        detailsPane.scrollTop = 0;
                        const details = document.createElement('div');
                        const image = document.createElement('img');
                        image.src = response.data.results[Math.floor(Math.random() * 5) + 1].urls.regular;
                        image.classList.add('scholarship-image-banner');
                        detailsPane.append(image);
                        // detailsPane.classList.remove('d-flex');
                        details.innerHTML = `<h3>${scholarshipName}</h3>`
                        details.innerHTML += scholarship.html;
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
            document.querySelector('body').classList.remove('light')
            document.querySelector('body').classList.add('dark')
        } else {
            document.querySelector('body').classList.remove('dark')
            document.querySelector('body').classList.add('light')
        }
    })
}
darkModeToggle();