
### `/win` Route - Winning a Game

**Purpose**: This endpoint is called when a user wins a game. It processes a deposit to the user's bank account with the won amount.

**HTTP Method**: `POST`

**Input**:
- **Body (JSON)**: The request body must include a JSON object with an `amount` field specifying the winning amount.
  - Example: `{"amount": "100"}`

**Response**:
- **Success**: If the operation is successful, it returns a JSON object with the new balance of the user's bank account.
  - Example: `{"new_balance": 1200}`
  - HTTP Status Code: `200 OK`
- **Error**: If the amount is not provided or an exception occurs, it returns a JSON object with an error message.
  - Example: `{"error": "Amount not provided"}` for missing amount or `{"error": "<exception_message>"}` for other errors.
  - HTTP Status Code: `400 Bad Request` for missing amount, `500 Internal Server Error` for other errors.



### `/lose` Route - Losing a Game

**Purpose**: Handles the case when a user loses a game. It attempts to withdraw the specified amount from the user's account.

**HTTP Method**: `POST`

**Input**:
- **Body (JSON)**: Similar to the `/win` route, it requires a JSON object with an `amount` field indicating how much the user lost.
  - Example: `{"amount": "50"}`

**Response**:
- **Success**: Returns a JSON object with the user's new balance if the withdrawal is successful.
  - Example: `{"new_balance": 1150}`
  - HTTP Status Code: `200 OK`
- **Error**: Returns a JSON object with an error message if the amount is not provided or an exception occurs.
  - Example: `{"error": "Amount not provided"}` or `{"error": "<exception_message>"}`.
  - HTTP Status Code: `400 Bad Request` for missing amount, `500 Internal Server Error` for other errors.



### `/deposit` Route - Making a Deposit

**Purpose**: Allows a user to deposit money into their account.

**HTTP Method**: `POST`

**Input**:
- **Form Data**: Unlike the `/win` and `/lose` routes, this one expects the amount to be provided as form data.
  - Key: `amount`
  - Value: The deposit amount (e.g., `amount=100`).

**Response**:
- **Success**: After successfully processing the deposit, the user is redirected to their profile page, and a success message is flashed.
  - HTTP Status Code: `302 Found` (indicating a redirect to the profile page).
- **Error**: If an exception occurs, the user is redirected to their profile page, and an error message is flashed.
  - HTTP Status Code: `302 Found` (indicating a redirect to the profile page).



### `/win_count` Route - Increment Win Count

**Purpose**: Increments the win count in the user's stats.

**HTTP Method**: `POST`

**Input**: None explicitly required; the operation is performed based on the current authenticated user.

**Response**:
- **Success**: Returns a JSON object indicating success.
  - Example: `{"message": "success"}`
  - HTTP Status Code: `200 OK`
- **Error**: If an exception occurs, it returns a JSON object with an error message.
  - Example: `{"error": "<exception_message>"}`.
  - HTTP Status Code: `500 Internal Server Error`



### `/lose_count` Route - Increment Lose Count

**Purpose**: Similar to `/win_count`, but for incrementing the lose count in the user's stats.

**HTTP Method**: `POST`

**Input**: None explicitly required; the operation affects the current authenticated user.

**Response**:
- **Success**: Returns a JSON message indicating the operation was successful.
  - Example: `{"message": "success"}`
  - HTTP Status Code: `200 OK`
- **Error**: Returns an error message in JSON format if any exception occurs.
  - Example: `{"error": "<exception_message>"}`.
  - HTTP Status Code: `500 Internal Server Error`


### `/update_username` Route - update username in db

**HTTP Method**: `POST`

**Input**: The input should come with a html form, json will not be accept.

**Response**: no response, should only use in profile, and refresh after update.


-Example code:
    fetch('/win', {
        method: 'POST',
        body: JSON.stringify({ amount: 100 }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Reload the page to reflect the updated bank account balance
            window.location.reload();
        } else {
            // Handle error response
            console.error('Error depositing into bank account:', response.statusText);
        }
    })
    .catch(error => {
        console.error('Error depositing into bank account:', error);
    });
  or anything that send either a form request and json.