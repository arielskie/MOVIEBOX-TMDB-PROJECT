document.addEventListener("DOMContentLoaded", () => {

    function initializeSearchAndLibrary(API_KEY) {
        
        // --- SHARED VARIABLES AND FUNCTIONS ---
        const genreMap = {};
        
        async function loadGenres() {
            try {
                const [movieRes, tvRes] = await Promise.all([
                    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`).then(res => res.json()),
                    fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=${API_KEY}&language=en-US`).then(res => res.json())
                ]);
                [...(movieRes.genres || []), ...(tvRes.genres || [])].forEach(g => genreMap[g.id] = g.name);
            } catch (err) {
                console.error("Failed to load genres:", err);
            }
        }
        
        // --- HOMEPAGE SEARCH DROPDOWN LOGIC ---
        const searchInput = document.querySelector(".search-input");
        const resultsDropdown = document.getElementById("search-results");

        if (searchInput && resultsDropdown) {
            async function searchMulti(query) {
                const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=en-US`;
                try {
                    const res = await fetch(url);
                    const data = await res.json();
                    return data.results || [];
                } catch (err) {
                    return [];
                }
            }

            function showResults(results) {
                resultsDropdown.innerHTML = "";
                const validResults = results.filter(item => ["movie", "tv"].includes(item.media_type) && item.poster_path).slice(0, 6);

                if (validResults.length === 0) {
                    resultsDropdown.style.display = "none";
                    return;
                }

                validResults.forEach(async (item) => {
                    const title = item.title || item.name || "Untitled";
                    const poster = `https://image.tmdb.org/t/p/w92${item.poster_path}`;
                    const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
                    const type = item.media_type === "movie" ? "Movie" : "TV Show";

                    const li = document.createElement("li");
                    li.innerHTML = `
                        <img src="${poster}" alt="${title}">
                        <div class="search-info">
                            <p>${title}</p>
                            <small>${type} | ${year}</small>
                        </div>`;
                    li.addEventListener("click", () => {
                        window.location.href = `/p/details.html?id=${item.id}&type=${item.media_type}`;
                    });
                    resultsDropdown.appendChild(li);
                });
                resultsDropdown.style.display = "block";
            }

            let debounceTimeout;
            searchInput.addEventListener("input", () => {
                const query = searchInput.value.trim();
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(async () => {
                    if (query.length >= 2) {
                        const results = await searchMulti(query);
                        showResults(results);
                    } else {
                        resultsDropdown.style.display = "none";
                    }
                }, 300);
            });
            
            document.addEventListener("click", (e) => {
                if (!e.target.closest(".search-container")) {
                    resultsDropdown.style.display = "none";
                }
            });
        }

        // --- DEDICATED LIBRARY PAGE LOGIC ---
        const libraryContainer = document.getElementById("library");
        if (libraryContainer) {
            let currentPage = 1;
            let totalPages = 1;
            let isLoading = false;
            let debounceTimer;

            const searchBar = document.getElementById("search-bar");
            const container = document.getElementById("library-content");
            const typeFilter = document.getElementById("type-filter");
            const statusFilter = document.getElementById("status-filter");
            const yearFilter = document.getElementById("year-filter");
            const genreFilter = document.getElementById("genre-filter");
            const countryFilter = document.getElementById("country-filter");
            const ratingFilter = document.getElementById("rating-filter");

            function initFilters() {
                const currentYear = new Date().getFullYear();
                for (let y = currentYear; y >= 1950; y--) {
                    yearFilter.innerHTML += `<option value="${y}">${y}</option>`;
                }
                genreFilter.innerHTML += Object.entries(genreMap).map(([id, name]) => `<option value="${id}">${name}</option>`).join("");

                [typeFilter, statusFilter, yearFilter, genreFilter, countryFilter, ratingFilter].forEach(el => {
                    el.addEventListener("change", () => {
                        currentPage = 1;
                        loadLibrary(true);
                    });
                });
            }

            function loadLibrary(reset = false) {
                if (isLoading) return;
                isLoading = true;
                if (reset) container.innerHTML = "";

                const type = typeFilter.value;
                const year = yearFilter.value;
                const genre = genreFilter.value;
                const country = countryFilter.value;
                const query = searchBar.value.trim();
                const rating = ratingFilter.value;
                const isSearch = query.length >= 2;

                let url = isSearch
                    ? `https://api.themoviedb.org/3/search/${type}?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${currentPage}`
                    : `https://api.themoviedb.org/3/discover/${type}?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&page=${currentPage}`;

                if (rating) url += `&vote_average.gte=${rating}`;
                if (!isSearch) {
                    if (year) url += `&primary_release_year=${year}`;
                    if (genre) url += `&with_genres=${genre}`;
                    if (country) url += `&with_origin_country=${country}`;
                }

                fetch(url).then(res => res.json()).then(data => {
                    if (!data.results || data.results.length === 0) {
                        if (currentPage === 1) container.innerHTML = "<p>No results found.</p>";
                        isLoading = false;
                        return;
                    }
                    totalPages = data.total_pages;
                    const content = data.results.map((item, index) => {
                        const title = item.title || item.name || "Untitled";
                        const itemYear = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
                        const itemRating = item.vote_average ? item.vote_average.toFixed(1) : "N/A";
                        const itemGenres = (item.genre_ids || []).map(id => genreMap[id]).filter(Boolean).join(", ") || "N/A";
                        const overview = item.overview ? item.overview.slice(0, 160) + "…" : "No overview available.";
                        const rank = ((currentPage - 1) * 20) + index + 1;
                        return `
                        <div class="movie-card" data-id="${item.id}" data-type="${type}">
                            <div class="movie-thumbnail">
                              <img src="${item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'https://i.imgur.com/YyHsyEr.png'}" alt="${title}">
                              <div class="movie-rank rank-${rank <= 10 ? rank : 'default'}">${rank}</div>
                            </div>
                            <div class="movie-info">
                              <div>
                                <div class="movie-title">${title}</div>
                                <div class="movie-meta">${type.charAt(0).toUpperCase() + type.slice(1)} • ${itemRating} • ${itemYear}</div>
                                <div class="movie-genres"><span>${itemGenres}</span></div>
                                <div class="movie-overview">${overview}</div>
                              </div>
                              <div class="movie-actions">
                               <button class="play-button" onclick="window.location.href='/p/details.html?id=${item.id}&type=${type}'">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M18.89 12.85c-.35 1.34-2.02 2.29-5.36 4.19-3.23 1.84-4.84 2.76-6.14 2.42a4.3 4.3 0 0 1-1.42-.84C5 17.61 5 15.74 5 12s0-5.61.97-6.58c.4-.4.9-.69 1.43-.83 1.3-.37 2.91.55 6.14 2.4 3.34 1.9 5.01 2.85 5.36 4.19.15.55.15 1.14 0 1.67Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>
                                  Play
                                </button>
                              </div>
                            </div>
                          </div>`;
                    }).join("");
                    container.insertAdjacentHTML("beforeend", content);
                    isLoading = false;
                }).catch(err => {
                    container.innerHTML = "<p>Error loading content.</p>";
                    console.error(err);
                    isLoading = false;
                });
            }

            function handleScroll() {
                if (isLoading || currentPage >= totalPages) return;
                if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 400) {
                    currentPage++;
                    loadLibrary();
                }
            }
            
            initFilters();
            loadLibrary(true);
            window.addEventListener("scroll", handleScroll);
            searchBar.addEventListener("input", () => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    currentPage = 1;
                    loadLibrary(true);
                }, 400);
            });
        }
        
        // --- INITIALIZATION ---
        // Load genres once, then initialize the relevant components
        loadGenres().then(() => {
            if (libraryContainer) {
                // We are on the library page, initialize its filters
                initializeLibrary(API_KEY);
            }
        });
    }

    // --- API KEY WAITING LOGIC ---
    function waitForApiKey() {
        let attempts = 0;
        const maxAttempts = 50;
        const interval = setInterval(() => {
            if (window.apiKey) {
                clearInterval(interval);
                initializeSearchAndLibrary(window.apiKey);
            } else if (attempts++ >= maxAttempts) {
                clearInterval(interval);
                console.error("API Key (window.apiKey) was not found. Search/Library will not function.");
            }
        }, 100);
    }

    waitForApiKey();
});
