class CareerGoal {
    constructor(title, status = "Planlandı") {
        this.id = Date.now(); 
        this.title = title;
        this.status = status;
    }
}

let chosenCareers = JSON.parse(localStorage.getItem("careerData")) || [];

const careerDB = {
    "kod": ["C# Yazılım Uzmanı", "Web Geliştiricisi", "Yapay Zeka Mühendisi"],
    "oyun": ["Oyun Geliştiricisi", "Oyun Tasarımcısı", "Bölüm Tasarımcısı"],
    "yönetim": ["YBS Uzmanı", "Bilişim Projeleri Yöneticisi", "Ürün Yöneticisi"],
    "analiz": ["Sistem Analisti", "Veri Bilimcisi", "İş Analisti"],
    "güvenlik": ["Siber Güvenlik Uzmanı", "Dijital Mahremiyet Analisti"],
    "tasarım": ["UI/UX Tasarımcısı", "Ön Yüz Geliştiricisi"]
};

// --- LOGİN VE YETKİLENDİRME İŞLEMLERİ ---
window.loginUser = () => {
    const nameInput = document.getElementById("loginName").value;
    if(nameInput.trim() === "") {
        alert("Lütfen adınızı giriniz.");
        return;
    }
    localStorage.setItem("activeUser", nameInput);
    window.location.href = "index.html"; // Ana sayfaya yönlendir
};

window.logoutUser = () => {
    localStorage.removeItem("activeUser");
    window.location.href = "login.html"; // Çıkışta login'e at
};

window.checkAuth = () => {
    const currentUser = localStorage.getItem("activeUser");
    if(!currentUser) {
        // Kullanıcı yoksa zorla login sayfasına gönder
        window.location.href = "login.html";
    } else {
        // Kullanıcı varsa menüye ismini yaz
        const navName = document.getElementById("navUserName");
        if(navName) navName.innerText = currentUser;
    }
};

// --- ANA SAYFA İŞLEMLERİ ---
const inputArea = document.getElementById("userInput");
const analyzeButton = document.getElementById("analyzeBtn");
const suggestionBox = document.getElementById("suggestionBox");
const listArea = document.getElementById("myCareerList");

const analyzePromise = (inputText) => {
    return new Promise((resolve, reject) => {
        if (inputText === "") {
            reject("Lütfen ilgi alanlarını anlatan birkaç kelime yaz!");
            return; 
        }
        setTimeout(() => {
            const foundMatches = []; 
            for (const key in careerDB) {
                if (inputText.includes(key)) {
                    const professions = careerDB[key];
                    for (let i = 0; i < professions.length; i++) {
                        foundMatches.push(professions[i]);
                    }
                }
            }
            resolve(foundMatches);
        }, 1200); 
    });
};

if(analyzeButton) { // Sadece butonu bulursa çalıştır (Login sayfasında hata vermemesi için)
    analyzeButton.addEventListener("click", () => {
        const text = inputArea.value.toLocaleLowerCase('tr-TR');
        suggestionBox.innerHTML = "<span class='empty-text'>⏳ Lütfen bekle, analiz yapılıyor...</span>";
        analyzeButton.disabled = true; 
        
        analyzePromise(text)
            .then((results) => {
                suggestionBox.innerHTML = ""; 
                if (results.length > 0) {
                    for (let j = 0; j < results.length; j++) {
                        suggestionBox.innerHTML += `
                            <button class="secondary-btn" onclick="saveCareer('${results[j]}')">
                                + ${results[j]}
                            </button>
                        `;
                    }
                } else {
                    suggestionBox.innerHTML = "<span class='empty-text'>Uygun alan bulunamadı. Farklı kelimeler dene!</span>";
                }
            })
            .catch((errorMessage) => {
                suggestionBox.innerHTML = `<span style='color: #ff453a; font-size: 14px;'>❌ ${errorMessage}</span>`;
            })
            .finally(() => {
                analyzeButton.disabled = false; 
            });
    });
}

window.saveCareer = (selectedPath) => {
    const newGoal = new CareerGoal(selectedPath);
    chosenCareers.push(newGoal); 
    localStorage.setItem("careerData", JSON.stringify(chosenCareers));
    inputArea.value = ""; 
    suggestionBox.innerHTML = "<span class='empty-text'>✅ Hedef başarıyla eklendi!</span>";
    if(listArea) updateScreen(); 
};

window.deleteCareer = (idToRemove) => {
    chosenCareers = chosenCareers.filter((goal) => goal.id !== idToRemove);
    localStorage.setItem("careerData", JSON.stringify(chosenCareers));
    if(listArea) updateScreen();
};

window.goToDetail = (goalId) => {
    localStorage.setItem("activeGoalId", goalId);
    window.location.href = "detail.html";
};

const updateScreen = () => {
    if(!listArea) return; // Sayfada liste alanı yoksa işlemi iptal et
    listArea.innerHTML = ""; 
    for (let k = 0; k < chosenCareers.length; k++) {
        const currentItem = chosenCareers[k]; 
        const { id, title, status } = currentItem;
        
        listArea.innerHTML += `
            <li class="list-item">
                <span class="target-title">🎯 ${title}</span>
                <div class="action-area">
                    <span class="status-badge">${status}</span>
                    <button class="action-btn detail-btn" onclick="goToDetail(${id})">Detay</button>
                    <button class="action-btn delete-btn" onclick="deleteCareer(${id})">Sil</button>
                </div>
            </li>
        `;
    }
};

// Sayfa ilk yüklendiğinde hedefleri getir (Eğer liste ekranındaysak)
if(listArea) updateScreen();