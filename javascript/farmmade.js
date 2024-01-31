async function fetchData() {
    try {
        const response = await fetch('https://api-generator.retool.com/bwTQwu/vel');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchFarmJson() {
    try {
        const response = await fetch('./json/farmmade.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching farmmade.json:', error);
        throw error;
    }
}

async function postData(product) {
    try {
        const { image, name, price } = product;

        // Fetch existing data
        const fetchedData = await fetchData();
        console.log('Fetched Data:', fetchedData);

        // Check if a product with the same name already exists
        const existingProduct = fetchedData.find(existingProduct => existingProduct.name === name);
        console.log('Existing Product:', existingProduct);

        if (existingProduct) {
            console.log('Product with the same name already exists. Skipping POST.');
            return; // Exit the function without sending a POST request
        }

        // If product doesn't exist, proceed with the POST request
        const response = await fetch('https://api-generator.retool.com/bwTQwu/vel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image,
                name,
                price,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to send data. Status: ${response.status}`);
        }

        console.log('Data sent successfully');
    } catch (error) {
        console.error('Error posting data:', error);
    }
}


function displayData(data) {
    const products = data.products;
    const productsContainer = document.getElementById('products-container');

    productsContainer.innerHTML = products.map(product => `
        <div class="productgrid">
            <img src="${product.image}" alt="${product.name} Image">
            <h3>${product.name}</h3>
            <p style="font-weight: bold;color: green;">₹${product.price.toFixed(2)}</p>
            <p>Quantity: ${product.quantity}</p>
            <button type="button" class="add-to-cart">Add to Cart</button>
        </div>
    `).join('');

    // Add event listener to handle button clicks
    productsContainer.addEventListener('click', function (event) {
        if (event.target.classList.contains('add-to-cart')) {
            const productDiv = event.target.closest('.productgrid');
            const product = {
                image: productDiv.querySelector('img').src,
                name: productDiv.querySelector('h3').innerText,
                price: parseFloat(productDiv.querySelector('p:nth-child(3)').innerText.replace('₹', '')),
                // Add more properties as needed
            };
            // Post the extracted product details to the API
            postData(product);
        }
    });
}
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const productsContainer = document.getElementById('products-container');
    
    // Event listener for the search input
    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.toLowerCase();
        
        // Fetch data and filter products based on the search term
        fetchFarmJson()
            .then(data => {
                const filteredProducts = data.products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm)
                );
                displayData({ products: filteredProducts });
            })
            .catch(error => console.error('Error filtering data:', error));
    });
});

// Call fetchFarmJson and displayData
fetchFarmJson()
    .then(data => displayData(data))
    .catch(error => console.error('Error displaying data:', error));
