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
    let Dico_Return_Spe = await DatasVictory(false, Datas_Range);
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
            case "Infom":
            case "Notes":
                Text_Temp += '<input oninput="AjusterTaille(this)" type="text"></input>';
                break;
            case "Infos":
                Text_Temp += ' | <input oninput="AjusterTaille(this)" type="text"></input>';
                break;
            case "Duree":
                Text_Temp += ' | <input oninput="AjusterTaille(this)" type="text"></input> - <input oninput="AjusterTaille(this)" type="text"></input>';
                break;
            case "Date":
                Text_Temp += '<input oninput="AjusterTaille(this)" style="width: 100px" type="date"></input>';
                break;
            default:
                try {
                    let Dico = Dico_Return_Spe[D];
                    let Temp = `<select>`;
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
    let Dico_Return_Spe = await DatasVictory(false, Datas_Range);
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
                Text_Temp += `=><input data-score="SS" oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur].value}"></input>`;
                break;
            case "Infos":
                Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur].value}"></input>`;
                break;
            case "Duree":
                Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur].value}"></input> - <input oninput="AjusterTaille(this)" type="text" value="${Liste[Compteur + 1].value}"></input>`;
                break;
            case "Date":
                Text_Temp += `=><input data-score="SS" oninput="AjusterTaille(this)" type="date" value="${FormatDate(String(Liste[Compteur].value))}"></input>`;
                break;
            default:
                try {
                    let Dico = Dico_Return_Spe[D];
                    let Temp = FlecheOrNot(Text_Temp)[0] + "<select" + FlecheOrNot(Text_Temp)[1] + '>';
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
    // console.log(ID, DATAS[ID], DATAS[ID]["Images"])
    if (ID !== 'new' && "Images" in DATAS[ID] && DATAS[ID]["Images"] !== null) {
        return DATAS[ID]["Images"][0][0];
    } else {
        return "";
    }
}

function GetIndexWithMaxValue(TABLE) {
    let Max_Index = null;
    let Max_Value = -Infinity; // Valeur initiale très basse
    for (const Index in TABLE) {
        console.log(TABLE, Index);
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

function ToFormatDate(DATESTR) {
    const Parts = DATESTR.split('-');
    let Day = Parts[2];
    let Month = Parts[1];
    const Year = Parts[0];
    return `${Day}/${Month}/${Year}`;
}

function FormatDate(DATESTR) {
    DATESTR = DATESTR.replace("Date(", "");
    DATESTR = DATESTR.replace(")", "");
    const Parts = DATESTR.split(',');
    let Day = Parts[2];
    let Month = parseInt(Parts[1]) + 1;
    const Year = Parts[0];
    if (String(Day).length === 1) { Day = "0" + String(Day) };
    if (String(Month).length === 1) { Month = "0" + String(Month) };
    return `${Year}-${Month}-${Day}`;
}

async function ModifierPage(INPUT, TYPE) {
    var Choix = INPUT.value;
    var Ligne = INPUT.parentElement.parentElement;
    let Datas_Range = await DatasRange();
    var Dico_Return = await DatasVictory(false, Datas_Range);
    var Compteur = 0;
    var Key = -1;
    let [Ligne_Past, Column] = Dico_Return[TYPE];
    Array.from(Ligne.children).forEach(function (Child) {
        if (Compteur === 0) {
            Key = IsNew(Choix, Child, Dico_Return);
            Child.innerHTML = Key + `<img src="${Image(Ligne_Past, Choix)}">`;
        } else if (Compteur > 0 && Choix !== "new" && (Choix in Ligne_Past && Ligne_Past[Choix][Column[Compteur]] !== null)) {
            if (Compteur === 1) {
                Child.innerHTML = "";
            }
            var Text_Temp = "";
            let Type = Dico_Return["Main"][Column[Compteur]].split("|");
            if (Choix in Ligne_Past && Ligne_Past[Choix][Column[Compteur]] !== null) {
                Ligne_Past[Choix][Column[Compteur]].forEach(Data => {
                    // console.log("Data:", Data);
                    let Div = DivOrNot(Type.length, 0, false);
                    switch (Type[0]) {
                        case "Info":
                        case "Infom":
                        case "Notes":
                            if (Array.isArray(Data[0])) {
                                Text_Temp += `<div class="oui"><input oninput="AjusterTaille(this)" type="text" value="${Data[0][0]}"></input>`;
                            } else if (Array.isArray(Data)) {
                                Text_Temp += `<div class="oui"><input oninput="AjusterTaille(this)" type="text" value="${Data[0]}"></input>${Div}`;
                            } else {
                                Text_Temp += `<div class="oui"><input oninput="AjusterTaille(this)" type="text" value="${Data}"></input>${Div}`;
                            }
                            break;
                        case "Date":
                            Text_Temp += `<div class="oui"><input style="width: 100px" oninput="AjusterTaille(this)" type="date" value="${FormatDate(String(Data))}"></input>${Div}`;
                            break;
                        default:
                            try {
                                let Dico = Dico_Return[Type[0]].map((item, index) => {
                                    return { ...item, ...(Dico_Return[Type[0]][index] || {}) };
                                });
                                if (Array.isArray(Data[0])) {
                                    var Temp = `<div class="oui"><select>`;
                                } else {
                                    var Temp = `<div class="oui"><select>`;
                                }
                                Object.keys(Dico[0]).forEach(Element => {
                                    if (Data[0][0] == Element && Array.isArray(Data[0])) {
                                        Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                    } else if (Data[0] == Element && Array.isArray(Data)) {
                                        Temp += `<option selected value="${Element}">${Element} - ${Dico[0][Element]["Nom"]}</option>`;
                                    } else if (Data == Element) {
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
                                console.log("Erreur,", Type[0], "n'existe pas dans le dico");
                            }
                            break;
                    }
                    for (let i = 1; i < Type.length; i++) {
                        let Div = DivOrNot(Type.length, i, false);
                        // console.log(Type, i, Type[i]);
                        switch (Type[i]) {
                            case "Duree":
                                if (Array.isArray(Data[0])) {
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[0][i].split("-")[0]}"></input> - <input oninput="AjusterTaille(this)" type="text" value="${Data[0][i].split("-")[1]}"></input>`;
                                } else {
                                    // console.log(Data, i);
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[i].split("-")[0]}"></input> - <input oninput="AjusterTaille(this)" type="text" value="${Data[i].split("-")[1]}"></input>${Div}`;
                                }
                                break;
                            case "Infos":
                                if (Array.isArray(Data[0])) {
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[0][i]}"></input>`;
                                } else {
                                    Text_Temp += ` | <input oninput="AjusterTaille(this)" type="text" value="${Data[i]}"></input>${Div}`;
                                }
                                break;
                            default:
                                try {
                                    let Dico = Dico_Return[Type[i]].map((item, index) => {
                                        return { ...item, ...(Dico_Return[Type[i]][index] || {}) };
                                    });
                                    if (Array.isArray(Data[0])) {
                                        var Temp = `<select>`;
                                    } else {
                                        var Temp = `<select>`;
                                    }
                                    Object.keys(Dico[0]).forEach(Element => {
                                        if (Data[0][i] == Element && Array.isArray(Data[0])) {
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
                                    console.log("Erreur,", Type[i], "n'existe pas dans le dico");
                                }
                                break;
                        }
                    }
                    Div = DivOrNot(Type.length, 0, false);
                });
            }
            // console.log(Text_Temp);
            Child.innerHTML += Text_Temp;
        } else if (Choix === 'new' && Compteur === 1) {
            // console.log(Key);
            const Nom = prompt(`Quel Nom ?`);
            Child.innerHTML = `<div class="oui"><input oninput="AjusterTaille(this)" type="text" value="${Nom}"></input></div>`;
            Dico_Return[TYPE][0][Key] = { Nom: [Nom] };
            Dico_Return[TYPE][0][Key] = { Nom: [Nom] };
            Dico_Return[TYPE][1].forEach(Cat => {
                if (Cat !== "Nom") { Dico_Return[TYPE][0][Key][Cat] = null; }
            });
            Dico_Return[TYPE][1].forEach(Cat => {
                if (Cat !== "Nom") { Dico_Return[TYPE][0][Key][Cat] = null; }
            });
            Save(Dico_Return);
        }
        if (Compteur > 1) {
            Child.innerHTML += `<div><button onclick="Add(this, '${Dico_Return["Main"][Column[Compteur]]}')">Ajouter</button><button onclick="Supp(this, '${Dico_Return["Main"][Column[Compteur]]}')">Supprimer</button></div>`;
        }
        Compteur++;
    });
    var table = Ligne.parentElement.parentElement.getElementsByTagName('tbody')[0];
    var newRow = table.insertRow();
    Compteur = [0, table.rows.length];
    Ligne_Past = Dico_Return[TYPE][0];
    // console.log(Ligne_Past);
    newRow.id = `${Compteur[1]}`;
    Text = ``;
    Column.forEach(() => {
        if (Compteur[0] === 0) {
            Text += `<td>0</td>`;
        } else if (Compteur[0] === 1) {
            Text += `<td><select id="numero" name="numero" onchange="ModifierPage(this, '${TYPE}')"><option style="text-align: center;" value="" selected>NUMERO</option><option value="new">Nouveau</option>`;
            Object.keys(Ligne_Past).forEach(element => {
                Text += `<option value="${element}">${element} - ${Ligne_Past[element]["Nom"]}</option>`;
            });
            Text += `</select></td>`;
        } else {
            Text += `<td data-score="${Dico_Return["Main"][Column[Compteur[0]]]}"></td>`;
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

function Plus(NUM, INT, COMPT) {
    if (NUM === 0 && COMPT !== document.querySelectorAll('table').length - 1 && INT !== 0) {
        return "|";
    } else {
        return "";
    }
}

function End(NUM, DATA) {
    // console.log(NUM, DATA, DATA[NUM], DATA.length, DATA[NUM] === "Duree", DATA.length > NUM);
    if (DATA[NUM] === "Duree") {
        return "-";
    } else if (DATA.length > parseInt(NUM) + 1) {
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
            Vj = 1;
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
                    var Type = "";
                }
                Cell.querySelectorAll('div').forEach(function (Child) {
                    Child.querySelectorAll('select, input[type="text"]').forEach(function (Mini_Child) {
                        if (Compteur[0] < Type.length || Type[Compteur - 1] === "Duree" || Mini_Child.getAttribute("data-score") === "SS") {
                            // console.log("=====>", Mini_Child.value);
                            Text += Plus(Compteur[1], Compteur[2], Xompteur) + Mini_Child.value + End(Compteur[1], Type);
                            Compteur[0]++;
                        } else if (Compteur[0] === Type.length || (Type[Compteur - 1] !== "Duree" && Compteur[0] === Type.length - 1)) {
                            Text += Mini_Child.value; // + "|";
                            Compteur[0] = 0;
                        }
                        Compteur[1]++;
                    });
                    Child.querySelectorAll('input[type="date"]').forEach(function (Mini_Child) {
                        console.log(Mini_Child.value);
                        if (Compteur[0] < Type.length || Type[Compteur - 1] === "Duree" || Mini_Child.getAttribute("data-score") === "SS") {
                            // console.log("=====>", Mini_Child.value);
                            Text += Plus(Compteur[1], Compteur[2], Xompteur) + ToFormatDate(Mini_Child.value) + End(Compteur[1], Type);
                            Compteur[0]++;
                        } else if (Compteur[0] === Type.length || (Type[Compteur - 1] !== "Duree" && Compteur[0] === Type.length - 1)) {
                            Text += ToFormatDate(Mini_Child.value); // + "|";
                            Compteur[0] = 0;
                        }
                        Compteur[1]++;
                    });
                    Compteur[0] = 0;
                    Compteur[1] = 0;
                    Compteur[2]++;
                });
                // console.log(Text);
                Cell.innerHTML = Text;
            }
        }
        Xompteur++;
    })


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
    let Dico_Return_Spe = await DatasVictory(false, Datas_Range);
    // console.log("dicoReturnPast", dicoReturnPast, parseInt(localStorage.getItem(`Where${ANIME}`)));
    var Main_Datas_Past = Dico_Return_Spe["Main"];
    var Perso_Datas_Past = Dico_Return_Spe["Perso"][0];
    var [Chap_Datas_Past, Chap_Datas_Columns_Past] = Dico_Return_Spe["Chapter"];
    var Div_Pro = document.getElementById("modification");
    var Liste = [];
    Object.keys(Datas_Range).forEach(element => {
        if (!(["Main", "id", "Link"].includes(element))) {
            console.log(Dico_Return_Spe, element)
            Liste.push(Dico_Return_Spe[element].concat([element]));
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
                Text += `<td>${Compteur[1]}</td>`;
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
}
