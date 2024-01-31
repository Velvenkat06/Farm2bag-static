 // Function to retrieve and display order details
 function showOrderDetails() {
    // Get the data parameter from the query string
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dataParam = urlParams.get('data');

    if (dataParam) {
        // Parse the data parameter (assumed to be JSON)
        const orderData = JSON.parse(decodeURIComponent(dataParam));

        // Display the order details in a table
        const orderDetailsElement = document.getElementById('orderDetails');
        const table = document.createElement('table');
        table.innerHTML = `
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');

        orderData.forEach(item => {
            const itemName = item.productName;
            const itemQuantity = item.quantity;
            const itemTotal = item.total;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${itemName}</td>
                <td>${itemQuantity}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });

        orderDetailsElement.appendChild(table);
    } else {
        // Display a message if no order data is found
        const orderDetailsElement = document.getElementById('orderDetails');
        orderDetailsElement.innerHTML = '<p>No order details found.</p>';
    }
}

// Call the function to show order details when the page loads
showOrderDetails();