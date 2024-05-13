// Selecting elements from the DOM
const allTabsBody = document.querySelectorAll('.tab-body-single');
const allTabsHead = document.querySelectorAll('.tab-head-single');
const searchForm = document.querySelector('.app-header-search');
let searchList = document.getElementById('search-list');

// Initializing variables
let activeTab = 1, allData;

// Function to initialize the tab and search functionalities
const init = () => {
    showActiveTabBody();
    showActiveTabHead();
}

// Function to show the active tab head
const showActiveTabHead = () => allTabsHead[activeTab - 1].classList.add('active-tab');

// Function to show the active tab body and hide others
const showActiveTabBody = () => {
    hideAllTabBody();
    allTabsBody[activeTab - 1].classList.add('show-tab');
}

// Function to hide all tab bodies
const hideAllTabBody = () => allTabsBody.forEach(singleTabBody => singleTabBody.classList.remove('show-tab'));

// Function to hide all tab heads
const hideAllTabHead = () => allTabsHead.forEach(singleTabHead => singleTabHead.classList.remove('active-tab'));

// Event listeners
window.addEventListener('DOMContentLoaded', () => init()); // Run init function when the page loads
allTabsHead.forEach(singleTabHead => { // Add click event listeners to tab heads
    singleTabHead.addEventListener('click', () => {
        hideAllTabHead();
        activeTab = singleTabHead.dataset.id;
        showActiveTabHead();
        showActiveTabBody();
    });
});

// Function to get input value from search form
const getInputValue = (event) => {
    event.preventDefault();
    let searchText = searchForm.search.value;
    fetchAllSuperHero(searchText);
}

// Event listener for search form submission
searchForm.addEventListener('submit', getInputValue);

// Function to fetch superhero data from API
const fetchAllSuperHero = async(searchText) => {
    let url = `https://www.superheroapi.com/api.php/1216454192525968/search/${searchText}`;
    try{
        const response = await fetch(url);
        allData = await response.json();
        if(allData.response === 'success'){
            showSearchList(allData.results);
        }
    } catch(error){
        console.log(error);
    }
}

// Function to show search results
const showSearchList = (data) => {
    searchList.innerHTML = "";
    data.forEach(dataItem => {
        const divElem = document.createElement('div');
        divElem.classList.add('search-list-item');
        divElem.innerHTML = `
            <img src = "${dataItem.image.url ? dataItem.image.url : ""}" alt = "">
            <p data-id = "${dataItem.id}">${dataItem.name}</p>
        `;
        searchList.appendChild(divElem);
    });
}

// Event listener for search input keyup
searchForm.search.addEventListener('keyup', () => {
    if(searchForm.search.value.length > 1){
        fetchAllSuperHero(searchForm.search.value);
    } else {
        searchList.innerHTML = "";
    }
});

// Event listener for search list item click
searchList.addEventListener('click', (event) => {
    let searchId = event.target.dataset.id;
    let singleData = allData.results.filter(singleData => {
        return searchId === singleData.id;
    })
    showSuperheroDetails(singleData);
    searchList.innerHTML = "";
});

// Function to show superhero details
const showSuperheroDetails = (data) => {
    document.querySelector('.app-body-content-thumbnail').innerHTML = `
        <img src = "${data[0].image.url}">
    `;

    document.querySelector('.name').textContent = data[0].name;
    document.querySelector('.powerstats').innerHTML = `
    <li>
        <div>
            <i class = "fa-solid fa-shield-halved"></i>
            <span>intelligence</span>
        </div>
        <span>${data[0].powerstats.intelligence}</span>
    </li>
    <!-- More powerstats -->
    `;

    
}
