async function fetchData() {
    try {
        const response = await fetch('https://api-generator.retool.com/bwTQwu/vel');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const tableBody = document.getElementById('productTableBody');

        data.forEach(product => {
            const image = product.image;
            const name = product.name;
            const price = product.price;

            // Adding values to the table in the HTML
            const row = `
                <tr>
                    <td><img src="${image}" alt="${name}" style="width: 50px;"></td>
                    <td>${name}</td>
                    <td>${price}</td>
                    <td>
                        <button onclick="decrementQuantity(this)">-</button>
                        <span>1</span>
                        <button onclick="incrementQuantity(this)">+</button>
                    </td>
                    <td>${price}.00</td>
                    <td><button onclick="deleteRow(this)">✖️</button></td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function to increment quantity
function incrementQuantity(button) {
    const row = button.parentNode.parentNode;
    const quantityElement = row.querySelector('td:nth-child(4) span');
    let quantity = parseInt(quantityElement.textContent);

    if (quantity < 5) {
        quantity++;
        quantityElement.textContent = quantity;
        updateTotal(row, quantity);
    } else {
        alert("Maximum quantity reached (5)");
    }
}

// Function to decrement quantity
function decrementQuantity(button) {
    const row = button.parentNode.parentNode;
    const quantityElement = row.querySelector('td:nth-child(4) span');
    let quantity = parseInt(quantityElement.textContent);

    if (quantity > 1) {
        quantity--;
        quantityElement.textContent = quantity;
        updateTotal(row, quantity);
    } else {
        alert("Minimum quantity reached (1)");
    }
}

// Function to delete row
// Function to delete row
function deleteRow(button) {
const row = button.parentNode.parentNode;
const productName = row.querySelector('td:nth-child(2)').textContent; // Assuming product name is in the second column

// Make a GET request to fetch product details by name
fetch(`https://api-generator.retool.com/bwTQwu/vel?name=${encodeURIComponent(productName)}`)
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
})
.then(data => {
    // Check if the fetched product name matches the row's product name
    if (data.length > 0 && data[0].name === productName) {
        // Make a DELETE request to the API
        fetch(` https://api-generator.retool.com/bwTQwu/vel/${data[0].id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Add any additional headers if needed
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(deletedData => {
            // Remove the row from the table after successful deletion
            row.remove();
            console.log('Successfully deleted:', deletedData);
        })
        .catch(error => {
            console.error('Error deleting:', error);
        });
    } else {
        console.log('Product not found or names do not match');
    }
})
.catch(error => {
    console.error('Error fetching product details:', error);
});
}


// Function to update total based on quantity
function updateTotal(row, quantity) {
    const price = parseFloat(row.querySelector('td:nth-child(3)').textContent);
    const totalElement = row.querySelector('td:nth-child(5)');
    const total = price * quantity;
    totalElement.textContent = total.toFixed(2);
}

// Call the function to initiate the fetch
fetchData();