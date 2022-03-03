let modal = document.querySelector(".modal"),
modalContent = modal.querySelector(".modal-content"),
modalContentHeader = modal.querySelector(".modal-content .modal-content-header"),
modalContentTitle = modal.querySelector(".modal-content .modal-content-title"),
modalContentSection = modal.querySelector(".modal-content .modal-content-section");

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
// SHOW POKEMON INFO IN MODAL
async function showPokemonInfoInModal(opt){
    const { id, pokemons, gettingPokemonInformation, gettingFetch } = opt,
    pokemon = pokemons.filter(res => res.id == id)[0];
    const { pokemonTypes, pokemonSkills, pokemonDescription, pokemonGeneration, pokemonHabitat } = await gettingPokemonInformation(pokemon, gettingFetch);

    modalContentHeader.innerHTML = getModalContentHeader(pokemon);
    modalContentTitle.innerHTML = getmodalContentTitle(pokemon);
    modalContentSection.style.alignItems = "start";
    modalContentSection.style.justifyContent = "start";
    modalContentSection.innerHTML = getModalContentSection(pokemon, pokemonTypes, pokemonSkills, pokemonDescription, pokemonGeneration, pokemonHabitat);
}
// get modal content header
function getModalContentHeader(pokemon){
    let img = pokemon.sprites.other.dream_world.front_default? 
    pokemon.sprites.other.dream_world.front_default: 
    pokemon.sprites.other.home.front_default?
    pokemon.sprites.other.home.front_default:
    pokemon.sprites.front_default?
    pokemon.sprites.front_default:"";
    return `<img src="${img}" alt="${pokemon.name}">`; 
}
// get modal content title
function getmodalContentTitle(pokemon){
    return `<h2 class="modal-title">${pokemon.name}</h2>`; 
}
// get modal content section
function getModalContentSection(pokemon, pokemonTypes, pokemonSkills, pokemonDescription, pokemonGeneration, pokemonHabitat){
    return `
    <p><span class="color-yellow">Abilities: </span> ${pokemonSkills}</p>
    <p><span class="color-yellow">Experience: </span> ${pokemon.base_experience}</p>
    <p><span class="color-yellow">Moves: </span> ${pokemon.moves.length} moves</p>
    <p><span class="color-yellow">Types: </span> ${pokemonTypes}</p>
    <p><span class="color-yellow">Generation: </span> ${pokemonGeneration}</p>
    <p><span class="color-yellow">Habitat: </span> ${pokemonHabitat}</p>
    <p>${pokemonDescription}</p>
    `; 
}
export {
    openModal,
    closeModal,
    showPokemonInfoInModal
}