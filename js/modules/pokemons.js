// CREATE POKEMONS FIGURES FROM TEMPLATE
function createPokemonsFiguresFromTemplate(pokemons){
    const $template = document.getElementById("template-figure").content,
    fragment = document.createDocumentFragment();
    if(pokemons){
        pokemons.length>1? 
        pokemons.forEach( pokemon => createFigure(pokemon, $template, fragment) ):
        createFigure(pokemons, $template, fragment);
    }
    return fragment;
}
// CREATE FIGURE
function createFigure(pokemon, $template, fragment){
    let textFigcaption = `
    <p><span class="color-primary">Name: </span> ${getPokemonName(pokemon)}</p>
    <p><span class="color-primary">Experience: </span> ${getPokemonBaseExperience(pokemon)}</p>
    <p><span class="color-primary">Type: </span> ${getPokemonTypes(pokemon)}</p>`;

    $template.querySelector("figure").classList.add("opacity-none");
    $template.querySelector("picture").dataset.id = getPokemonId(pokemon);
    $template.querySelector("picture img").src = getPokemonImg(pokemon);
    $template.querySelector("picture img").alt = getPokemonName(pokemon);
    $template.querySelector("figcaption").innerHTML = textFigcaption;
    $template.querySelector(".buttons button").dataset.id = getPokemonId(pokemon);

    let copy = document.importNode($template, true);
    fragment.appendChild(copy);
}
// --------------------------------------------------------
// GETTING THE POKEMONS FROM THE ANSWER
async function gettingThePokemonsFromTheAnswer(pokemons, gettingFetch){
    let array=[];
    for (let i=0; i<pokemons.length; i++) {
        let item = await gettingFetch(pokemons[i].url);
        array.push(item);
    }
    return array;
}
// GETTING POKEMONS
async function gettingPokemons(url, gettingFetch){
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
        let total_paginations = Math.round(pokemons.length / 20),
        paginations = [], last= 0;
        for(let i = 1; i<=total_paginations; i++){
            paginations.push(pokemons.slice(last,20*i));
            last += 20;
            $pagination.innerHTML +=i==1? `<a href="#" class="page-filter active" data-page="${i-1}">${i}</a>` : `<a href="#" class="page-filter" data-page="${i-1}">${i}</a>`;
        }
        pokemons = paginations;
    }
    return pokemons;
}
// --------------------------------------------------------
// GETTING POKEMON INFORMATION
async function gettingPokemonInformation(pokemon, gettingFetch){
    let info = await gettingFetch(pokemon.species.url);
    return { 
        pokemonImg: getPokemonImg(pokemon),
        pokemonId: getPokemonId(pokemon),
        pokemonName: getPokemonName(pokemon),
        pokemonMovies: getPokemonMovies(pokemon),
        pokemonTypes: getPokemonTypes(pokemon),
        pokemonSkills: getPokemonSkills(pokemon),
        pokemonBaseExperience: getPokemonBaseExperience(pokemon),
        pokemonDescription: getPokemonDescription(info),
        pokemonGeneration: getPokemonGeneration(info),
        pokemonHabitat: getPokemonHabitat(info)
    };
}
// GET POKEMON IMAGE
function getPokemonImg(pokemon){
    return pokemon.sprites.other.dream_world.front_default? 
    pokemon.sprites.other.dream_world.front_default: 
    pokemon.sprites.other.home.front_default?
    pokemon.sprites.other.home.front_default:
    pokemon.sprites.front_default?
    pokemon.sprites.front_default:"";
}
// GET POKEMON ID
function getPokemonId(pokemon){
    return pokemon.id;
}
// GET POKEMON NAME
function getPokemonName(pokemon){
    let text = pokemon.name;
    while(text.includes("-")){
        text = text.replace("-", " ");
    }
    return text;
}
// GET POKEMON MOVES
function getPokemonMovies(pokemon){
    return pokemon.moves.length;
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
// GET POKEMON BASE EXPERIENCE
function getPokemonBaseExperience(pokemon){
    return pokemon.base_experience
}
// GET POKEMON FLAVOR TEXT IN ENGLISH
function getPokemonDescription(info){
    let text =[];
    text = info.flavor_text_entries.filter( f => f.language.name == "en");
    return text.length==1? text.flavor_text : text[0].flavor_text;
}
// GET POKEMON GENERATION
function getPokemonGeneration(info){
    return info.generation.name;
}
// GET POKEMON HABITAT
function getPokemonHabitat(info){
    return info.habitat? info.habitat.name : "?";
}
// --------------------------------------------------------
export {
    createPokemonsFiguresFromTemplate,
    gettingPokemonInformation,
    gettingThePokemonsFromTheAnswer,
    gettingPokemons
}