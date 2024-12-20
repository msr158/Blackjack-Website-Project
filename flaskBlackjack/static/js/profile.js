//event listeners for buttons

function displaySection(id) {
    // Hide all sections
    document.getElementById('achievements_section').style.display = 'none';
    document.getElementById('stats_section').style.display = 'none';

    // Display the selected section
    document.getElementById(id).style.display = 'block';
}