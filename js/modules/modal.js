let modal = document.querySelector(".modal"),
modalContentHeader = modal.querySelector(".modal-content .modal-content-header"),
modalContentTitle = modal.querySelector(".modal-content .modal-content-title"),
modalContentSection = modal.querySelector(".modal-content .modal-content-section"),
modalNext = modal.querySelector(".modal .modal-select-next"),
modalPrev = modal.querySelector(".modal .modal-select-prev");
let position;
// OPEN MODAL
function openModal(){
    document.querySelector("body").classList.add("block-scroll");
    modal.classList.remove("hidden");
    modal.querySelector(".modal-content").classList.add("animation");
    modalContentHeader.innerHTML = ``;
    modalContentTitle.innerHTML = ``;
    modalContentSection.innerHTML = `<img src="img/loader.svg" alt="loader">`;
    modalContentSection.style.alignItems = "center";
    modalContentSection.style.justifyContent = "center";
}
// CLOSE MODAL
function closeModal(){
    document.querySelector("body").classList.remove("block-scroll");
    modal.classList.add("hidden");
    modal.querySelector(".modal-content").classList.remove("animation");
}
function addSelectInModal(id, pokemons){
    pokemons.forEach((v,i)=>{
        if(v.id==id){
            position=i;
        }
    });
    // NEXT
    if(position>0){
        modalPrev.classList.remove("hidden");
        modalPrev.dataset.position = position - 1;
    }else{
        modalPrev.classList.add("hidden");
        modalPrev.dataset.position = id;
    }
    // PREVIOUS
    if(position<pokemons.length-1){
        modalNext.classList.remove("hidden");
        modalNext.dataset.position = position + 1;
    }else{
        modalNext.classList.add("hidden");
        modalNext.dataset.position = id;
    }
}
// RENDER POKEMON INFO IN MODAL
async function renderPokemonInfoInModal(opt){
    const { id, pokemons, gettingPokemonInformation, gettingFetch } = opt,
    pokemon = pokemons.length>1? pokemons.filter(p => p.id == id)[0] : pokemons;
    const pokemonInformation = await gettingPokemonInformation(pokemon, gettingFetch);
    modalContentHeader.innerHTML = renderModalContentHeader(pokemonInformation.pokemonImg, pokemonInformation.pokemonName);
    modalContentTitle.innerHTML = renderModalContentTitle(pokemonInformation.pokemonName);
    modalContentSection.style.alignItems = "start";
    modalContentSection.style.justifyContent = "start";
    modalContentSection.innerHTML = renderModalContentSection(pokemonInformation);
}
// RENDER MODAL CONTENT HEADER
function renderModalContentHeader(img, alt){
    return `<img src="${img}" alt="${alt}">`; 
}
// RENDER MODAL CONTENT TITLE
function renderModalContentTitle(name){
    return `<h2 class="modal-title">${name}</h2>`; 
}
// RENDER MODAL CONTENT SECTION
function renderModalContentSection(pokemonInformation){
    return `
    <p><span class="color-primary">Id: </span> ${pokemonInformation.pokemonId}</p>
    <p><span class="color-primary">Abilities: </span> ${pokemonInformation.pokemonSkills}</p>
    <p><span class="color-primary">Experience: </span> ${pokemonInformation.pokemonBaseExperience}</p>
    <p><span class="color-primary">Moves: </span> ${pokemonInformation.pokemonMovies} moves</p>
    <p><span class="color-primary">Types: </span> ${pokemonInformation.pokemonTypes}</p>
    <p><span class="color-primary">Generation: </span> ${pokemonInformation.pokemonGeneration}</p>
    <p><span class="color-primary">Habitat: </span> ${pokemonInformation.pokemonHabitat}</p>
    <p>${pokemonInformation.pokemonDescription}</p>
    `; 
}
export {
    openModal,
    closeModal,
    renderPokemonInfoInModal,
    addSelectInModal
}