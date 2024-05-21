document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ studentId: studentId, password: password }),
        });

        if (response.ok) {
            const data = await response.json();
            alert('Login successful: ' + JSON.stringify(data));
        } else {
            const error = await response.json();
            alert('Login failed: ' + error.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
