document.addEventListener('DOMContentLoaded', function() {
  // Configuration
  const productsPerPage = 3; // Show 3 products per page
  const productCards = document.querySelectorAll('.produk-card');
  const totalProducts = productCards.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pageNumbersContainer = document.querySelector('.page-numbers');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  
  let currentPage = 1;

  // Initialize pagination
  function initPagination() {
    // Create page number buttons
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
    
    updateProductVisibility();
    updatePaginationButtons();
  }

  // Show products for current page
  function updateProductVisibility() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    
    productCards.forEach((card, index) => {
      if (index >= startIndex && index < endIndex) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Update pagination button states
  function updatePaginationButtons() {
    // Update active state of page buttons
    const pageBtns = document.querySelectorAll('.page-numbers .page-btn');
    pageBtns.forEach((btn, index) => {
      if (index + 1 === currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    
    // Update prev/next buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
  }

  // Go to specific page
  function goToPage(page) {
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    updateProductVisibility();
    updatePaginationButtons();
  }

  // Event listeners for prev/next buttons
  prevBtn.addEventListener('click', () => goToPage(currentPage - 1));
  nextBtn.addEventListener('click', () => goToPage(currentPage + 1));

  // Initialize
  initPagination();
});