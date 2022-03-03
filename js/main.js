// POKEMONS
import { createPokemonsFiguresFromTemplate, gettingThePokemonsFromTheAnswer, gettingPokemonInformation } from "./modules/pokemons.js";
// MODAL
import { openModal, closeModal, showPokemonInfoInModal } from "./modules/modal.js";

// DOM CONTENT LOADED
document.addEventListener("DOMContentLoaded", async function(){
    let $main = document.querySelector(".main");
    $main.innerHTML = `<img src="img/loader.svg">`;
    addFiltersInNavbar("https://pokeapi.co/api/v2/type/");
    let pokemons = await gettingPokemons("https://pokeapi.co/api/v2/pokemon?offset=0&limit=10"),
    paginations;
    addFiguresInMain(pokemons);
    observeFigures();
    // EVENT CLICK
    document.addEventListener("click", async e=>{
        // FILTERS
        if(e.target.matches(".filters a")){
            e.preventDefault();
            changeClassActive(e.target);
            $main.innerHTML = `<img src="img/loader.svg">`;
            // filters-all
            if(e.target.matches(".filters a.filters-all")){
                pokemons = await gettingPokemons(e.target.href);
                addFiguresInMain(pokemons);
            }
            // filters-filter
            if(e.target.matches(".filters a.filters-filter")){
                paginations = await gettingPokemons(e.target.href);
                pokemons = paginations[0];
                addFiguresInMain(pokemons);
                if(typeof pokemons == "undefined" ) $main.innerHTML = `<h2>No se encontraton Pokemons de tipo "${e.target.textContent}"</h2>`;
            }
            observeFigures();
        }
        // PAGINATIONS
        if(e.target.matches(`.pagination a`)){
            e.preventDefault();
            changeClassActive(e.target);
            $main.innerHTML = `<img src="img/loader.svg">`;
            pokemons = e.target.matches(`.pagination a.page-all`)? await gettingPokemons(e.target.href) : paginations[e.target.dataset.page];
            addFiguresInMain(pokemons);
            observeFigures();
        }
        // MODAL
        // Open modal
        if(e.target.matches(`figure .buttons button`)){
            openModal();
            showPokemonInfoInModal({id: e.target.dataset.id, pokemons, gettingPokemonInformation, gettingFetch});
        } 
        // close modal
        if(e.target.matches(".modal")) closeModal();
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
// GETTING POKEMONS
async function gettingPokemons(url){
    let res = await gettingFetch(url);
    let pokemons = await gettingThePokemonsFromTheAnswer(extractingPokemonsFromTheResponse(res), gettingFetch);
    pokemons =  creatingPagingOfTheResponse(res, pokemons);
    return pokemons;
}
// EXTRACTING POKEMONS FROM THE RESPONSE
function extractingPokemonsFromTheResponse(res){
    if(res.results) return res.results;
    if(res.pokemon){
        let array= [];
        for(let i=0; i<res.pokemon.length ; i++){
            array.push(res.pokemon[i].pokemon);
        }
        return array;
    }
}
// CREATING PAGING OF THE RESPONSE
function creatingPagingOfTheResponse(res, pokemons){
    let $pagination = document.querySelector(".pagination");
    if(res.results){
        $pagination.innerHTML = res.previous? `<a class="page-all" href="${res.previous}">previous</a>` : "";
        $pagination.innerHTML += res.next? `<a class="page-all" href="${res.next}">next</a>` : "";
    }
    if(res.pokemon){
        $pagination.innerHTML = "";
        let total_paginations = Math.round(pokemons.length / 10),
        paginations = [], last= 0;
        for(let i = 1; i<=total_paginations; i++){
            paginations.push(pokemons.slice(last,10*i));
            last += 10;
            $pagination.innerHTML += `<a href="#" class="page-filter" data-page="${i-1}">${i}</a>`;
        }
        pokemons = paginations;
    }
    return pokemons;
}
// --------------------------------------------------
// ADD FIGURES IN MAIN
function addFiguresInMain(pokemons){
    let $main = document.querySelector(".main"),
    figures = createPokemonsFiguresFromTemplate(pokemons);
    $main.innerHTML= "";
    $main.append(figures);
}
// FILTER
async function addFiltersInNavbar(url){
    let $filters = document.querySelector(".filters");
    let pokemonsTypes = await  gettingFetch(url);
    for(let i=0; i<pokemonsTypes.results.length; i++){
        $filters.innerHTML += `<a href="${url+pokemonsTypes.results[i].name}" class="filters-filter" >${pokemonsTypes.results[i].name}</a>`;
    }
}
// CHANGE CLASS ACTIVE / REMOVE AND ADD CLASS
function changeClassActive(element){
    let elements = element.parentElement.querySelectorAll(element.localName);
    elements.forEach(e => e.classList.remove("active"));
    element.classList.add("active");
}

