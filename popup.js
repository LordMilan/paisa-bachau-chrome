document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('myForm');
  var input = document.getElementById('myInput');
  var minprice = document.getElementById('minPrice');
  var maxprice = document.getElementById('maxPrice');
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent form submission

    //For Daraz
    // send POST request to localhost:5000/search with search keyword as the request body
    fetch('http://localhost:5000/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKeyword: input.value,
        min_price:  minprice.value,
        max_price: maxprice.value
      })
    })
    .then(response => response.json())
    .then(data => {
      let productsHTML = ''; // Variable to store the HTML for all products
    
      // Iterate over each product in the data array
      data.forEach(product => {
        const productName = product.name || "N/A";
        const productUrl = "https:" + (product.productUrl || "N/A");
        const priceShow = product.priceShow || "N/A";
        const discount = product.discount || "N/A";
        const ratingScore = product.ratingScore || "N/A";
        const vendor = product.vendor || "N/A";
    
        // Generate HTML for the current product
        const productHTML = `<tr>
          <td class="product-name"><a href="${productUrl}" target="_blank">${productName}</a></td>
          <td class="product-price">${priceShow}</td>
          <td class="product-discount">${discount}</td>
          <td class="product-rating">${ratingScore}</td>
          <td class="product-vendor">${vendor}</td>
        </tr>`;
    
        productsHTML += productHTML; // Append the HTML for the current product
      });
    
      // Update the daraz_product element with the generated HTML
      daraz_product.innerHTML = `<table class="product-table">
        <tr>
          <th>Product Name</th>
          <th>Price</th>
          <th>Discount</th>
          <th>Rating Score</th>
          <th>Vendor</th>
        </tr>
        ${productsHTML}
      </table>`;
    })
    
    .catch(error => {
      console.error(error);
      daraz_product.textContent = 'An error occurred while retrieving the product information';
    });
  });
});
