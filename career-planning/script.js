
class CareerGoal {
    constructor(title, status = "Planlandi") {
        this.id = Date.now(); 
        this.title = title;
        this.status = status;
    }
}


let chosenCareers = JSON.parse(localStorage.getItem("careerData")) || [];

const careerDB = {
    "kod": ["C# Yazilim Uzmani", "Web Geliştiricisi", "Yapay Zeka Mühendisi", "Mobil Uygulama Geliştiricisi"],
    "oyun": ["Oyun Geliştiricisi", "Oyun Tasarimcisi", "Oyun Programcisi", "Bölüm (Level) Tasarimcisi"],
    "yönetim": ["YBS Uzmani", "Bilişim Projeleri Yöneticisi", "Ürün Yöneticisi (Product Manager)", "IT Direktörü"],
    "analiz": ["Sistem Analisti", "Veri Bilimcisi", "İş Zekasi (BI) Uzmani", "İş Analisti"],
    "güvenlik": ["Siber Güvenlik Uzmani", "Dijital Mahremiyet Analisti", "Bilgi Güvenliği Yöneticisi"],
    "tasarim": ["UI/UX Tasarimcisi", "Ön Yüz (Front-end) Geliştiricisi", "Kullanici Deneyimi Araştirmacisi"]
};

const inputArea = document.getElementById("userInput");
const analyzeButton = document.getElementById("analyzeBtn");
const suggestionBox = document.getElementById("suggestionBox");
const listArea = document.getElementById("myCareerList");


const analyzePromise = (inputText) => {
    return new Promise((resolve, reject) => {
        if (inputText === "") {
            reject("Lütfen ilgi alanlarini anlatan birkaç kelime yaz!");
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
        }, 1500); 
    });
};


analyzeButton.addEventListener("click", () => {
    const text = inputArea.value.toLocaleLowerCase('tr-TR');
    
    suggestionBox.innerHTML = "<span class='empty-text'> lütfen bekle...</span>";
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
                suggestionBox.innerHTML = "<span class='empty-text'>Uygun alan bulunamadı. Farklı kelimeler (örn: yönetim, tasarım) dene!</span>";
            }
        })
        .catch((errorMessage) => {
            suggestionBox.innerHTML = `<span style='color: #ff453a; font-size: 14px;'> ${errorMessage}</span>`;
        })
        .finally(() => {
            analyzeButton.disabled = false; 
        });
});

window.saveCareer = (selectedPath) => {
    const newGoal = new CareerGoal(selectedPath);

    chosenCareers.push(newGoal); 
    
    localStorage.setItem("careerData", JSON.stringify(chosenCareers));

    inputArea.value = ""; 
    suggestionBox.innerHTML = "<span class='empty-text'>Hedef eklendi</span>";
    
    updateScreen(); 
};


window.deleteCareer = (idToRemove) => {
   
    chosenCareers = chosenCareers.filter((goal) => goal.id !== idToRemove);
    
   
    localStorage.setItem("careerData", JSON.stringify(chosenCareers));
    
    
    updateScreen();
};


const updateScreen = () => {
    listArea.innerHTML = ""; 

    for (let k = 0; k < chosenCareers.length; k++) {
        const currentItem = chosenCareers[k]; 
        
        
        const { id, title, status } = currentItem;
        
        
        listArea.innerHTML += `
            <li style="align-items: center;">
                <span>* ${title}</span>
                <div>
                    <span style="color: #86868b; font-size: 12px; margin-right: 15px;">${status}</span>
                    <button class="secondary-btn" style="color: #ff453a; padding: 5px 10px; margin: 0;" onclick="deleteCareer(${id})">Sil</button>
                </div>
            </li>
        `;
    }
};


updateScreen();