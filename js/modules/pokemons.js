// SHOW ALL POKEMONS
async function showAllPokemons(url, gettingFetch, observeFigures){
    document.querySelector(".main").innerHTML = `<img src="img/loader.svg">`;
    let { pokemons, next, previous } = await gettingDataFromUrl(url, gettingFetch);
    addPaginationInMain(next, previous);
    addPokemonsInMain(pokemons);
    // show figures with intersection observer
    observeFigures();
    return pokemons;
}
// GETTING DATA FROM URL
async function gettingDataFromUrl(url, gettingFetch){
    let res = await gettingFetch(url);
    return {
        pokemons: await gettingThePokemonsFromTheAnswer(res.results, gettingFetch), 
        next: res.next? `<a class="next" href="${res.next}">next</a>` : "", 
        previous: res.previous? `<a class="prev" href="${res.previous}">previous</a>` : ""
    }
}
// GETTING THE POKEMONS FROM THE ANSWER
async function gettingThePokemonsFromTheAnswer(elements, gettingFetch){
    let array=[];
    for (let i=0; i<elements.length; i++) {
        let item = await gettingFetch(elements[i].url);
        array.push(item);
    }
    return array;
}
// ADD PAGINATION IN MAIN
function addPaginationInMain(next, previous){
    document.querySelector(".pagination").innerHTML = previous+next;
}
// ADD POKEMONS IN MAIN
async function addPokemonsInMain(pokemons){
    const $main = document.querySelector(".main"),
    $template = document.getElementById("template-figure").content,
    fragment = document.createDocumentFragment();

    pokemons.forEach( pokemon => {
        fragment.appendChild(createPokemonFigureFromTemplate(pokemon, $template));
    });
    document.querySelector(".main").innerHTML= "";
    $main.append(fragment);
}
// CREATE POKEMON FIGURE FROM TEMPLATE
function createPokemonFigureFromTemplate(pokemon, $template){
    $template.querySelector("figure").classList.add("opacity-none");

    $template.querySelector("picture img").src = pokemon.sprites.other.dream_world.front_default;
    $template.querySelector("picture img").alt = pokemon.name;

    $template.querySelectorAll("figcaption p")[0].innerHTML = `<span class="color-yellow">Name: </span> ${pokemon.name}`;
    $template.querySelectorAll("figcaption p")[1].innerHTML = `<span class="color-yellow">Type: </span> ${pokemon.types[0].type.name}`;
    $template.querySelectorAll("figcaption p")[2].innerHTML = `<span class="color-yellow">Experience: </span> ${pokemon.base_experience}`;

    $template.querySelector(".buttons button").dataset.id = pokemon.id;

    let figure = document.importNode($template, true);
    return figure;
}
// ---------------------------------------
// SHOW POKEMON INFO IN MODAL
async function showPokemonInfoInModal(opt){
    let { id, pokemons, modal, gettingFetch } = opt,
    pokemon = pokemons.filter(res => res.id == id)[0],
    { pokemonTypes, pokemonSkills, pokemonDescription, pokemonGeneration, pokemonHabitat } = await getPokemonInfoInModal(pokemon, gettingFetch);

    let header = 
    `
    <header class="modal-header">
        <img src="${pokemon.sprites.other.dream_world.front_default}">
    </header>
    `,
    title = 
    `
        <h2 class="modal-title">${pokemon.name}</h2>
    `,
    section = 
    `
    <section class="modal-section">
        <p><span class="color-yellow">Abilities: </span> ${pokemonSkills}</p>
        <p><span class="color-yellow">Experience: </span> ${pokemon.base_experience}</p>
        <p><span class="color-yellow">Moves: </span> ${pokemon.moves.length} moves</p>
        <p><span class="color-yellow">Types: </span> ${pokemonTypes}</p>
        <p><span class="color-yellow">Generation: </span> ${pokemonGeneration}</p>
        <p><span class="color-yellow">Habitat: </span> ${pokemonHabitat}</p>
        <p>${pokemonDescription}</p>
    </section>
    `;

    modal.querySelector(".modal-content").innerHTML = header;
    modal.querySelector(".modal-content").innerHTML += title;
    modal.querySelector(".modal-content").innerHTML += section;
}
// GET POKEMON INFO IN MODAL
async function getPokemonInfoInModal(pokemon, gettingFetch){
    let info = await gettingFetch(pokemon.species.url);
    return { 
        pokemonTypes: getPokemonTypes(pokemon),
        pokemonSkills: getPokemonSkills(pokemon),
        pokemonDescription: info.flavor_text_entries[0].flavor_text,
        pokemonGeneration: info.generation.name,
        pokemonHabitat: info.habitat.name
    };
}
// GET POKEMON TYPES
function getPokemonTypes(pokemon){
    let text = "";
    pokemon.types.forEach((v, i)=>{
        text += i!==pokemon.types.length-1? v.type.name+", ": v.type.name+".";
    });
    return text;
}
// GET POKEMON SKILLS
function getPokemonSkills(pokemon){
    let text = "";
    pokemon.abilities.forEach((v, i)=>{
        text += i!==pokemon.abilities.length-1? v.ability.name+", ": v.ability.name+".";
    });
    return text;
}

export {
    showAllPokemons,
    showPokemonInfoInModal
}