// POKEMONS
import { showPokemonInfoInModal, showPokemons, gettingThePokemonsFromTheAnswer, addPokemonsInMain } from "./modules/pokemons.js";

// DOM CONTENT LOAD
document.addEventListener("DOMContentLoaded", async function(){
    let pokemonFilters = await addFiltersInNavbar("https://pokeapi.co/api/v2/type/"),
    pokemons = await showPokemons("https://pokeapi.co/api/v2/pokemon"+"?offset=0&limit=10", gettingFetch, observeFigures);
    const modal = document.querySelector(".modal");
    let paginations;
    // event click
    document.addEventListener("click", async e=>{
        // Pagination All
        if(e.target.matches(`.pagination .page-all`)){
            e.preventDefault();
            pokemons = await showPokemons(e.target.href, gettingFetch, observeFigures);
        }
        // filters
        if(e.target.matches(".filters .filters-filter")){
            e.preventDefault();
            document.querySelector(".main").innerHTML = `<img src="img/loader.svg">`;
            pokemons = await gettingPokemonsWithFilter(e.target);
            paginations = createPaginationsForFilter(pokemons);
            addPokemonsInMain(paginations[0]);
            if(pokemons.length==0) document.querySelector(".main").innerHTML = `<h2>No se encontraton Pokemons de tipo "${e.target.textContent}"</h2>`
            observeFigures();
        }
        if(e.target.matches(".filters .filters-all")){
            e.preventDefault();
            addClassActive(e.target);
            document.querySelector(".main").innerHTML = `<img src="img/loader.svg">`;
            pokemons = await showPokemons("https://pokeapi.co/api/v2/pokemon"+"?offset=0&limit=10", gettingFetch, observeFigures);
        }
        
        // Pagination Filter
        if(e.target.matches(`.pagination .page-filter`)){
            e.preventDefault();
            addClassActive(e.target);
            addPokemonsInMain(paginations[e.target.dataset.page]);
            observeFigures();
        }
        // Open modal
        if(e.target.matches(`figure .buttons button`)){
            openModal(modal);
            showPokemonInfoInModal({id: e.target.dataset.id, pokemons, modal, gettingFetch});
        } 
        // close modal
        if(e.target == modal ) closeModal(modal);
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
// MODAL
// open modal
function openModal(modal){
    document.querySelector("body").classList.add("block-scroll");
    modal.classList.remove("hidden");
    modal.querySelector(".modal-content").classList.add("animation");
    modal.querySelector(".modal-content").innerHTML=`<img src="img/loader.svg">`;
}
// close modal
function closeModal(modal){
    document.querySelector("body").classList.remove("block-scroll");
    modal.classList.add("hidden");
    modal.querySelector(".modal-content").classList.remove("animation");
}
// ---------------------------------------------------
// FILTER
async function addFiltersInNavbar(url){
    let $filters = document.querySelector(".filters");
    let pokemonsTypes = await  gettingFetch(url);
    for(let i=0; i<pokemonsTypes.results.length; i++){
        $filters.innerHTML += `<a href="${url+pokemonsTypes.results[i].name}" class="filters-filter" >${pokemonsTypes.results[i].name}</a>`;
    }
}
// GETTING POKEMONS WITH FILTER
async function gettingPokemonsWithFilter(filter){
    let res = await gettingFetch(filter.href);
    let array= [];
    for(let i=0; i<res.pokemon.length ; i++){
        array.push(res.pokemon[i].pokemon);
    }
    return await gettingThePokemonsFromTheAnswer(array, gettingFetch);
}
// CREATE PAGINATIONS FOR FILTER
function createPaginationsForFilter(pokemons){
    document.querySelector(".pagination").innerHTML = "";
    let total_paginations = Math.round(pokemons.length / 10),
    paginations = [], last= 0;
    for(let i = 1; i<=total_paginations; i++){
        paginations.push(pokemons.slice(last,10*i));
        last += 10;
        document.querySelector(".pagination").innerHTML += `<a href="#" class="page-filter" data-page="${i-1}">${i}</a>`;
    }
    return paginations;
}

function addClassActive(element){
    element.classList.add(".active");
}
function removeClassActive(element){
    let all = element.parentElement;
    console.log(all, all.querySelectorAll(`${element}`));
    // all.forEach(a => {
    //     console.log(a);
    // });
}