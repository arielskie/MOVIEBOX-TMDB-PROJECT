document.addEventListener("DOMContentLoaded", () => {
    // ===================================================================
    // 1. SHARED GLOBAL CODE & UTILITIES
    // (These are safe to be shared across all pages)
    // ===================================================================

    let toastTimer;

    function setupToastNotification() {
        if (document.getElementById('custom-toast-notification')) return;
        const toastHTML = document.createElement('div');
        toastHTML.id = 'custom-toast-notification';
        document.body.appendChild(toastHTML);
    }

    function showToastNotification(message, type = 'info') {
        const toast = document.getElementById('custom-toast-notification');
        if (!toast) return;
        clearTimeout(toastTimer);
        toast.textContent = message;
        toast.className = 'toast-show ' + type;
        toastTimer = setTimeout(() => {
            toast.className = toast.className.replace('toast-show', '');
        }, 3000);
    }

    function updateBookmarkCount() {
        const countEl = document.getElementById("bookmark-count");
        if (countEl) {
            const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
            countEl.textContent = bookmarks.length;
            countEl.style.display = bookmarks.length > 0 ? 'flex' : 'none';
        }
    }

    function showBookmarks() {
        const bookmarkList = document.getElementById('bookmark-list');
        if (!bookmarkList) return;
        const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
        bookmarkList.innerHTML = bookmarks.length === 0 ? "<li>Your watchlist is empty.</li>" : bookmarks.map((b, i) => `
      <li class="bookmark-item">
        <a href="${b.url}" class="bookmark-link">
          <img src="${b.poster || 'https://i.imgur.com/YyHsyEr.png'}" alt="${b.title}" class="bookmark-thumb">
          <span class="bookmark-title">${b.title}</span>
        </a>
        <button class="delete-bookmark" data-index="${i}" title="Remove">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.84254 5.48939L8.52333 5.80406L7.84254 5.48939ZM8.81802 4.18112L8.31749 3.62258L8.31749 3.62258L8.81802 4.18112ZM10.2779 3.30696L10.5389 4.01009L10.2779 3.30696ZM13.7221 3.30696L13.9831 2.60384V2.60384L13.7221 3.30696ZM16.1575 5.48939L16.8383 5.17471L16.1575 5.48939ZM8.25 7.03259C8.25 6.61367 8.34194 6.19649 8.52333 5.80406L7.16175 5.17471C6.89085 5.76079 6.75 6.39238 6.75 7.03259H8.25ZM8.52333 5.80406C8.70487 5.41133 8.97357 5.04881 9.31855 4.73966L8.31749 3.62258C7.82675 4.06235 7.43251 4.58893 7.16175 5.17471L8.52333 5.80406ZM9.31855 4.73966C9.66369 4.43037 10.0778 4.18126 10.5389 4.01009L10.0169 2.60384C9.38616 2.83798 8.80808 3.18295 8.31749 3.62258L9.31855 4.73966ZM10.5389 4.01009C11.0001 3.8389 11.4968 3.75 12 3.75V2.25C11.3213 2.25 10.6477 2.36972 10.0169 2.60384L10.5389 4.01009ZM12 3.75C12.5032 3.75 12.9999 3.8389 13.4611 4.01009L13.9831 2.60384C13.3523 2.36972 12.6787 2.25 12 2.25V3.75ZM13.4611 4.01009C13.9222 4.18126 14.3363 4.43037 14.6815 4.73966L15.6825 3.62258C15.1919 3.18295 14.6138 2.83798 13.9831 2.60384L13.4611 4.01009ZM14.6815 4.73966C15.0264 5.04881 15.2951 5.41133 15.4767 5.80406L16.8383 5.17471C16.5675 4.58893 16.1733 4.06235 15.6825 3.62258L14.6815 4.73966ZM15.4767 5.80406C15.6581 6.19649 15.75 6.61367 15.75 7.03259H17.25C17.25 6.39238 17.1092 5.7608 16.8383 5.17471L15.4767 5.80406Z" fill="var(--keycolor)"></path><path d="M3 6.28259C2.58579 6.28259 2.25 6.61838 2.25 7.03259C2.25 7.44681 2.58579 7.78259 3 7.78259V6.28259ZM21 7.78259C21.4142 7.78259 21.75 7.44681 21.75 7.03259C21.75 6.61838 21.4142 6.28259 21 6.28259V7.78259ZM5 7.03259V6.28259H4.25V7.03259H5ZM19 7.03259H19.75V6.28259H19V7.03259ZM18.3418 16.8303L19.0624 17.0383L18.3418 16.8303ZM13.724 20.8553L13.8489 21.5949L13.724 20.8553ZM10.276 20.8553L10.401 20.1158L10.401 20.1158L10.276 20.8553ZM10.1183 20.8287L9.9933 21.5682L9.9933 21.5682L10.1183 20.8287ZM5.65815 16.8303L4.93757 17.0383L5.65815 16.8303ZM13.8817 20.8287L13.7568 20.0892L13.8817 20.8287ZM3 7.78259H21V6.28259H3V7.78259ZM13.7568 20.0892L13.599 20.1158L13.8489 21.5949L14.0067 21.5682L13.7568 20.0892ZM10.401 20.1158L10.2432 20.0892L9.9933 21.5682L10.151 21.5949L10.401 20.1158ZM18.25 7.03259V12.1758H19.75V7.03259H18.25ZM5.75 12.1759V7.03259H4.25V12.1759H5.75ZM18.25 12.1758C18.25 13.6806 18.0383 15.1776 17.6212 16.6223L19.0624 17.0383C19.5185 15.4583 19.75 13.8212 19.75 12.1758H18.25ZM13.599 20.1158C12.5404 20.2947 11.4596 20.2947 10.401 20.1158L10.151 21.5949C11.3751 21.8017 12.6248 21.8017 13.8489 21.5949L13.599 20.1158ZM10.2432 20.0892C8.40523 19.7786 6.90157 18.4335 6.37873 16.6223L4.93757 17.0383C5.61878 19.3981 7.58166 21.1607 9.9933 21.5682L10.2432 20.0892ZM6.37873 16.6223C5.9617 15.1776 5.75 13.6806 5.75 12.1759H4.25C4.25 13.8212 4.48148 15.4583 4.93757 17.0383L6.37873 16.6223ZM14.0067 21.5682C16.4183 21.1607 18.3812 19.3981 19.0624 17.0383L17.6212 16.6223C17.0984 18.4335 15.5947 19.7786 13.7568 20.0892L14.0067 21.5682ZM5 7.78259H19V6.28259H5V7.78259Z" fill="#6c6e76"></path><path d="M10 12V16M14 12V16" stroke="var(--keycolor)" stroke-width="1.5" stroke-linecap="round"></path></g></svg>
        </button>
      </li>`).join('');
    }

const bookmarkBtn = document.querySelector('.bookmark-btn');
const bookmarkModal = document.getElementById('bookmark-modal');

if (bookmarkBtn && bookmarkModal) {
    // This listener opens/closes the modal when the main bookmark button is clicked
    bookmarkBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isVisible = bookmarkModal.style.display === 'block';
        bookmarkModal.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
            showBookmarks(); // Populate the list when opening
        }
    });

    // This listener closes the modal ONLY if you click outside of it
    document.addEventListener('click', (e) => {
        if (bookmarkModal.style.display === 'block' && !bookmarkModal.contains(e.target) && !bookmarkBtn.contains(e.target)) {
            bookmarkModal.style.display = 'none';
        }
    });

    // This listener handles clicks INSIDE the modal (specifically for the delete button)
    bookmarkModal.addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.delete-bookmark');
        if (deleteBtn) {
            // *** THE FIX IS HERE ***
            // This stops the click from reaching the 'document' and closing the modal.
            e.stopPropagation();

            const index = parseInt(deleteBtn.getAttribute('data-index'));
            const bookmarks = JSON.parse(localStorage.getItem('abefilm_bookmarks') || '[]');
            bookmarks.splice(index, 1);
            localStorage.setItem('abefilm_bookmarks', JSON.stringify(bookmarks));
            
            // Refresh the list and the count immediately
            showBookmarks();
            updateBookmarkCount();
        }
    });
}

    // ===================================================================
    // 2. HOMEPAGE-SPECIFIC CODE
    // ===================================================================
    function initHomepage(API_KEY) {
        // This is the original, unmodified homepage script logic
        function buildApiUrl(endpoint, apiKey) {
            const baseUrl = "https://api.themoviedb.org/3/";
            const url = new URL(baseUrl + endpoint);
            url.searchParams.set("api_key", apiKey);
            url.searchParams.set("language", "en-US");
            return url.toString();
        }

        function getMediaType(item, endpointPath) {
            if (item.media_type && (item.media_type === 'movie' || item.media_type === 'tv')) {
                return item.media_type;
            }
            if (endpointPath.startsWith("tv/") || endpointPath.startsWith("discover/tv") || endpointPath.startsWith("trending/tv")) {
                return "tv";
            }
            return "movie";
        }

   async function initSlider(rawEndpoint, apiKey) {
    const slider = document.getElementById("tmdb-slider");
    const dotContainer = document.getElementById("slider-dots");
    const sliderTitleEl = document.getElementById("slider-title");

    if (!slider || !dotContainer || !sliderTitleEl) return;
    slider.innerHTML = '';
    dotContainer.innerHTML = '';

    // Helper: Build TMDB API URL
    function buildApiUrl(path, key) {
        const base = 'https://api.themoviedb.org/3/';
        return `${base}${path}?api_key=${key}`;
    }

    // Helper: Determine media type based on endpoint or item
    function getMediaType(item, endpoint) {
        if (item.media_type) return item.media_type;
        if (endpoint.includes('tv')) return 'tv';
        if (endpoint.includes('movie')) return 'movie';
        return 'movie'; // fallback
    }

    // Helper: fetch with timeout
    async function fetchWithTimeout(resource, options = {}) {
        const { timeout = 8000 } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        try {
            const response = await fetch(resource, {
                ...options,
                signal: controller.signal  
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    try {
        const fetchUrl = buildApiUrl(rawEndpoint, apiKey);
        const response = await fetchWithTimeout(fetchUrl);
        if (!response.ok) throw new Error(`Failed to fetch slider data: ${response.status}`);
        const data = await response.json();

        const items = (data.results || []).slice(0, 8);
        if (items.length === 0) {
            slider.innerHTML = "<p>No slider content found.</p>";
            return;
        }

        // Fetch all logos concurrently
        const logosPromises = items.map(async (item) => {
            const mediaType = getMediaType(item, rawEndpoint);
            try {
                const logoUrl = buildApiUrl(`${mediaType}/${item.id}/images`, apiKey) + '&include_image_language=en,null';
                const logoRes = await fetchWithTimeout(logoUrl);
                if (!logoRes.ok) throw new Error(`Logo fetch failed: ${logoRes.status}`);
                const logoData = await logoRes.json();

                if (logoData.logos && logoData.logos.length) {
                    // Prioritize English logos with highest vote_average
                    let englishLogos = logoData.logos.filter(l => l.iso_639_1 === 'en');
                    if (englishLogos.length === 0) englishLogos = logoData.logos;

                    englishLogos.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
                    return englishLogos[0].file_path || null;
                }
                return null;
            } catch (e) {
                console.warn(`Failed to fetch logos for item ${item.id}`, e);
                return null;
            }
        });

        const logos = await Promise.all(logosPromises);

        const titles = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const mediaType = getMediaType(item, rawEndpoint);
            const title = item.title || item.name || "Untitled";
            const backdrop = item.backdrop_path;

            if (!backdrop) continue;

            const bestLogoPath = logos[i];

            const dynamicLink = `${window.location.origin}/p/details.html?id=${item.id}&type=${mediaType}`;
            const slide = document.createElement("a");
            slide.className = "slide";
            slide.href = dynamicLink;
            slide.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${backdrop})`;

            const captionContent = bestLogoPath
                ? `<img class="logo-title" src="https://image.tmdb.org/t/p/w500${bestLogoPath}" alt="${title} Logo" />`
                : `<h2>${title}</h2>`;

            slide.innerHTML = `<div class="slide-caption">${captionContent}</div>`;
            slider.appendChild(slide);

            titles.push(title);

            const thumb = document.createElement("div");
            thumb.className = "thumbnail-dot";
            thumb.setAttribute("data-index", i);
            thumb.style.backgroundImage = `url(https://image.tmdb.org/t/p/w300${backdrop})`;
            thumb.onclick = () => showSlide(i);
            dotContainer.appendChild(thumb);
        }

        const slides = slider.querySelectorAll(".slide");
        const dots = dotContainer.querySelectorAll(".thumbnail-dot");
        let index = 0;
        let sliderInterval;

        function showSlide(i) {
            index = i;
            slides.forEach((s, j) => s.style.display = j === i ? "block" : "none");
            dots.forEach((d, j) => d.classList.toggle("active", j === i));
            sliderTitleEl.textContent = titles[i] || '';
            if (sliderInterval) clearInterval(sliderInterval);
            sliderInterval = setInterval(() => changeSlide(1), 5000);
        }

        window.changeSlide = (dir) => {
            index = (index + dir + slides.length) % slides.length;
            showSlide(index);
        };

        if (slides.length > 0) showSlide(0);

        // Swipe functionality
        let touchStartX = 0, touchEndX = 0, touchStartY = 0, touchEndY = 0;
        const swipeThreshold = 50;

        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            const diffX = touchEndX - touchStartX;
            const diffY = touchEndY - touchStartY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                e.preventDefault();
                if (diffX < 0) window.changeSlide(1);
                else window.changeSlide(-1);
            }
        });

    } catch (err) {
        console.error("Failed to load slider content:", err);
        slider.innerHTML = "<p style='color:red;'>Error loading slider.</p>";
    }
}


        function initContentRows(apiKey, loaderLogoUrl) {
            document.querySelectorAll(".widget-content").forEach((contentEl) => {
                const parentWidget = contentEl.closest(".widget");
                if (!parentWidget || ["HTML01", "Text1", "Text2"].includes(parentWidget.id)) return;

                const endpointPath = contentEl.textContent.trim();
                if (!endpointPath || endpointPath.includes(" ") || endpointPath.startsWith("http")) return;

                const wrapper = document.createElement("div");
                wrapper.className = "tmdb-wrapper";
                const displayEl = document.createElement("div");
                displayEl.className = "tmdb-row";
                displayEl.innerHTML = [...Array(7)].map(() =>
                    `<div class="tmdb-card shimmer-card"><div class="tmdb-thumb shimmer"><img src="${loaderLogoUrl}" class="tmdb-logo" alt="Logo" /></div><div class="tmdb-title shimmer"></div></div>`
                ).join("");
                wrapper.appendChild(displayEl);
                contentEl.insertAdjacentElement("afterend", wrapper);

                const observer = new IntersectionObserver(async (entries, obs) => {
                    for (const entry of entries) {
                        if (!entry.isIntersecting) continue;
                        obs.unobserve(entry.target);
                        try {
                            const fetchUrl = buildApiUrl(endpointPath, apiKey);
                            const res = await fetch(fetchUrl);
                            const data = await res.json();
                            const results = data.results || [];

                            if (results.length === 0) { displayEl.innerHTML = "<p>No results found.</p>"; return; }

                            setTimeout(() => {
                                displayEl.innerHTML = results.slice(0, 14).map(item => {
                                    const mediaType = getMediaType(item, endpointPath);
                                    const title = item.title || item.name || "Untitled";
                                    const image = item.poster_path;
                                    if (!image) return '';

                                    const year = (item.release_date || item.first_air_date || "").split("-")[0] || "N/A";
                                    const rating = item.vote_average?.toFixed(1) || "N/A";
                                    const dynamicLink = `${window.location.origin}/p/details.html?id=${item.id}&type=${mediaType}`;

                                    return `<a class="tmdb-card" title="${title}" href="${dynamicLink}"><div class="tmdb-thumb"><img src="https://image.tmdb.org/t/p/w300${image}" alt="${title}" loading="lazy" /><div class="hover-overlay"></div><span class="tmdb-meta tmdb-year">${year}</span><span class="tmdb-meta tmdb-rating"><i class="bi bi-star"></i> ${rating}</span><div class="play-btn"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="var(--keycolor)"/><path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="#FFFFFF"/></svg></div></div><div class="tmdb-title">${title}</div></a>`;
                                }).join("");

                                if (displayEl.innerHTML.trim() !== "") {
                                    const leftBtn = document.createElement("button"); leftBtn.className = "tmdb-scroll left"; leftBtn.innerHTML = "&#8249;";
                                    const rightBtn = document.createElement("button"); rightBtn.className = "tmdb-scroll right"; rightBtn.innerHTML = "&#8250;";
                                    wrapper.prepend(leftBtn);
                                    wrapper.append(rightBtn);
                                    const scrollStep = () => displayEl.querySelector(".tmdb-card")?.offsetWidth + 10 || 300;
                                    leftBtn.onclick = () => displayEl.scrollBy({ left: -scrollStep() * 2, behavior: "smooth" });
                                    rightBtn.onclick = () => displayEl.scrollBy({ left: scrollStep() * 2, behavior: "smooth" });
                                }
                            }, 500);
                        } catch (err) { displayEl.innerHTML = "<p style='color:red;'>Failed to load data.</p>"; console.error(err); }
                    }
                }, { threshold: 0.1, rootMargin: '150px 0px' });
                observer.observe(wrapper);
            });
        }
        
        const endpointEl = document.querySelector("#Text1 .widget-content");
        const loaderLogoEl = document.querySelector("#Text2 .widget-content");
        const loaderLogoUrl = loaderLogoEl?.textContent.trim() || "";
        const sliderEndpoint = endpointEl?.textContent.trim();

        if (sliderEndpoint) {
            initSlider(sliderEndpoint, apiKey);
        } else {
            console.warn("Slider endpoint is missing. Slider will not load.");
        }
        initContentRows(apiKey, loaderLogoUrl);
    }

// ===================================================================
    // 3. DETAILS PAGE-SPECIFIC CODE (REWRITTEN FOR CORRECTNESS AND CLARITY)
    // ===================================================================
    function initDetailsPage(API_KEY) {
        const endpointEl = document.querySelector("#Text1 .widget-content");
        const BASE_URL = endpointEl?.textContent.trim() || "https://api.themoviedb.org/3";
        const IMG_URL = 'https://image.tmdb.org/t/p/w500';
        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");
        const type = params.get("type") || "movie";
        const container = document.getElementById("movie-details-container");

        let originalShowData = {};
        let allSeasonsData = [];

        async function fetchData(contentId, contentType) {
            if (!contentId || !contentType) {
                container.innerHTML = "<p>Missing content ID or type.</p>";
                return;
            }
            try {
                container.innerHTML = `<div class="loading-placeholder" style="height: 80vh; width: 100%;"></div>`;

                const detailRes = await fetch(`${BASE_URL}/${contentType}/${contentId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,release_dates,content_ratings`);
                if (!detailRes.ok) throw new Error('Failed to fetch content details.');
                const data = await detailRes.json();
                
                // Store base data for TV shows on the first load of the page
                if (contentType === 'tv' && !originalShowData.id) {
                    originalShowData = {
                        id: data.id,
                        title: data.name,
                        poster_path: data.poster_path,
                        year: (data.first_air_date || "").split("-")[0]
                    };
                    allSeasonsData = data.seasons || [];
                }

                renderFullPage(data);

            } catch (err) {
                container.innerHTML = "<p>Error fetching details.</p>";
                console.error(err);
            }
        }

        function renderFullPage(data) {
            const certification = getCertification(data);
            
            // Render the main static structure
            renderDetails(data, certification);

            // Render dynamic/interactive parts
            if (data.seasons) { // It's a TV show
                renderSeasonButtons();
                const initialSeason = allSeasonsData.find(s => s.season_number > 0) || allSeasonsData[0];
                if (initialSeason) {
                    updateViewForSeason(initialSeason.season_number);
                }
            } else if (data.belongs_to_collection) { // It's a movie in a collection
                renderMovieCollection(data.belongs_to_collection.id, data.id);
            } else { // It's a standalone movie
                renderSingleMovieView(data.id);
            }
            
            renderCast(data.credits);
            fetchRecommendations(data.id, data.title ? 'movie' : 'tv');
        }

        function renderDetails(data, certification) {
            const title = data.title || data.name;
            const year = (data.release_date || data.first_air_date || "").split("-")[0] || "N/A";
            const genres = data.genres?.map(g => g.name).join('<span>|</span>') || "N/A";
            const overview = data.overview || "No synopsis available.";
            const poster = data.poster_path ? `${IMG_URL}${data.poster_path}` : "https://i.imgur.com/YyHsyEr.png";
            const backdrop = data.backdrop_path ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` : "";

            container.innerHTML = `
                <div class="detail-wrap" style="--backdrop-url: url('${backdrop}')">
                    <div class="info-rating-wrapper">
                        <div class="poster"><img id="detail-poster" src="${poster}" alt="${title}"></div>
                        <div class="info">
                            <h1 id="detail-title">${title}</h1>
                            <div class="meta">
                                <span>${data.seasons ? 'TV' : 'Movie'}</span> | 
                                <span id="detail-year">${year}</span> | 
                                <span>${certification}</span> | 
                                <span>${genres}</span>
                            </div>
                            <p class="tagline">${overview}</p>
                            <div class="buttons">
                                <button class="watch watch-now-btn"><i class="bi bi-play-fill"></i> Watch Now</button>
                                <button class="bookmark"><i class="bi bi-bookmark"></i> Add to Watchlist</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="episode-placeholder" id="section-episodes"><h3>Episodes</h3><div class="episode-wrapper"><div id="season-buttons" class="season-wrap"></div><div id="episode-buttons" class="episode-wrap"></div></div></div>
                <div class="details-extra-section"><div class="left-column" id="cast-list-container"></div><div class="right-column"><h3>More Like This</h3><div id="more-like-grid"></div></div></div>`;

            container.querySelector('.watch-now-btn').addEventListener('click', goToPlayer);
            container.querySelector('.bookmark').addEventListener('click', () => bookmarkItem(data));
        }

        function renderSeasonButtons() {
            const seasonBtnWrap = document.getElementById("season-buttons");
            if (!seasonBtnWrap) return;
            seasonBtnWrap.innerHTML = allSeasonsData
                .filter(s => s.season_number > 0)
                .map(s => `<button class="ep-btn season-btn" data-season-number="${s.season_number}">S${s.season_number}</button>`)
                .join('');
            seasonBtnWrap.querySelectorAll('.season-btn').forEach(btn => {
                btn.addEventListener('click', () => updateViewForSeason(btn.dataset.seasonNumber));
            });
        }

        function updateViewForSeason(seasonNum) {
            const seasonData = allSeasonsData.find(s => s.season_number == seasonNum);
            if (!seasonData) return;

            document.getElementById("detail-poster").src = seasonData.poster_path ? `${IMG_URL}${seasonData.poster_path}` : `${IMG_URL}${originalShowData.poster_path}`;
            document.getElementById("detail-year").textContent = seasonData.air_date ? seasonData.air_date.split('-')[0] : originalShowData.year;
            document.getElementById("detail-title").textContent = `${originalShowData.title} - ${seasonData.name}`;

            const watchBtn = container.querySelector('.watch-now-btn');
            watchBtn.dataset.type = 'tv';
            watchBtn.dataset.id = originalShowData.id;
            watchBtn.dataset.season = seasonNum;

            document.querySelectorAll(".season-btn").forEach(btn => btn.classList.remove('active'));
            document.querySelector(`.season-btn[data-season-number="${seasonNum}"]`).classList.add('active');
            
            renderEpisodesForSeason(originalShowData.id, seasonNum);
        }

        async function renderEpisodesForSeason(showId, seasonNum) {
            const episodeWrap = document.getElementById("episode-buttons");
            episodeWrap.innerHTML = '<span>Loading...</span>';
            const res = await fetch(`${BASE_URL}/tv/${showId}/season/${seasonNum}?api_key=${API_KEY}&language=en-US`);
            const data = await res.json();
            episodeWrap.innerHTML = (data.episodes || [])
                .map(ep => `<a class="btn episode-btn" href="/p/player.html?id=${showId}&type=tv&season=${seasonNum}&ep=${ep.episode_number}">${String(ep.episode_number).padStart(2, '0')}</a>`)
                .join('');
        }
        
        async function renderMovieCollection(collectionId, currentMovieId) {
            const res = await fetch(`${BASE_URL}/collection/${collectionId}?api_key=${API_KEY}`);
            const collectionData = await res.json();
            const parts = (collectionData.parts || []).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
            
            const seasonBtnWrap = document.getElementById("season-buttons");
            seasonBtnWrap.innerHTML = parts
                .map((part, i) => `<a href="/p/details.html?id=${part.id}&type=movie" class="ep-btn season-btn ${part.id == currentMovieId ? 'active' : ''}">Part ${i + 1}</a>`)
                .join('');
            
            renderSingleMovieView(currentMovieId);
        }

        function renderSingleMovieView(movieId) {
            document.getElementById("episode-buttons").innerHTML = `<a class="btn episode-btn" href="/p/player.html?id=${movieId}&type=movie">01</a>`;
            const watchBtn = container.querySelector('.watch-now-btn');
            watchBtn.dataset.type = 'movie';
            watchBtn.dataset.id = movieId;
        }

        function goToPlayer() {
            const btn = container.querySelector('.watch-now-btn');
            const mediaType = btn.dataset.type;
            const contentId = btn.dataset.id;
            if (!mediaType || !contentId) return;

            if (mediaType === 'tv') {
                const season = btn.dataset.season || '1';
                window.location.href = `/p/player.html?id=${contentId}&type=tv&season=${season}&ep=1`;
            } else {
                window.location.href = `/p/player.html?id=${contentId}&type=movie`;
            }
        }
        
        function bookmarkItem(data) {
            const bookmarks = JSON.parse(localStorage.getItem("abefilm_bookmarks") || "[]");
            const itemType = data.seasons ? 'tv' : 'movie';
            if (bookmarks.some(item => item.id == data.id)) {
                showToastNotification("Already on your watchlist", 'info');
                return;
            }
            bookmarks.push({ id: data.id, type: itemType, title: data.title || data.name, poster: data.poster_path ? IMG_URL + data.poster_path : '', url: window.location.href });
            localStorage.setItem("abefilm_bookmarks", JSON.stringify(bookmarks));
            showToastNotification("Added to Watchlist", 'success');
            updateBookmarkCount();
        }

        function getCertification(data) {
            const contentType = data.seasons ? 'tv' : 'movie';
            if (contentType === "movie") {
                const us = data.release_dates?.results.find(r => r.iso_3166_1 === "US");
                return us?.release_dates?.[0]?.certification || "NR";
            } else {
                const us = data.content_ratings?.results.find(r => r.iso_3166_1 === "US");
                return us?.rating || "NR";
            }
        }

        function renderCast(credits) {
            const castContainer = document.getElementById("cast-list-container");
            const cast = credits?.cast?.slice(0, 15) || [];
            if (castContainer && cast.length > 0) {
                castContainer.innerHTML = `<h3>Top Cast</h3><div class="cast-scroll">${cast.map(c => `<div class="cast-card"><img src="${c.profile_path ? IMG_URL + c.profile_path : 'https://i.imgur.com/obaaZjk.png'}" alt="${c.name}"><div>${c.name}</div><small>${c.character}</small></div>`).join('')}</div>`;
            }
        }

        async function fetchRecommendations(recId, recType) {
            const wrap = document.getElementById("more-like-grid");
            if (!wrap) return;
            try {
                const res = await fetch(`${BASE_URL}/${recType}/${recId}/recommendations?api_key=${API_KEY}&language=en-US`);
                const data = await res.json();
                if (!data.results || data.results.length === 0) {
                    wrap.innerHTML = "<p>No recommendations available.</p>"; return;
                }
                wrap.innerHTML = data.results.slice(0, 6).map(item => {
                    const itemType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                    return `<a class="more-like-item" href="/p/details.html?id=${item.id}&type=${itemType}"><img src="${item.poster_path ? IMG_URL + item.poster_path : 'https://i.imgur.com/YyHsyEr.png'}" alt="${item.title || item.name}"><p>${item.title || item.name}</p></a>`;
                }).join('');
            } catch (error) { wrap.innerHTML = "<p>Failed to load recommendations.</p>"; }
        }

        fetchData(id, type);
    }
    
    // ===================================================================
    // 4. PLAYER PAGE-SPECIFIC CODE
    // ===================================================================
    function initPlayerPage(API_KEY) {
        // This is the original, unmodified player script logic
        // *** FIX: The initial `if` check is REMOVED from here, as the main router now handles it. ***
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");
        const type = urlParams.get("type");
        if (!id || !type) { document.body.innerHTML = "<p style='color:white; text-align:center;'>Missing ID or type in URL.</p>"; return; }
        
        const storageKey = `watch_state_${id}_${type}`;

        function saveWatchState(server, season, episode) { const state = { server, season, episode }; localStorage.setItem(storageKey, JSON.stringify(state)); }
        function loadWatchState() { const data = localStorage.getItem(storageKey); return data ? JSON.parse(data) : null; }
        
        function updateDocumentTitle(id, type, season) {
            fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`).then(res => res.json()).then(data => {
                const title = data.title || data.name || "Untitled";
                const suffix = type === "tv" ? ` S${season}` : "";
                document.title = `${title}${suffix} - Watch Now | AbeFilm`;
            }).catch(err => console.error("Title update failed:", err));
        }

        const playerEl = document.getElementById("video-left");
        const episodeButtons = document.getElementById("player-episode-buttons");
        const serverButtons = document.getElementById("server-buttons");
        const seasonButtons = document.createElement("div");
        seasonButtons.id = "season-buttons"; seasonButtons.classList.add("season-button-container");
        if(serverButtons) serverButtons.insertAdjacentElement("afterend", seasonButtons);

        const savedState = loadWatchState();
        const savedSeason = savedState?.season;
        const seasonParam = parseInt(urlParams.get("season") || savedSeason || "1");
        const epParam = parseInt(urlParams.get("ep") || savedState?.episode || "1");
        let currentEpisode = savedState?.episode || epParam;
        let currentServer = savedState?.server || null;
        let servers = {};

        function loadServerTemplates() {
            const serverSection = document.getElementById("video-sources");
            if (!serverSection) return;
            const widgets = serverSection.querySelectorAll(".widget");
            widgets.forEach(widget => {
                const title = widget.querySelector(".widget-title, .title")?.textContent.trim().toLowerCase();
                const content = widget.querySelector(".widget-content")?.textContent.trim();
                if (title && content) {
                    const lines = content.split("\n").map(line => line.trim()).filter(Boolean);
                    let movieTemplate = null, tvTemplate = null;
                    for (const line of lines) {
                        if (/\${episode}/.test(line)) tvTemplate = line;
                        else if (/\${id}/.test(line)) movieTemplate = line;
                    }
                    servers[title] = {
                        movie: id => movieTemplate ? movieTemplate.replace(/\$\{id\}/g, id) : "",
                        tv: (id, season, episode) => tvTemplate ? tvTemplate.replace(/\$\{id\}/g, id).replace(/\$\{season\}/g, season).replace(/\$\{episode\}/g, episode) : ""
                    };
                }
            });
        }

        function setIframeSrc(episode = 1) {
            currentEpisode = episode;
            const server = servers[currentServer];
            if (!server || !playerEl) return;
            const src = type === "movie" ? server.movie(id) : server.tv(id, seasonParam, episode);
            playerEl.innerHTML = src ? `<iframe src="${src}" frameborder="0" allowfullscreen loading="lazy" style="width:100%;height:100%;max-height:100vh;"></iframe>` : `<p style='color:white'>Invalid or missing source URL.</p>`;
        }

        function createServerButtons() {
            if(!serverButtons) return;
            Object.keys(servers).forEach(key => {
                const btn = document.createElement("button");
                btn.textContent = key.toUpperCase();
                btn.className = "server-btn";
                if (!currentServer) currentServer = key;
                if (key === currentServer) btn.classList.add("active");
                btn.addEventListener("click", () => {
                    document.querySelectorAll(".server-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    currentServer = key;
                    saveWatchState(currentServer, seasonParam, currentEpisode);
                    setIframeSrc(currentEpisode);
                });
                serverButtons.appendChild(btn);
            });
        }

        function createEpisodeButtons(totalEpisodes) {
            if(!episodeButtons) return;
            episodeButtons.innerHTML = '';
            for (let i = 1; i <= totalEpisodes; i++) {
                const btn = document.createElement("button");
                btn.textContent = `${i}`; btn.className = "player-episode-btn";
                btn.addEventListener("click", () => {
                    document.querySelectorAll(".player-episode-btn").forEach(b => b.classList.remove("active"));
                    btn.classList.add("active");
                    saveWatchState(currentServer, seasonParam, i);
                    setIframeSrc(i);
                });
                episodeButtons.appendChild(btn);
            }
            const episodeBtns = episodeButtons.querySelectorAll(".player-episode-btn");
            const targetBtn = episodeBtns[epParam - 1] || episodeBtns[0];
            if (targetBtn) targetBtn.classList.add("active");
            setIframeSrc(epParam);
        }

        function createMovieEpisodeDummy() {
            if(!episodeButtons) return;
            episodeButtons.innerHTML = '';
            const btn = document.createElement("button");
            btn.textContent = "1"; btn.className = "player-episode-btn active";
            episodeButtons.appendChild(btn);
        }

        function populateFooter(info) {
            const footer = document.getElementById("footer-bottom");
            if (!footer) return;
            const { title, name, overview, genres, status, vote_average, first_air_date, release_date, number_of_episodes } = info;
            const typeText = number_of_episodes ? "TV" : "Movie";
            let year = (release_date || first_air_date || "").split("-")[0];
            if (type === "tv" && info?.seasons && seasonParam) {
                const selectedSeason = info.seasons.find(season => season.season_number == seasonParam);
                if (selectedSeason?.air_date) year = selectedSeason.air_date.split("-")[0];
            }
            const rating = vote_average ? vote_average.toFixed(1) : "N/A";
            const genreList = genres?.map(g => g.name).join(", ") || "Unknown";
            const statusText = status || "Unknown";
            const cert = info.certification || info.content_ratings?.results?.find(c => c.iso_3166_1 === "US")?.rating || "NR";
            footer.innerHTML = `<div class="footer-left"><div class="footer-title-rating"><strong>${(title || name || "Untitled")}${number_of_episodes ? ` S${seasonParam}` : ""} (${year})</strong></div><div class="footer-meta"><span class="footer-rating">⭐ ${rating}</span><span class="type-meta">${typeText}</span> • <span>${statusText}</span> • <span>Rated: ${cert}</span></div><div class="footer-genres"><strong>Genres:</strong> ${genreList}</div><div class="footer-overview">${overview || "No overview available."}</div><span class="read-more-toggle">More</span></div><div class="footer-right"><h3>Recommended</h3><div class="recommendation-grid"></div></div>`;
            const overviewEl = footer.querySelector(".footer-overview");
            const toggleBtn = footer.querySelector(".read-more-toggle");
            if (overviewEl && toggleBtn && window.innerWidth <= 768) {
                toggleBtn.addEventListener("click", () => {
                    overviewEl.classList.toggle("expanded");
                    toggleBtn.textContent = overviewEl.classList.contains("expanded") ? "Less" : "More";
                });
            }
            fetch(`https://api.themoviedb.org/3/${number_of_episodes ? "tv" : "movie"}/${info.id}/credits?api_key=${API_KEY}`).then(res => res.json()).then(data => {
                const cast = data.cast?.slice(0, 6);
                if (cast?.length > 0) {
                    const castWrapper = document.createElement("div");
                    castWrapper.className = "footer-cast-scroll-wrapper";
                    castWrapper.innerHTML = `<h4>Cast</h4><div class="cast-scroll-wrapper"><button class="cast-scroll-btn left" aria-label="Scroll Left">‹</button><div class="cast-scroll">${cast.map(actor => { const img = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : "https://i.imgur.com/obaaZjk.png"; return `<div class="cast-card"><img src="${img}" alt="${actor.name}" onerror="this.onerror=null;this.src='https://i.imgur.com/obaaZjk.png';"><div class="cast-name">${actor.name}</div><div class="cast-role">${actor.character}</div></div>`; }).join("")}</div><button class="cast-scroll-btn right" aria-label="Scroll Right">›</button></div>`;
                    footer.querySelector(".footer-left").appendChild(castWrapper);
                }
            }).catch(err => console.error("Cast Fetch Error:", err));
        }

        function fetchRecommendations(id, type) {
            const container = document.querySelector(".recommendation-grid");
            if (!container) return;
            const endpoint = `https://api.themoviedb.org/3/${type}/${id}/recommendations?api_key=${API_KEY}`;
            fetch(endpoint).then(res => res.json()).then(data => {
                const results = data.results?.slice(0, 6);
                if (!results || results.length === 0) { container.innerHTML = "<p style='color:#ccc'>No recommendations available.</p>"; return; }
                container.innerHTML = results.map(item => {
                    const title = item.title || item.name || "Untitled";
                    const poster = item.poster_path ? `https://image.tmdb.org/t/p/w185${item.poster_path}` : "https://i.imgur.com/YyHsyEr.png";
                    const mediaType = item.media_type || (item.first_air_date ? 'tv' : 'movie');
                    return `<div class="rec-item"><a href="/p/player.html?id=${item.id}&type=${mediaType}"><div class="rec-thumb"><img src="${poster}" alt="${title}" onerror="this.onerror=null;this.src='https://i.imgur.com/YyHsyEr.png';"><div class="abefilm-hover-overlay"></div><div class="abefilm-play-button"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="var(--keycolor)"/><path d="M15.4137 13.059L10.6935 15.8458C9.93371 16.2944 9 15.7105 9 14.7868V9.21316C9 8.28947 9.93371 7.70561 10.6935 8.15419L15.4137 10.941C16.1954 11.4026 16.1954 12.5974 15.4137 13.059Z" fill="#FFFFFF"/></svg></div></div><span>${title}</span></a></div>`;
                }).join("");
            }).catch(err => { console.error("Recommendation Fetch Error:", err); container.innerHTML = "<p style='color:#ccc'>Failed to load recommendations.</p>"; });
        }

        updateDocumentTitle(id, type, seasonParam);
        loadServerTemplates();
        if (Object.keys(servers).length > 0) {
            createServerButtons();
            setIframeSrc(currentEpisode);
        } else if (playerEl) {
            playerEl.innerHTML = "<p style='color:white'>No server templates found.</p>";
        }

        if (type === "tv") {
            fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}`).then(res => res.json()).then(info => {
                populateFooter(info);
                fetchRecommendations(info.id, type);
                if (info.seasons && info.seasons.length > 0 && seasonButtons) {
                    seasonButtons.innerHTML = info.seasons.filter(s => s.season_number !== 0).map(s => `<a href="?id=${id}&type=tv&season=${s.season_number}" class="season-btn${s.season_number === seasonParam ? " active" : ""}">${s.name}</a>`).join("");
                }
            });
            fetch(`https://api.themoviedb.org/3/tv/${id}/season/${seasonParam}?api_key=${API_KEY}`).then(res => res.json()).then(data => {
                createEpisodeButtons(data.episodes?.length || 0);
            });
        } else if (type === "movie") {
            fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`).then(res => res.json()).then(info => {
                populateFooter(info);
                fetchRecommendations(info.id, type);
                if (info.belongs_to_collection?.id) {
                    fetch(`https://api.themoviedb.org/3/collection/${info.belongs_to_collection.id}?api_key=${API_KEY}`).then(res => res.json()).then(collection => {
                        if (collection.parts && collection.parts.length > 1 && seasonButtons) {
                            seasonButtons.innerHTML = collection.parts.sort((a, b) => new Date(a.release_date) - new Date(b.release_date)).map((movie, i) => `<a href="?id=${movie.id}&type=movie&part=${i + 1}" class="season-btn${movie.id == id ? " active" : ""}">${'Part ' + (i + 1)}</a>`).join("");
                        }
                    });
                }
            });
            createMovieEpisodeDummy();
            setIframeSrc();
        }
    }


    // ===================================================================
    // 5. MAIN CONTROLLER & APP START
    // ===================================================================

    function initializeApp(apiKey) {
        setupToastNotification();
        updateBookmarkCount();
        
        const path = window.location.pathname;

        if (document.getElementById("tmdb-slider")) {
            console.log("Initializing Homepage...");
            initHomepage(apiKey);
        } else if (path.includes('/p/details.html')) {
            console.log("Initializing Details Page...");
            initDetailsPage(apiKey);
        } else if (path.includes('/p/player.html')) {
            console.log("Initializing Player Page...");
            initPlayerPage(apiKey);
        }
    }

    function waitForApiKey() {
        let attempts = 0;
        const maxAttempts = 50;
        const interval = setInterval(() => {
            if (window.apiKey) {
                clearInterval(interval);
                initializeApp(window.apiKey);
            } else if (attempts++ >= maxAttempts) {
                clearInterval(interval);
                console.error("FATAL: API Key (window.apiKey) was not found. App will not run.");
                const errorTargets = [
                    document.getElementById("tmdb-slider"),
                    document.getElementById("movie-details-container"),
                    document.getElementById("video-left")
                ];
                errorTargets.forEach(el => {
                    if (el) el.innerHTML = "<p style='color:red; text-align:center; padding: 2rem;'>Error: API configuration is missing.</p>";
                });
            }
        }, 100);
    }

    // Start the entire process
    waitForApiKey();
});
