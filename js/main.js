// POKEMONS
import { showPokemonInfoInModal, showAllPokemons } from "./modules/pokemons.js";

// DOM CONTENT LOAD
document.addEventListener("DOMContentLoaded", async function(){
    let pokemons = await showAllPokemons("https://pokeapi.co/api/v2/pokemon"+"?offset=0&limit=15", gettingFetch, observeFigures);
    const modal = document.querySelector(".modal");

    // event click
    document.addEventListener("click", async e=>{
        if(e.target.matches(`figure .buttons button`)){
            openModal(modal);
            showPokemonInfoInModal({id: e.target.dataset.id, pokemons, modal, gettingFetch});
        } 
        if(e.target == modal ) closeModal(modal);
        if(e.target.matches(`.pagination a`)){
            e.preventDefault();
            pokemons = await showAllPokemons(e.target.href, gettingFetch, observeFigures);
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
