document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('myForm');
  var input = document.getElementById('myInput');
  var minprice = document.getElementById('minPrice');
  var maxprice = document.getElementById('maxPrice');
  var sortButton = document.getElementById('sortButton');
  var sortSelect = document.getElementById('sortSelect');
  var vendorSortSelect = document.getElementById('vendorSortSelect');
  var daraz_product = document.getElementById('daraz_product');
  var loadingDiv = document.getElementById('loadingDiv');
  var pagination = document.getElementById('pagination');
  var currentPage = 1;
  var totalPages = 1;
  const productsPerPage = 10;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    loadingDiv.style.display = 'block';

    fetch('https://api.milanmahat.com.np/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKeyword: input.value,
        min_price: minprice.value,
        max_price: maxprice.value
      })
    })
      .then(response => response.json())
      .then(data => {
        const olddata = data.slice(); // Create a copy of the data array
        const vendorSortOption = vendorSortSelect.value;
        if (vendorSortOption === "daraz") {
          sortByVendor("daraz");
        } else if (vendorSortOption === "sastodeal") {
          sortByVendor("sastodeal");
        } else if (vendorSortOption === "hamrobazzar") {
          sortByVendor("hamrobazzar");
        }
        else {
          data = olddata
        }

        const selectedOption = sortSelect.value;
        if (selectedOption === "lowToHigh") {
          sortByPriceLowToHigh();
        } else if (selectedOption === "highToLow") {
          sortByPriceHighToLow();
        } else {
          sortByPriceLowToHigh();
        }

        function sortByPriceLowToHigh() {
          console.log('Sorting by price Low to high...');
          olddata.forEach(product => {
            let price = String(product.price);
            price = price.replace(/[रूRs]/g, '').replace(/,/g, '').trim();
            product.price = parseFloat(price) || "N/A";
          });

          olddata.sort((a, b) => (typeof a.price === 'number' ? a.price : Infinity) - (typeof b.price === 'number' ? b.price : Infinity));
        }

        function sortByPriceHighToLow() {
          console.log('Sorting by price High To Low...');
          olddata.forEach(product => {
            let price = String(product.price);
            price = price.replace(/[रूRs]/g, '').replace(/,/g, '').trim();
            product.price = parseFloat(price) || "N/A";
          });

          olddata.sort((a, b) => (typeof b.price === 'number' ? b.price : Infinity) - (typeof a.price === 'number' ? a.price : Infinity));
        }

        function sortByVendor(vendor) {
          console.log(`Sorting by ${vendor}...`);
          data = olddata.filter(product => product.vendor === vendor);
        }


        function generateProductHTML(product) {
          const productImage = product.image || "N/A";
          const productName = product.name || "N/A";
          const productUrl = "https:" + (product.productUrl || "N/A");
          const price = product.price || "N/A";
          const discount = product.discount || "N/A";
          const ratingScore = product.ratingScore || "N/A";
          const vendor = product.vendor || "N/A";

          return `<tr>
            <td class="product-image"><img src="${productImage}" alt="${productName}" style="width: 100px; height: 100px;"></td>
            <td class="product-name"><a href="${productUrl}" target="popup" data-product-url="${productUrl}">${productName}</a></td>
            <td class="product-price">Rs ${price.toLocaleString()}</td>
            <td class="product-discount">${discount}</td>
            <td class="product-rating">${ratingScore}</td>
            <td class="product-vendor">${vendor}</td>
          </tr>`;
        }

        function openPopup(event) {
          event.preventDefault();
          const productUrl = event.target.dataset.productUrl;
          window.open(productUrl, 'popup', 'width=600,height=600');
        }

        function displayProducts(pageNumber) {
          currentPage = pageNumber;

          const startIndex = (pageNumber - 1) * productsPerPage;
          const endIndex = pageNumber * productsPerPage;
          const productsSlice = data.slice(startIndex, endIndex);

          let productsHTML = '';

          for (const product of productsSlice) {
            productsHTML += generateProductHTML(product);
          }

          daraz_product.innerHTML = `<table class="product-table">
            <tr>
              <th>Product Image</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Rating Score</th>
              <th>Vendor</th>
            </tr>
            ${productsHTML}
          </table>`;

          generatePaginationLinks();

          const productLinks = daraz_product.querySelectorAll('a[data-product-url]');
          productLinks.forEach(link => {
            link.addEventListener('click', openPopup);
          });
        }

        function generatePaginationLinks() {
          const linksHTML = [];
          const maxDisplayedPages = 5; // Maximum number of pages to be displayed

          let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
          let endPage = startPage + maxDisplayedPages - 1;

          if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxDisplayedPages + 1);
          }

          if (startPage > 1) {
            linksHTML.push('<a href="#" data-page="1">1</a>');
            if (startPage > 2) {
              linksHTML.push('<span>...</span>');
            }
          }

          for (let i = startPage; i <= endPage; i++) {
            if (i === currentPage) {
              linksHTML.push(`<a class="active" data-page="${i}" href="#">${i}</a>`);
            } else {
              linksHTML.push(`<a data-page="${i}" href="#">${i}</a>`);
            }
          }

          if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
              linksHTML.push('<span>...</span>');
            }
            linksHTML.push(`<a href="#" data-page="${totalPages}">${totalPages}</a>`);
          }

          pagination.innerHTML = linksHTML.join(' ');

          const paginationLinks = pagination.querySelectorAll('a[data-page]');
          paginationLinks.forEach(link => {
            link.addEventListener('click', handlePaginationClick);
          });
        }

        function handlePaginationClick(event) {
          event.preventDefault();
          const pageNumber = parseInt(event.target.dataset.page);
          displayProducts(pageNumber);
        }

        function handleSort() {
          const selectedOption = sortSelect.value;
          if (selectedOption === "lowToHigh") {
            sortByPriceLowToHigh();
          } else if (selectedOption === "highToLow") {
            sortByPriceHighToLow();
          }

          const vendorSortOption = vendorSortSelect.value;
          if (vendorSortOption === "daraz") {
            sortByVendor("daraz");
          } else if (vendorSortOption === "sastodeal") {
            sortByVendor("sastodeal");
          } else if (vendorSortOption === "hamrobazzar") {
            sortByVendor("hamrobazzar");
          }
          else {
            data = olddata
          }

          displayProducts(currentPage);

          // Update total pages based on the filtered data
          totalPages = Math.ceil(data.length / productsPerPage);

          // Reset to the first page
          currentPage = 1;

          displayProducts(currentPage);
          generatePaginationLinks();
        }

        const totalCount = data.length;
        totalPages = Math.ceil(totalCount / productsPerPage);

        displayProducts(currentPage);

        sortSelect.addEventListener('change', handleSort);
        vendorSortSelect.addEventListener('change', handleSort);


        loadingDiv.style.display = 'none';
      })
      .catch(error => {
        console.error(error);
        daraz_product.textContent = 'An error occurred while retrieving the product information';
        loadingDiv.style.display = 'none';
      });
  });
});
