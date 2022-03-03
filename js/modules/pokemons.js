
// CREATE POKEMONS FIGURES FROM TEMPLATE
function createPokemonsFiguresFromTemplate(pokemons){
    const $template = document.getElementById("template-figure").content,
    fragment = document.createDocumentFragment();
    if(pokemons){
        pokemons.forEach( pokemon => {
            $template.querySelector("figure").classList.add("opacity-none");
            $template.querySelector("picture img").src = pokemon.sprites.other.dream_world.front_default? 
                                                        pokemon.sprites.other.dream_world.front_default: 
                                                        pokemon.sprites.other.home.front_default?
                                                        pokemon.sprites.other.home.front_default:
                                                        pokemon.sprites.front_default?
                                                        pokemon.sprites.front_default:
                                                        "";
            $template.querySelector("picture img").alt = pokemon.name;
            $template.querySelectorAll("figcaption p")[0].innerHTML = `<span class="color-yellow">Name: </span> ${pokemon.name}`;
            $template.querySelectorAll("figcaption p")[1].innerHTML = `<span class="color-yellow">Type: </span> ${getPokemonTypes(pokemon)}`;
            $template.querySelectorAll("figcaption p")[2].innerHTML = `<span class="color-yellow">Experience: </span> ${pokemon.base_experience}`;
            $template.querySelector(".buttons button").dataset.id = pokemon.id;
            let copy = document.importNode($template, true);
            fragment.appendChild(copy);
        });
    }
    return fragment;
}
// GETTING THE POKEMONS FROM THE ANSWER
async function gettingThePokemonsFromTheAnswer(pokemons, gettingFetch){
    let array=[];
    for (let i=0; i<pokemons.length; i++) {
        let item = await gettingFetch(pokemons[i].url);
        array.push(item);
    }
    return array;
}
// GETTING POKEMON INFORMATION
async function gettingPokemonInformation(pokemon, gettingFetch){
    let info = await gettingFetch(pokemon.species.url);
    return { 
        pokemonTypes: getPokemonTypes(pokemon),
        pokemonSkills: getPokemonSkills(pokemon),
        pokemonDescription: getPokemonFlavorText(info.flavor_text_entries),
        pokemonGeneration: info.generation.name,
        pokemonHabitat: info.habitat? info.habitat.name : "?"
    };
}
// --------------------------------------------------------
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
// GET POKEMON FLAVOR TEXT IN ENGLISH
function getPokemonFlavorText(flavor_text_entries){
    let text =[];
    text = flavor_text_entries.filter( f => f.language.name == "en");
    return text.length==1? text.flavor_text : text[0].flavor_text;
}

export {
    createPokemonsFiguresFromTemplate,
    gettingPokemonInformation,
    gettingThePokemonsFromTheAnswer,
}