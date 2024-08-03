var NEW = {};

function AddButton(DATA, CASE) {
    let Div = document.createElement('div');
    let Button1 = document.createElement('button');
    Button1.textContent = 'Ajouter';
    Button1.onclick = function () { Add(this, DATA); };
    Div.appendChild(Button1);
    let Button2 = document.createElement('button');
    Button2.textContent = 'Supprimer';
    Button2.onclick = function () { Supp(this, DATA); };
    Div.appendChild(Button2);
    CASE.appendChild(Div);
}

async function Add(ELEMENT, TYPE) {
    let Datas_Range = await DatasRange();
    let Dico_Return_Past = await DatasVictory(parseInt(localStorage.getItem(`Where${ANIME}`)), false, Datas_Range);
    var Child = ELEMENT.parentElement.parentElement;
    ELEMENT.parentElement.remove();
    let New_Element = document.createElement('div');
    New_Element.className = 'oui';
    // console.log(Data);
    var Text_Temp = "";
    let Type = TYPE.split("|");
    Type.forEach(D => {
        switch (D) {
            case "Info":
            case "Notes":
                Text_Temp += '<input style="color: red;" oninput="AjusterTaille(this)" type="text"></input>';
                break;
            case "Infos":
                Text_Temp += ' | <input style="color: red;" oninput="AjusterTaille(this)" type="text"></input>';
                break;
            case "Duree":
                Text_Temp += ' | <input style="color: red;" oninput="AjusterTaille(this)" type="text"></input> - <input style="color: red;" oninput="AjusterTaille(this)" type="text"></input>';
                break;
            case "Date":
                Text_Temp += '<input style="color: red;" oninput="AjusterTaille(this)" type="date"></input>';
                break;
            default:
                try {
                    let Dico = Dico_Return_Past[D];
                    let Temp = `<select style="color: red;">`;
                    Object.keys(Dico[0]).forEach(Element => {
                        Temp += `<option value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                    });
                    Text_Temp += Temp + `</select>`;
                    break;
                } catch (Error) {
                    console.log("Erreur,", D, "n'existe pas dans le dico");
                }
        }
    });
    New_Element.innerHTML = Text_Temp;
    Child.appendChild(New_Element);
    AddButton(TYPE, Child);
}

function GetElementFromEnd(COLLECTION, INDEX_FROM_END) {
    var Length = COLLECTION.length;
    var Positive_Index = Length + INDEX_FROM_END;
    if (Positive_Index >= 0 && Positive_Index < Length) {
        return COLLECTION[Positive_Index];
    } else {
        return undefined;
    }
}

function Supp(ELEMENT, DATA) {
    var Child = ELEMENT.parentElement.parentElement;
    var As = GetElementFromEnd(Child.children, -2);
    As.remove();
    ELEMENT.parentElement.remove();
    AddButton(DATA, Child);
}

function AjusterTaille(INPUT) {
    var Div = document.createElement('div');
    Div.style.width = 'auto';
    Div.style.position = 'absolute';
    Div.style.visibility = 'hidden';
    Div.style.whiteSpace = 'pre'; // Pour conserver les espaces et les retours à la ligne
    Div.textContent = INPUT.value;
    document.body.appendChild(Div);
    INPUT.style.width = Div.offsetWidth + 'px';
    document.body.removeChild(Div);
}

function FlecheOrNot(TEXT) {
    if (TEXT.includes("=>")) {
        return ["", ""];
    } else {
        return ["=>", ' data-score="SS"'];
    }
}

async function Modification(ELEMENT) {
    let Datas_Range = await DatasRange();
    let Dico_Return_Past = await DatasVictory(parseInt(localStorage.getItem(`Where${ANIME}`)), false, Datas_Range);
    // console.log(Element, Data);
    var Parent = ELEMENT.parentElement;
    let Liste = Array.from(ELEMENT.parentElement.children);
    ELEMENT.parentElement.className = "oui";
    ELEMENT.remove();
    var Type = Parent.parentElement.getAttribute('data-score');
    var Text_Temp = "";
    var Compteur = 0;
    Type = Type.split("|");
    Type.forEach(D => {
        switch (D) {
            case "Info":
            case "Notes":
                Parent.className = "oui";
                Text_Temp += `=><input data-score="SS" style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur].value}"></input>`;
                break;
            case "Infos":
                Text_Temp += ` | <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur].value}"></input>`;
                break;
            case "Duree":
                Text_Temp += ` | <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur].value}"></input> - <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur + 1].value}"></input>`;
                break;
            case "Date":
                Text_Temp += `=><input data-score="SS" style="color: red;" oninput="AjusterTaille(this)" type="date" value="${Liste[Compteur].value}"></input>`;
                break;
            default:
                try {
                    let Dico = Dico_Return_Past[D];
                    let Temp = FlecheOrNot(Text_Temp)[0] + "<select" + FlecheOrNot(Text_Temp)[1] + ' style="color: red;">';
                    Object.keys(Dico[0]).forEach(Element => {
                        if (Element === Liste[Compteur].value) {
                            Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                        } else {
                            Temp += `<option value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                        }
                    });
                    Text_Temp += Temp + `</select>`;
                    break;
                } catch (Error) {
                    console.log("Erreur,", D, "n'existe pas dans le dico");
                }
        }
        Compteur++;
    });
    Parent.innerHTML += Text_Temp;
}

function InDatas(DATA, RANGE) {
    if (Array.isArray(RANGE[0][0])) {
        RANGE = RANGE[0];
    }
    return RANGE.some(Element => {
        // Vérifie si l'élément et DATA sont des tableaux de même longueur
        if (Array.isArray(DATA) && Element.length === DATA.length) {
            // Compare chaque élément du tableau
            return Element.every((value, index) => value === DATA[index]);
        } else if (Element[0].length === DATA.length) {
            return Element[0] === DATA;
        }
        return false;
    });
}

function FirstValueOrOnlyOne(DATA, BOOL) {
    switch (BOOL) {
        case 0:
        case 1:
            return DATA;
        default:
            return DATA[0];
    }
}

function DivOrNot(BOOL, I, BUTTON) {
    // console.log(BOOL, I, BUTTON, I+1);
    if (BOOL === I + 1 && BUTTON) {
        return "<button onclick='Modification(this)'>Modif</button></div>";
    } else if (BOOL === I + 1) {
        return "</div>";
    } else {
        return "";
    }
}

function Image(DATAS, ID) {
    // console.log(ID, DATAS[ID], DATAS[ID]["Image"])
    if (ID !== 'new' && "Image" in DATAS[ID] && DATAS[ID]["Image"] !== null) {
        return DATAS[ID]["Image"][0][0];
    } else {
        return "";
    }
}

function GetIndexWithMaxValue(TABLE) {
    let Max_Index = null;
    let Max_Value = -Infinity; // Valeur initiale très basse
    for (const Index in TABLE) {
        if (parseInt(TABLE[Index].Ordre[0]) > Max_Value) {
            Max_Value = parseInt(TABLE[Index].Ordre[0]);
            Max_Index = Index;
        }
    }
    return Max_Index;
}

function IsNew(NUM, OBJ, DICO) {
    if (NUM === 'new') {
        let Type = OBJ.parentElement.parentElement.parentElement.children[0].textContent.slice(0, -2);
        let Keys = Object.keys(DICO[Type][0]);
        let Num = Math.max(...Keys.map(Number));
        if (NEW[Type] !== undefined && NEW[Type] !== null) { Num = Math.max(NEW[Type], Num); }
        NEW[Type] = parseInt(Num) + 1;
        return Num + 1;
    } else {
        return NUM;
    }
}

async function ModifierPage(INPUT, TYPE) {
    var Choix = INPUT.value;
    var Ligne = INPUT.parentElement.parentElement;
    let Datas_Range = await DatasRange();
    let Dico_Return_Past = await DatasVictorySpe2(parseInt(localStorage.getItem(`Where${ANIME}`)));
    let Dico_Return = await DatasVictorySpe(parseInt(localStorage.getItem(`Where${ANIME}`)));
    var Dico_Return_Spe = await DatasVictory(10000, true, Datas_Range);
    let DicoAModif = await DatasVictory(parseInt(localStorage.getItem(`Where${ANIME}`)), true, Datas_Range);
    var Compteur = 0;
    var Key = -1;
    let [Ligne_Past, Column] = Dico_Return_Past[TYPE];
    let Ligne_Act = Dico_Return[TYPE][0];
    Array.from(Ligne.children).forEach(function (Child) {
        if (Compteur === 1) {
            Key = IsNew(Choix, Child, Dico_Return_Spe);
            Child.innerHTML = Key + `<img src="${Image({ ...Ligne_Act, ...Ligne_Past }, Choix)}">`;
        } else if (Compteur > 1 && Choix !== "new" && ((Choix in Ligne_Past && Ligne_Past[Choix][Column[Compteur]] !== null) || (Choix in Ligne_Act && Ligne_Act[Choix][Column[Compteur]] !== null))) {
            var Text_Temp = "";
            let Type = Dico_Return_Past["Main"][Column[Compteur]].split("|");
            if (Choix in Ligne_Past && Ligne_Past[Choix][Column[Compteur]] !== null) {
                Ligne_Past[Choix][Column[Compteur]].forEach(Data => {
                    let Div = DivOrNot(Type.length, 0, true);
                    // console.log(Div, Type[0])
                    if (!(Choix in Ligne_Act) || (Ligne_Act[Choix][Column[Compteur]] === null || !InDatas(Data, Ligne_Act[Choix][Column[Compteur]]))) {
                        switch (Type[0]) {
                            case "Info":
                            case "Notes":
                                Temp_Data = FirstValueOrOnlyOne(Data, Type.length);
                                Text_Temp += `<div><input oninput="AjusterTaille(this)" type="text" value="${Temp_Data}"></input>${Div}`;
                                break;
                            default:
                                try {
                                    let Dico = Dico_Return[Type[0]].map((item, index) => {
                                        return { ...item, ...(Dico_Return_Past[Type[0]][index] || {}) };
                                    });
                                    let Temp = `<div><select>`;
                                    Object.keys(Dico[0]).forEach(Element => {
                                        if (Array.isArray(Data)) {
                                            D = Data[0]
                                        } else {
                                            D = Data
                                        }
                                        if (D == Element) {
                                            Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                        } else {
                                            Temp += `<option value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                        }
                                    });
                                    Text_Temp += Temp + `</select>${Div}`;
                                    break;
                                } catch (Error) {
                                    console.log("Erreur,", Type[0], "n'existe pas dans le dico");
                                }
                        }
                        for (let i = 1; i < Type.length; i++) {
                            let Div = DivOrNot(Type.length, i, true);
                            switch (Type[i]) {
                                case "Duree":
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[i].split("-")[0]}"></input> - <input oninput="AjusterTaille(this)" type="text" value="${Data[i].split("-")[1]}"></input>${Div}`;
                                    break;
                                case "Infos":
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[i]}">${Div}`;
                                    break;
                                default:
                                    try {
                                        let Dico = Dico_Return[Type[i]].map((item, index) => {
                                            return { ...item, ...(Dico_Return_Past[Type[i]][index] || {}) };
                                        });
                                        let Temp = `<select>`;
                                        Object.keys(Dico[0]).forEach(Element => {
                                            if (Data[0] == Element) {
                                                Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                            } else {
                                                Temp += `<option value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                            }
                                        });
                                        Text_Temp += Temp + `</select>${Div}`;
                                        break;
                                    } catch (Error) {
                                        console.log("Erreur,", Type[0], "n'existe pas dans le dico");
                                    }
                            }
                        }
                    }
                });
            }
            if (Choix in Ligne_Act && Ligne_Act[Choix][Column[Compteur]] !== null) {
                Ligne_Act[Choix][Column[Compteur]].forEach(Data => {
                    let Div = DivOrNot(Type.length, 0, false);
                    switch (Type[0]) {
                        case "Info":
                        case "Notes":
                            if (Array.isArray(Data[0])) {
                                Text_Temp += `<div class="oui"><input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[0][0]}"></input>`;
                            } else if (Array.isArray(Data)) {
                                Text_Temp += `<div class="oui"><input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[0]}"></input>${Div}`;
                            } else {
                                Text_Temp += `<div class="oui"><input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data}"></input>${Div}`;
                            }
                            break;
                        default:
                            try {
                                let Dico = Dico_Return[Type[0]].map((item, index) => {
                                    return { ...item, ...(Dico_Return_Past[Type[0]][index] || {}) };
                                });
                                if (Array.isArray(Data[0])) {
                                    var Temp = `<div class="oui"><select>`;
                                } else {
                                    var Temp = `<div class="oui"><select style="color: red;">`;
                                }
                                Object.keys(Dico[0]).forEach(Element => {
                                    if (Data[0][0] == Element && Array.isArray(Data[0])) {
                                        Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                    } else if (Data[0] == Element && Array.isArray(Data)) {
                                        Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                    } else {
                                        Temp += `<option value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                    }
                                });
                                Text_Temp += Temp + `</select>`;
                                // console.log(Data[0], Div);
                                if (!Array.isArray(Data[0])) {
                                    Text_Temp += `${Div}`;
                                }
                                break;
                            } catch (Error) {
                                console.log("Erreur,", D, "n'existe pas dans le dico");
                            }
                            break;
                    }
                    for (let i = 1; i < Type.length; i++) {
                        let Div = DivOrNot(Type.length, i, false);
                        switch (Type[i]) {
                            case "Duree":
                                if (Array.isArray(Data[0])) {
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[0][i].split("-")[0]}"></input> - <input oninput="AjusterTaille(this)" type="text" value="${Data[0][i].split("-")[1]}"></input>`;
                                } else {
                                    Text_Temp += ` | <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[i].split("-")[0]}"></input> - <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[i].split("-")[1]}"></input>${Div}`;
                                }
                                break;
                            case "Infos":
                                if (Array.isArray(Data[0])) {
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[0][i]}"></input>`;
                                } else {
                                    Text_Temp += ` | <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[i]}"></input>${Div}`;
                                }
                                break;
                        }
                    }
                    Div = DivOrNot(Type.length, 0, false);
                    switch (Type[0]) {
                        case "Info":
                        case "Notes":
                            if (Array.isArray(Data[0])) {
                                Text_Temp += `=><input data-score="SS" style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[1][0]}"></input>${Div}`;
                            }
                            break;
                        default:
                            try {
                                if (Array.isArray(Data[1])) {
                                    let Dico = Dico_Return[Type[0]].map((item, index) => {
                                        return { ...item, ...(Dico_Return_Past[Type[0]][index] || {}) };
                                    });
                                    let Temp = `=><select data-score="SS">`;
                                    Object.keys(Dico[0]).forEach(Element => {
                                        if (Data[1][0] == Element) {
                                            Temp += `<option style="color: red;" selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                        } else {
                                            Temp += `<option style="color: red;" value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                        }
                                    });
                                    Text_Temp += Temp + `</select>${Div}`;
                                }
                                break;
                            } catch (Error) {
                                console.log("Erreur,", Type[0], "n'existe pas dans le dico");
                            }
                            break;
                    }
                    for (let i = 1; i < Type.length; i++) {
                        let Div = DivOrNot(Type.length, i, false);
                        switch (Type[i]) {
                            case "Duree":
                                if (Array.isArray(Data[1])) {
                                    Text_Temp += ` | <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[1][i].split("-")[0]}"></input> - <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[1][i].split("-")[1]}"></input>${Div}`;
                                }
                                break;
                            case "Infos":
                                if (Array.isArray(Data[1])) {
                                    Text_Temp += ` | <input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Data[1][i]}"></input>${Div}`;
                                }
                                break;
                        }
                    }
                });
            }
            console.log(Text_Temp)
            Child.innerHTML += Text_Temp;
        } else if (Choix === 'new' && Compteur === 2) {
            console.log(Key);
            const Nom = prompt(`Quel Nom ?`);
            Child.innerHTML = `<div class="oui"><input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Nom}"></input></div>`;
            DicoAModif[TYPE][0][Key] = { Nom: [Nom] };
            Dico_Return_Spe[TYPE][0][Key] = { Nom: [Nom] };
            DicoAModif[TYPE][1].forEach(Cat => {
                if (Cat !== "Nom") { DicoAModif[TYPE][0][Key][Cat] = null; }
            });
            Dico_Return_Spe[TYPE][1].forEach(Cat => {
                if (Cat !== "Nom") { Dico_Return_Spe[TYPE][0][Key][Cat] = null; }
            });
            Save(DicoAModif);
        }
        if (Compteur > 1) {
            Child.innerHTML += `<div><button onclick="Add(this, '${Dico_Return_Past["Main"][Column[Compteur]]}')">Ajouter</button><button onclick="Supp(this, '${Dico_Return_Past["Main"][Column[Compteur]]}')">Supprimer</button></div>`;
        }
        Compteur++;
    });
    var table = Ligne.parentElement.parentElement.getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    Dico_Return = await DatasVictory(parseInt(localStorage.getItem(`Where${ANIME}`)), false, Datas_Range);
    Ligne_Past = Dico_Return[TYPE][0];
    Compteur = [0, table.rows.length];
    newRow.id = `${Compteur[1]}`
    Text = ``;
    Column.forEach(() => {
        if (Compteur[0] === 0) {
            Text += `<td>${parseInt(localStorage.getItem(`Where${ANIME}`))}</td>`;
        } else if (Compteur[0] === 1) {
            Text += `<td><select id="numero" name="numero" onchange="ModifierPage(this, '${TYPE}')"><option style="text-align: center;" value="" selected>NUMERO</option><option value="new">Nouveau</option>`;
            Object.keys(Ligne_Past).forEach(element => {
                Text += `<option value="${element}">${element} - ${Ligne_Past[element]["Nom"]}</option>`;
            });
            Text += `</select></td>`;
        } else {
            Text += `<td data-score="${Dico_Return_Past["Main"][Column[Compteur[0]]]}"></td>`;
        }
        Compteur = [Compteur[0] + 1, Compteur[1]];
    });
    newRow.innerHTML = Text;
}

function Save(DICT) {
    var Request = indexedDB.open(`MaBaseDeDonnees${ANIME}`, I);
    Request.onsuccess = function (event) {
        var Db = event.target.result;
        var Transaction = Db.transaction(['MonObjet'], 'readwrite'); // Commencer une transaction en mode lecture-écriture
        var ObjectStore = Transaction.objectStore('MonObjet'); // Récupérer l'objet store
        var Data = DICT; // Ajouter l'objet à l'objet store
        Data["id"] = 1;
        var NewRequest = ObjectStore.put(Data);
        NewRequest.onsuccess = function (event) {
            console.log("Objet modifié avec succès ! (Save function)");
        };
    };
}

function Plus(NUM, BOOL, INT, COMPT) {
    if (NUM === 0 && BOOL !== true && COMPT !== document.querySelectorAll('table').length - 1 && INT !== 0) {
        return "\\+";
    } else {
        return "";
    }
}

function End(NUM, DATA) {
    if (DATA[NUM] === "Duree") {
        return "-";
    } else if (DATA.length > NUM) {
        return ",";
    } else {
        return "";
    }
}

function Transfo() {
    Xompteur = 0;
    document.querySelectorAll('table').forEach(table => {
        if (Xompteur === document.querySelectorAll('table').length - 1) {
            Vi = 0;
            Vj = 1;
        } else {
            Vi = 1;
            Vj = 0;
        }
        for (var i = 0; i < table.rows.length - Vi; i++) {
            for (var j = 2 - Vj, Cell; Cell = table.rows[i].cells[j]; j++) {
                if (j === (2 - Vj) && Cell.innerHTML.includes("<input") === false) {
                    break;
                }
                var Text = "";
                var Compteur = [0, 0, 0];
                if (Cell.getAttribute('data-score') !== null) {
                    var Type = Cell.getAttribute('data-score').split("|");
                } else {
                    var Type = null;
                }
                Cell.querySelectorAll('div').forEach(function (Child) {
                    Child.querySelectorAll('select, input[type="text"]').forEach(function (Mini_Child) {
                        if (Child.className === "oui") {
                            if (Compteur[0] < Type.length || Type[Compteur - 1] === "Duree" || Mini_Child.getAttribute("data-score") === "SS") {
                                if (Mini_Child.getAttribute("data-score") === "SS") {
                                    Compteur[1] = 0;
                                    Text = Text.slice(0, -1) + "=>" + Mini_Child.value + End(Compteur[1], Type);
                                } else {
                                    Text += Plus(Compteur[1], Child.innerText.includes("=>"), Compteur[2], Xompteur) + Mini_Child.value + End(Compteur[1], Type);
                                }
                                Compteur[0]++;
                            } else if (Compteur[0] === Type.length || (Type[Compteur - 1] !== "Duree" && Compteur[0] === Type.length - 1)) {
                                Text += Mini_Child.value + "\\"
                                Compteur[0] = 0;
                            }
                        }
                        Compteur[1]++;
                    });
                    Compteur[0] = 0;
                    Compteur[1] = 0;
                    Compteur[2]++;
                });
                Text = Text.replace(/\\\\/g, "\\");
                if (Text.length > 0 && Text[1] === "+") {
                    Cell.innerHTML = '="' + Text.slice(1, -1) + '"';
                } else {
                    Cell.innerHTML = Text.slice(0, -1);
                }
            }
        }
        Xompteur++;
    })


}

async function DatasVictorySpe(WHERE) {
    let DATAS_RANGE = await DatasRange();
    console.log(DATAS_RANGE)
    var modif = localStorage.getItem('ModifSpe');
    if (modif === 'true' || modif) {
        try {
            var LISTE = [];
            Object.keys(DATAS_RANGE).forEach(ele => {
                LISTE.push(ele);
            })
            var Dico = {};
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS_RANGE[Element]), await WhereOrNot(Element, WHERE), Element, true);
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent

            // console.log(dico);

            var request = indexedDB.open(`MaBaseDeDonneesSpe${ANIME}`, I);

            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                // Créer un objetStore (équivalent à une table dans une base de données relationnelle)
                var objectStore = db.createObjectStore('MonObjet', { keyPath: 'id', autoIncrement: true });
            };

            request.onsuccess = function (event) {
                var db = event.target.result;
                // Commencer une transaction en mode lecture-écriture
                var transaction = db.transaction(['MonObjet'], 'readwrite');
                // Récupérer l'objet store
                var objectStore = transaction.objectStore('MonObjet');
                // Ajouter l'objet à l'objet store
                var Data = Dico;
                Data["id"] = 1;
                var NewRequest = objectStore.put(Data);

                NewRequest.onsuccess = function (event) {
                    // console.log("Objet modifié avec succès !");
                };

                NewRequest.onerror = function (event) {
                    console.error("Erreur lors de l'ajout de l'objet :", event.target.error);
                };
            };

            request.onerror = function (event) {
                console.error("Erreur lors de l'ouverture de la base de données :", event.target.error);
            };
        } catch (error) {
            console.error('Une erreur est survenue :', error);
        }

        modif = false;
        localStorage.setItem('ModifSpe', modif);
    } else {
        var Dico = {};
        try {
            var promesse = new Promise(function (resolve, reject) {
                var request = indexedDB.open(`MaBaseDeDonneesSpe${ANIME}`, I);

                request.onsuccess = function (event) {
                    // Obtention de la référence à la base de données ouverte
                    var db = event.target.result;
                    // Utilisation de la base de données pour effectuer des opérations
                    // par exemple, récupérer des données depuis un objet store
                    var transaction = db.transaction(['MonObjet'], 'readonly');
                    var objectStore = transaction.objectStore('MonObjet');
                    var getRequest = objectStore.get(1);

                    getRequest.onsuccess = function (event) {
                        Dico = getRequest.result;
                        // console.log("Récupération réussie pour :", Element)
                        resolve();
                    };

                    getRequest.onerror = function (event) {
                        console.error("Erreur lors de la récupération de l'objet :", event.target.error);
                        reject(event.target.error);
                    };
                };

                request.onerror = function (event) {
                    console.error("Erreur lors de l'ouverture de la base de données :", event.target.error);
                    reject(event.target.error);
                };

                request.onupgradeneeded = async function (event) {
                    modif = 'true';
                    localStorage.setItem('ModifSpe', modif);
                    I++;
                    localStorage.setItem('I', I);
                    location.reload();
                };
            });
            await promesse;

        } catch (error) {
            console.error('Une erreur est survenue :', error);
            var Dico = {};
            var LISTE = [];
            Object.keys(DATAS_RANGE).forEach(ele => {
                LISTE.push(ele);
            })
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS_RANGE[Element]), await WhereOrNot(Element, WHERE), Element, true);
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent
            // console.log(Dico);
            return Dico;
        }
    }

    return Dico;
}

async function DatasVictorySpe2(WHERE) {
    let DATAS_RANGE = await DatasRange();
    var modif = localStorage.getItem('ModifSpe2');
    WHERE = String(Number(WHERE) - 1);
    if (modif === 'true' || modif) {
        try {
            var LISTE = [];
            Object.keys(DATAS_RANGE).forEach(ele => {
                LISTE.push(ele);
            })
            var Dico = {};
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS_RANGE[Element]), await WhereOrNot(Element, WHERE), Element, false);
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent

            // console.log(dico);

            var request = indexedDB.open(`MaBaseDeDonneesSpe2${ANIME}`, I);

            request.onupgradeneeded = function (event) {
                var db = event.target.result;
                // Créer un objetStore (équivalent à une table dans une base de données relationnelle)
                var objectStore = db.createObjectStore('MonObjet', { keyPath: 'id', autoIncrement: true });
            };

            request.onsuccess = function (event) {
                var db = event.target.result;
                // Commencer une transaction en mode lecture-écriture
                var transaction = db.transaction(['MonObjet'], 'readwrite');
                // Récupérer l'objet store
                var objectStore = transaction.objectStore('MonObjet');
                // Ajouter l'objet à l'objet store
                var Data = Dico;
                Data["id"] = 1;
                var NewRequest = objectStore.put(Data);

                NewRequest.onsuccess = function (event) {
                    // console.log("Objet modifié avec succès !");
                };

                NewRequest.onerror = function (event) {
                    console.error("Erreur lors de l'ajout de l'objet :", event.target.error);
                };
            };

            request.onerror = function (event) {
                console.error("Erreur lors de l'ouverture de la base de données :", event.target.error);
            };
        } catch (error) {
            console.error('Une erreur est survenue :', error);
        }

        modif = false;
        localStorage.setItem('ModifSpe2', modif);
    } else {
        var Dico = {};
        try {
            var promesse = new Promise(function (resolve, reject) {
                var request = indexedDB.open(`MaBaseDeDonneesSpe2${ANIME}`, I);

                request.onsuccess = function (event) {
                    // Obtention de la référence à la base de données ouverte
                    var db = event.target.result;
                    // Utilisation de la base de données pour effectuer des opérations
                    // par exemple, récupérer des données depuis un objet store
                    var transaction = db.transaction(['MonObjet'], 'readonly');
                    var objectStore = transaction.objectStore('MonObjet');
                    var getRequest = objectStore.get(1);

                    getRequest.onsuccess = function (event) {
                        Dico = getRequest.result;
                        // console.log("Récupération réussie pour :", Element)
                        resolve();
                    };

                    getRequest.onerror = function (event) {
                        console.error("Erreur lors de la récupération de l'objet :", event.target.error);
                        reject(event.target.error);
                    };
                };

                request.onerror = function (event) {
                    console.error("Erreur lors de l'ouverture de la base de données :", event.target.error);
                    reject(event.target.error);
                };

                request.onupgradeneeded = async function (event) {
                    modif = 'true';
                    localStorage.setItem('ModifSpe2', modif);
                    I++;
                    localStorage.setItem('I', I);
                    location.reload();
                };
            });
            await promesse;

        } catch (error) {
            console.error('Une erreur est survenue :', error);
            var Dico = {};
            var LISTE = [];
            Object.keys(DATAS_RANGE).forEach(ele => {
                LISTE.push(ele);
            })
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS_RANGE[Element]), await WhereOrNot(Element, WHERE), Element, false);
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent
            // console.log(Dico);
            return Dico;
        }
    }

    // console.log(Dico);
    return Dico;
}

function copyTable(TAB, SPE) {
    // Sélectionner le tableau
    var table = TAB.parentElement.children[0];
    var rows = table.rows;
    var textToCopy = '';

    let Temp = 1;
    if (SPE) {
        Temp = 0;
    }

    // Boucle pour récupérer les lignes sauf la première et la dernière
    for (var i = 1; i < rows.length - Temp; i++) {
        var cells = rows[i].cells;
        var rowText = [];
        for (var j = 0; j < cells.length; j++) {
            rowText.push(cells[j].innerText);
        }
        textToCopy += rowText.join('\t') + '\n';
    }

    // Créer un élément textarea pour copier le texte
    var textarea = document.createElement('textarea');
    textarea.value = textToCopy;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

async function GeneralModif() {
    let Datas_Range = await DatasRange();
    localStorage.setItem('ModifSpe', 'true');
    localStorage.setItem('ModifSpe2', 'true');
    let Dico_Return_Past = await DatasVictory(parseInt(localStorage.getItem(`Where${ANIME}`)), false, Datas_Range);
    // console.log("dicoReturnPast", dicoReturnPast, parseInt(localStorage.getItem(`Where${ANIME}`)));
    var Main_Datas_Past = Dico_Return_Past["Main"];
    var Perso_Datas_Past = Dico_Return_Past["Perso"][0];
    var [Chap_Datas_Past, Chap_Datas_Columns_Past] = Dico_Return_Past["Chapter"];
    var Div_Pro = document.getElementById("modification");
    var Liste = [];
    Object.keys(Datas_Range).forEach(element => {
        if (!(["Chapter", "Main", "id", "Link"].includes(element))) {
            Liste.push(Dico_Return_Past[element].concat([element]));
        }
    })
    // console.log("Liste", Liste);
    Liste.forEach(Datas => {
        var Text = `<div class='table-container'><table border=1 id='table'><caption>${Datas[2]} :<br></select></caption><thead><tr>`;
        Datas[1].forEach(Element => {
            Text += `<th>${Element}</th>`;
        });
        var Compteur = [0, 0];
        Text += `</tr></thead><tbody><tr id="${Compteur[1]}">`;
        Datas[1].forEach(() => {
            if (Compteur[0] === 0) {
                Text += `<td>${parseInt(localStorage.getItem(`Where${ANIME}`))}</td>`;
            } else if (Compteur[0] === 1) {
                Text += `<td><select id="numero" name="numero" onchange="ModifierPage(this, '${Datas[2]}')"><option style="text-align: center;" value="" selected>NUMERO</option><option value="new">Nouveau</option>`;
                Object.keys(Datas[0]).forEach(element => {
                    Text += `<option value="${element}">${element} - ${Datas[0][element]["Nom"]}</option>`;
                });
                Text += `</select></td>`;
            } else {
                Text += `<td data-score="${Main_Datas_Past[Datas[1][Compteur[0]]]}"></td>`;
            }
            Compteur = [Compteur[0] + 1, Compteur[1]];
        });
        Text += "</tr></tbody></table><button onclick='copyTable(this, false)'>Copier le tableau</button></div>";
        Div_Pro.innerHTML += Text;
    })
    var Text = `<div class='table-container'><table border=1 id='table'><caption>Chapitre :<br></select></caption><thead><tr>`;
    Chap_Datas_Columns_Past.forEach(Element => {
        Text += `<th>${Element}</th>`;
    });
    var NewCompteur = 0;
    Text += `</tr></thead><tbody><tr id="${NewCompteur}">`;
    if (parseInt(localStorage.getItem(`Where${ANIME}`)) in Chap_Datas_Past) {
        Chap_Datas_Columns_Past.forEach(() => {
            if (NewCompteur === 0) {
                Text += `<td>${parseInt(localStorage.getItem(`Where${ANIME}`))}</td>`;
            } else {
                switch (Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]) {
                    case "Info":
                    case "Notes":
                        Text += `<td data-score='${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}'><div class="oui"><input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Chap_Datas_Past[localStorage.getItem(`Where${ANIME}`)][Chap_Datas_Columns_Past[NewCompteur]]}"></input></div></td>`;
                        break;
                    case "Perso":
                        Temp = "";
                        if (Array.isArray(Chap_Datas_Past[localStorage.getItem(`Where${ANIME}`)][Chap_Datas_Columns_Past[NewCompteur]])) {
                            if (Array.isArray(Chap_Datas_Past[localStorage.getItem(`Where${ANIME}`)][Chap_Datas_Columns_Past[NewCompteur]][0])) {
                                ToEach = Chap_Datas_Past[localStorage.getItem(`Where${ANIME}`)][Chap_Datas_Columns_Past[NewCompteur]][0];
                            } else {
                                ToEach = Chap_Datas_Past[localStorage.getItem(`Where${ANIME}`)][Chap_Datas_Columns_Past[NewCompteur]];
                            }
                            ToEach.forEach(perso => {
                                Temp += `<div class="oui"><select style="color: red;">`;
                                Object.keys(Perso_Datas_Past).forEach(element => {
                                    if (element === perso) {
                                        Temp += `<option selected value="${element}">${element} - ${Perso_Datas_Past[element]["Nom"]}</option>`;
                                    } else {
                                        Temp += `<option value="${element}">${element} - ${Perso_Datas_Past[element]["Nom"]}</option>`;
                                    }
                                });
                                Temp += `</select></div>`;
                            })
                        }
                        Text += `<td data-score='${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}'>` + Temp + `<div><button onclick="Add(this, '${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}')">Ajouter</button><button onclick="Supp(this, '${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}')">Supprimer</button></div></td>`;
                        break;
                }
            }
            NewCompteur++;
        });
    } else {
        Chap_Datas_Columns_Past.forEach(() => {
            if (NewCompteur === 0) {
                Text += `<td>${parseInt(localStorage.getItem(`Where${ANIME}`))}</td>`;
            } else {
                switch (Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]) {
                    case "Info":
                    case "Notes":
                        var Value = "";
                        if (Chap_Datas_Columns_Past[NewCompteur] === "Ordre") {
                            Value = parseInt(Chap_Datas_Past[GetIndexWithMaxValue(Chap_Datas_Past)][Chap_Datas_Columns_Past[NewCompteur]]) + 1;
                        } else if (Chap_Datas_Columns_Past[NewCompteur] === "Année") {
                            Value = Chap_Datas_Past[parseInt(localStorage.getItem(`Where${ANIME}`)) - 1]["Année"];
                            console.log("Année:", Value);
                        }
                        Text += `<td data-score='${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}'><div class="oui"><input style="color: red;" oninput="AjusterTaille(this)" type="text" value="${Value}"></input></div></td>`;
                        break;
                    case "Perso":
                        Text += `<td data-score='${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}'><div><button onclick="Add(this, '${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}')">Ajouter</button><button onclick="Supp(this, '${Main_Datas_Past[Chap_Datas_Columns_Past[NewCompteur]]}')">Supprimer</button></div></td>`;
                        break;
                }
            }
            NewCompteur++;
        });
    }
    Text += "</tr></tbody></table><button onclick='copyTable(this, true)'>Copier le tableau</button></div>";
    Div_Pro.innerHTML += Text;
}
