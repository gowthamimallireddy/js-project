
const currentUser = localStorage.getItem("loggedInUser");

if (!currentUser) {
    window.location.href = "login.html";
} else {
    document.getElementById("mainContent").style.display = "block";
    document.getElementById("welcomeUser").innerText = "Hi, " + currentUser;
}

let goals = JSON.parse(localStorage.getItem("goals_" + currentUser)) || [];
let editIndex = null;

function openPopup(edit = false, index = null) {
    const popup = document.getElementById("goalPopup");
    popup.style.display = "flex";

    if (edit) {
        editIndex = index;
        document.getElementById("popupTitle").innerText = "Edit Goal";
        document.getElementById("goalName").value = goals[index].name;
        document.getElementById("goalTarget").value = goals[index].target;
    } else {
        editIndex = null;
        document.getElementById("popupTitle").innerText = "Add New Goal";
        document.getElementById("goalName").value = "";
        document.getElementById("goalTarget").value = "";
    }
}

function closePopup() {
    document.getElementById("goalPopup").style.display = "none";
}

function saveGoal() {
    const name = document.getElementById("goalName").value.trim();
    const target = Number(document.getElementById("goalTarget").value);

    if (!name || !target) return alert("Fill all fields!");

    if (editIndex !== null) {
        goals[editIndex].name = name;
        goals[editIndex].target = target;
    } else {
        goals.push({ name, target, progress: 0 });
    }

    saveGoals();
    displayGoals();
    closePopup();
}

function displayGoals() {
    const container = document.getElementById("goalsContainer");
    container.innerHTML = "";

    goals.forEach((g, index) => {
        const percentage = Math.min((g.progress / g.target) * 100, 100);
        container.innerHTML += `
        <div class="goal-card">
            <div class="progress-circle" style="background: conic-gradient(#4ade80 ${percentage}%, #e5e7eb ${percentage}%);">
                ${Math.round(percentage)}%
            </div>
            <h3>${g.name}</h3>
            <p>${g.progress} / ${g.target}</p>
            <button class="btn-update" onclick="updateGoal(${index})">+ Progress</button>
            <button class="btn-edit" onclick="openPopup(true, ${index})">Edit</button>
            <button class="btn-delete" onclick="deleteGoal(${index})">Delete</button>
        </div>`;
    });
}

function updateGoal(index) {
    goals[index].progress++;
    saveGoals();
    displayGoals();
}

function deleteGoal(index) {
    goals.splice(index, 1);
    saveGoals();
    displayGoals();
}

function saveGoals() {
    localStorage.setItem("goals_" + currentUser, JSON.stringify(goals));
}

displayGoals();

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}



function loadQuote() {
    fetch("https://dummyjson.com/quotes/random")
        .then(res => res.json())
        .then(data => {
            const quoteText = `"${data.quote}" — ${data.author}`;
            const quoteEl = document.getElementById("quote");
            quoteEl.innerText = quoteText;

            // Add random background and text color for highlight
            const bgColors = ["#fffae6", "#e6f7ff", "#e6ffe6", "#fff0f5", "#f0e6ff"];
            const textColors = ["#b91c1c", "#1e40af", "#047857", "#9d174d", "#5b21b6","#F88379"];
            const randIndex = Math.floor(Math.random() * bgColors.length);

            quoteEl.style.backgroundColor = bgColors[randIndex];
            quoteEl.style.color = textColors[randIndex];
            quoteEl.style.padding = "12px 20px";
            quoteEl.style.borderRadius = "10px";
            quoteEl.style.display = "inline-block";
            quoteEl.style.transition = "all 0.5s ease";
            quoteEl.style.fontWeight = "700";
        });
}
loadQuote();
