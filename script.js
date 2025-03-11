const SUPABASE_URL = "https://vrrqyefzohsorndqxdjl.supabase.co";  // Replace with your Supabase URL
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZycnF5ZWZ6b2hzb3JuZHF4ZGpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2ODUzODMsImV4cCI6MjA1NzI2MTM4M30.qv85Bp36mMOASX_y3z6UFW7Lar4JSGXZ9WLSUK8rTWE";  // Replace with your Supabase key

async function fetchData() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/sensor_data?select=*&order=timestamp.desc&limit=10`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "apikey": SUPABASE_KEY,
                "Authorization": `Bearer ${SUPABASE_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        updateTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function updateTable(data) {
    const tableBody = document.getElementById("sensorData");
    tableBody.innerHTML = "";  // Clear existing table before updating

    data.forEach((item) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${parseFloat(item.temperature).toFixed(2)}°C</td>
            <td>${parseFloat(item.humidity).toFixed(2)}%</td>
            <td>${new Date(item.timestamp).toLocaleString()}</td>
        `;

        tableBody.appendChild(row);
    });
}

// Fetch data immediately and refresh every 5 seconds
fetchData();
setInterval(fetchData, 5000);
