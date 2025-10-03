// Login
const loginBtn = document.getElementById('login')
const searchContainer = document.getElementById('input-search-container');
const searchBtn = document.getElementById('searchBtn');

async function loginUser() {
    try {
        const response = await fetch(CONFIG.BASE_FETCH_URL+'/api/v1/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'admin@admin.com',     // Tus credenciales del backend
                password: 'admin'
            })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || 'Error en el login');
            return;
        }

        // Guardar el token en localStorage
        localStorage.setItem('jwtToken', data.token);

    } catch (error) {
        console.error('Error al hacer login:', error);
    }
}

function showSearchContainer() {
    loginBtn.style.display = 'none';
    searchContainer.style.display = 'block';
}

async function fetchProtectedData() {
    const token = localStorage.getItem('jwtToken');

    const response = await fetch(CONFIG.BASE_FETCH_URL + "api/v1/pokemonDetails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    console.log(data);
}

async function fetchPokemonData() {
    const token = localStorage.getItem('jwtToken');

    const nombrePokemon = document.getElementById("pokemonInput").value.trim();
    console.log(nombrePokemon);
    console.log(CONFIG.BASE_FETCH_URL + '/api/v1/pokemonDetails')

    if (!nombrePokemon) {
      alert("Por favor escribe un nombre de Pokémon");
      return;
    }

    try {
      const response = await fetch(CONFIG.BASE_FETCH_URL + '/api/v1/pokemonDetails', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Si usas token guardado en localStorage
          "Authorization":`Bearer ${token || ""}`
        },
        body: JSON.stringify({ pokemonName: nombrePokemon })
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);
          console.log(data);

        return data;

    } catch (error) {
      console.error("Error enviando Pokémon:", error);
    }


}

async function showPokemonData() {
    const container = document.getElementById("pokemon-data");
    const data = await fetchPokemonData();

    if (data.error) {
        container.innerHTML = `<p style="color:red;">Ups! Pokémon no encontrado</p>`;
        container.style.display = "block";
        return;
    }

    container.innerHTML = `
        <h2>${data.name}</h2>
        <p>Species: ${data.species}</p>
        <p>Weight: ${data.weight}</p>

        <img src="${data.img_url}" alt="${data.name}" width="200">
    `;

    container.style.display = "block";
}


loginBtn.addEventListener('click', loginUser);
loginBtn.addEventListener('click', showSearchContainer)
searchBtn.addEventListener('click', showPokemonData);
