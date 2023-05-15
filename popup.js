document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('myForm');
  var input = document.getElementById('myInput');
  var daraz_product = document.getElementById('daraz_product');
  var sastodeal_product = document.getElementById('sastodeal_product');

  const priceRange = document.getElementById("priceRange");
  const priceRangeValue = document.getElementById("priceRangeValue");
  
  priceRange.addEventListener("input", () => {
    const minValue = priceRange.min;
    const maxValue = priceRange.max;
    const value = priceRange.value;
    priceRangeValue.innerText = `${minValue} - ${maxValue}`;
  });
  
  form.addEventListener('submit', function(event) {
    event.preventDefault(); // prevent form submission

    //For Daraz
    // send POST request to localhost:5000/search with search keyword as the request body
    fetch('http://localhost:5000/api/daraz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKeyword: input.value
      })
    })
    .then(response => response.json())
    .then(data => {
          // extract relevant fields from the dictionary and display them in the output element
    const product = data[0];
    const productName = product.name || "null";
    const productUrl = "https:"+product.productUrl || "null";
    const priceShow = product.priceShow || "null";
    const discount = product.discount || "null";
    const ratingScore = product.ratingScore || "null";
    daraz_product.innerHTML = `<table class="product-table">
    <tr>
      <th>Product Name</th>
      <th>Price</th>
      <th>Discount</th>
      <th>Rating Score</th>
    </tr>
    <tr>
      <td class="product-name"><a href="${productUrl}" target="_blank">${productName}</a></td>
      <td class="product-price">${priceShow}</td>
      <td class="product-discount">${discount}</td>
      <td class="product-rating">${ratingScore}</td>
    </tr>
  </table>
    `;
  })
    .catch(error => {
      console.error(error);
      daraz_product.textContent = 'An error occurred while retrieving the product information';
    });

    //For Sastodeal
    // send POST request to localhost:5000/search with search keyword as the request body
    fetch('http://localhost:5000/api/sastodeal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKeyword: input.value
      })
    })
    .then(response => response.json())
    .then(data => {
          // extract relevant fields from the dictionary and display them in the output element
    const product = data[0];
    const productName = product.name || "null";
    const productUrl = "https://"+product.productUrl || "null";
    const priceShow = product.priceShow || "null";
    const discount = product.discount || "null";
    const ratingScore = product.ratingScore || "null";
    sastodeal_product.innerHTML = `<table class="product-table">
    <tr>
      <th>Product Name</th>
      <th>Price</th>
      <th>Discount</th>
      <th>Rating Score</th>
    </tr>
    <tr>
      <td class="product-name"><a href="${productUrl}" target="_blank">${productName}</a></td>
      <td class="product-price">${priceShow}</td>
      <td class="product-discount">${discount}</td>
      <td class="product-rating">${ratingScore}</td>
    </tr>
  </table>
    `;
    })
    .catch(error => {
      console.error(error);
      sastodeal_product.textContent = 'An error occurred while retrieving the product information';
    });

    //For Hamrobazar
    // send POST request to localhost:5000/search with search keyword as the request body
    fetch('http://localhost:5000/api/hamrobazar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKeyword: input.value
      })
    })
    .then(response => response.json())
    .then(data => {
    // extract relevant fields from the dictionary and display them in the output element
    //We are using data[0] to get 1st item only.
    const product = data[0];
    const productName = product.name || "null";
    const productUrl = product.productUrl || "null";
    const priceShow = product.priceShow || "null";
    const discount = product.discount || "null";
    const ratingScore = product.ratingScore || "null";
    hamrobazar_product.innerHTML = `<table class="product-table">
    <tr>
      <th>Product Name</th>
      <th>Price</th>
      <th>Discount</th>
      <th>Rating Score</th>
    </tr>
    <tr>
      <td class="product-name"><a href="${productUrl}" target="_blank">${productName}</a></td>
      <td class="product-price">${priceShow}</td>
      <td class="product-discount">${discount}</td>
      <td class="product-rating">${ratingScore}</td>
    </tr>
  </table>
    `;
    })
    .catch(error => {
      console.error(error);
      // hamrobazar_product.textContent = data;
      hamrobazar_product.textContent = 'An error occurred while retrieving the product information';
    });
  });
});
