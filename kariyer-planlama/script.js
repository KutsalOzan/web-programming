function addTarget() {
    let persons = [];
    let input = document.getElementById("targetInput");
    let targetText = input.value;

    if (targetText === "") {
        alert("Lütfen bir hedef girin!");
        return;
    }

    persons.push(targetText);
    persons.value = "";

    let li = document.createElement("li");
    li.textContent = targetText;

    document.getElementById("targetList").appendChild(li);

    
}
function personShow(){
         let liste = document.getElementById("targetList");

        

    
    for (let i = 0; i < persons.length; i++) {

        let lis = document.createElement("li");
        lis.textContent = persons[i];

        liste.appendChild(lis);
    }
}