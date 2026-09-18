document.addEventListener('DOMContentLoaded', function() {
  const productCards = Array.from(document.querySelectorAll('.produk-card'));
  const productsPerPage = 3;
  const pageNumbersContainer = document.querySelector('.page-numbers');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const searchInput = document.querySelector('.search-bar input');
  const searchBtn = document.querySelector('.search-bar button');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const noResultsMessage = document.createElement('div');

  noResultsMessage.className = 'no-results';
  noResultsMessage.textContent = 'Produk tidak ditemukan';
  noResultsMessage.style.display = 'none';
  noResultsMessage.style.textAlign = 'center';
  noResultsMessage.style.color = '#fff';
  noResultsMessage.style.padding = '30px';
  noResultsMessage.style.fontSize = '1.1rem';
  noResultsMessage.style.fontWeight = '600';
  document.querySelector('.produk-grid').appendChild(noResultsMessage);

  let currentPage = 1;
  let activeCategory = 'Semua Produk';
  let currentKeyword = '';

  function normalizeText(value) {
    return value.toLowerCase().trim();
  }

  function getFilteredProducts() {
    return productCards.filter((card) => {
      const productName = card.dataset.name || card.querySelector('h3')?.textContent || '';
      const category = card.dataset.category || 'Semua Produk';
      const matchesKeyword = !currentKeyword || normalizeText(productName).includes(normalizeText(currentKeyword));
      const matchesCategory = activeCategory === 'Semua Produk' || category === activeCategory;

      return matchesKeyword && matchesCategory;
    });
  }

  function renderPageNumbers(totalPages) {
    pageNumbersContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.className = 'page-btn';
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.classList.add('active');
      }
      pageBtn.addEventListener('click', () => goToPage(i));
      pageNumbersContainer.appendChild(pageBtn);
    }
  }

  function updateProductVisibility() {
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

    if (currentPage > totalPages) {
      currentPage = totalPages;
    }

    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const visibleProducts = filteredProducts.slice(startIndex, endIndex);

    productCards.forEach((card) => {
      card.style.display = 'none';
    });

    if (filteredProducts.length === 0) {
      noResultsMessage.style.display = 'block';
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      renderPageNumbers(1);
      return;
    }

    noResultsMessage.style.display = 'none';
    visibleProducts.forEach((card) => {
      card.style.display = 'block';
    });

    renderPageNumbers(totalPages);
    updatePaginationButtons(totalPages);
  }

  function updatePaginationButtons(totalPages) {
    const pageBtns = document.querySelectorAll('.page-numbers .page-btn');
    pageBtns.forEach((btn, index) => {
      if (index + 1 === currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    prevBtn.disabled = currentPage === 1 || totalPages <= 1;
    nextBtn.disabled = currentPage === totalPages || totalPages <= 1;
  }

  function goToPage(page) {
    const filteredProducts = getFilteredProducts();
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));

    if (page < 1 || page > totalPages) return;

    currentPage = page;
    updateProductVisibility();
  }

  function applySearchAndFilter() {
    currentPage = 1;
    updateProductVisibility();
  }

  searchBtn.addEventListener('click', function() {
    currentKeyword = searchInput.value;
    applySearchAndFilter();
  });

  searchInput.addEventListener('input', function() {
    currentKeyword = searchInput.value;
    applySearchAndFilter();
  });

  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      currentKeyword = searchInput.value;
      applySearchAndFilter();
    }
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', function() {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');
      activeCategory = button.textContent.trim();
      applySearchAndFilter();
    });
  });

  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  updateProductVisibility();
});