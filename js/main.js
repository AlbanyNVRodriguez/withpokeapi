// POKEMONS
import { createPokemonsFiguresFromTemplate, gettingPokemonInformation, gettingPokemons } from "./modules/pokemons.js";
// MODAL
import { openModal, closeModal, renderPokemonInfoInModal, addSelectInModal } from "./modules/modal.js";

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", async function(){
    let $main = document.querySelector(".main");
    $main.innerHTML = `<img src="img/loader.svg">`;
    addFiltersInNavbar("https://pokeapi.co/api/v2/type/");
    let pokemons = await gettingPokemons("https://pokeapi.co/api/v2/pokemon?offset=0&limit=10", gettingFetch);
    let paginations;
    addFiguresInMain(pokemons);
    observeFigures();

    // SEARCH
    document.querySelector(".navbar #search").addEventListener("search", async e=>{
        e.preventDefault();
        $main.innerHTML = `<img src="img/loader.svg">`;
        document.querySelector(".pagination").innerHTML="";
        addMessageInHeader(0, 0, false);
        removeClassActive(document.querySelector(".filters-filter"))
        if(e.target.value != "") pokemons = await gettingFetch(`https://pokeapi.co/api/v2/pokemon/${e.target.value}`);
        addFiguresInMain(pokemons);
        observeFigures();
        if(typeof pokemons == "undefined" ) $main.innerHTML = `<h2>No se encontraron resultados de "${e.target.value}"</h2>`;
        e.target.value="";
    });

    // EVENT CLICK
    document.addEventListener("click", async e=>{
        // FILTERS
        if(e.target.matches(".filters a")){
            e.preventDefault();
            $main.innerHTML = `<img src="img/loader.svg">`;
            removeClassActive(e.target);
            addClassActive(e.target);
            document.querySelector(".pagination").innerHTML = ``;
            // filters-all
            if(e.target.matches(".filters a.filters-all")){
                pokemons = await gettingPokemons(e.target.href, gettingFetch);
                addMessageInHeader(0, 0, false);
                addFiguresInMain(pokemons);
            }
            // filters-filter
            if(e.target.matches(".filters a.filters-filter")){
                paginations = await gettingPokemons(e.target.href, gettingFetch);
                pokemons = paginations[0];
                addMessageInHeader(paginations, e.target.textContent, true);
                addFiguresInMain(pokemons);
                if(typeof pokemons == "undefined" ) $main.innerHTML = `<h2>No se encontraton Pokemons de tipo "${e.target.textContent}"</h2>`;
            }
            observeFigures();
        }

        // PAGINATIONS
        if(e.target.matches(`.pagination a`)){
            e.preventDefault();
            $main.innerHTML = `<img src="img/loader.svg">`;
            removeClassActive(e.target);
            addClassActive(e.target);
            pokemons = e.target.matches(`.pagination a.page-all`)? await gettingPokemons(e.target.href, gettingFetch) : paginations[e.target.dataset.page];
            addFiguresInMain(pokemons);
            observeFigures();
        }

        // MODAL
        if(e.target.matches(`figure .buttons button`)){
            openModal();
            renderPokemonInfoInModal({id: e.target.dataset.id, pokemons, gettingPokemonInformation, gettingFetch});
            addSelectInModal(e.target.dataset.id, pokemons);
        } 
        if(e.target.matches(".modal")) closeModal();
        if(e.target.matches(".modal .modal-select")){
            e.preventDefault();
            renderPokemonInfoInModal({id: pokemons[e.target.dataset.position].id, pokemons, gettingPokemonInformation, gettingFetch});
            addSelectInModal(pokemons[e.target.dataset.position].id, pokemons);
        }
    });
    
});
// -------------------------------------------------
// INTERSECTION OBSERVER
function observeFigures(){
    let callback = entries => {
        entries.forEach(entry => {
            if(entry.isIntersecting) entry.target.classList.remove("opacity-none");
            window.addEventListener("visibilitychange", e=> {
                if( document.visibilityState === "visible" && entry.isIntersecting ) entry.target.classList.remove("opacity-none");
            })
        });
    }
    let observer = new IntersectionObserver(callback, { threshold: 0.3 });
    document.querySelectorAll(".main figure").forEach(figure => observer.observe(figure));
}
// GETTING FETCH
async function gettingFetch(url){
    try{
        let res = await fetch(url);
        if(!res.ok) throw { status: res.status, statusText: res.statusText }
        return await res.json();
    }catch(error){
        document.querySelector(".main").textContent = "error: "+error.status+" - "+error.statusText;
    }
}
// --------------------------------------------------
// ADD FIGURES IN MAIN
function addFiguresInMain(pokemons){
    let $main = document.querySelector(".main"),
    figures = createPokemonsFiguresFromTemplate(pokemons);
    $main.innerHTML= "";
    $main.append(figures);
}
// ADD MESSAGE IN HEADER
function addMessageInHeader(paginations, type, filter){
    let header = document.querySelector(".header");
    let count = 0;
    if(filter){
        paginations.forEach(p => count += p.length);
        header.innerHTML = `Total pokemons of type <br>"${type}"<br><span class="color-primary">${count}</span>`;
    }else{
        header.innerHTML = `Consuming one of the most famous APIs in the development world.`;
    }
}
// ADD FILTERS IN NAVBAR
async function addFiltersInNavbar(url){
    let $filters = document.querySelector(".filters");
    let pokemonsTypes = await  gettingFetch(url);
    for(let i=0; i<pokemonsTypes.results.length; i++){
        let nameCapitalize = pokemonsTypes.results[i].name[0].toUpperCase() + pokemonsTypes.results[i].name.slice(1,pokemonsTypes.results[i].name.length);
        $filters.innerHTML += `<a href="${url+pokemonsTypes.results[i].name}" class="filters-filter" >${nameCapitalize}</a>`;
    }
}
// REMOVE CLASS ACTIVE
function removeClassActive(element){
    let elements = element.parentElement.querySelectorAll(element.localName);
    elements.forEach(e => e.classList.remove("active"));
}
// ADD CLASS ACTIVE
function addClassActive(element){
    element.classList.add("active");
}