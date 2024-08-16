var MODIF = localStorage.getItem('Modif');
var I = localStorage.getItem('I');
if (I === null) {
    I = 1;
    localStorage.setItem('I', I);
}
var II = localStorage.getItem('II');
if (II === null) {
    II = 1;
    localStorage.setItem('II', II);
}
var CHAR = (new URLSearchParams(window.location.search)).get('char');
var CHAP = (new URLSearchParams(window.location.search)).get('chap');


async function RecupSheetDatas(ID, TITLE, RANGE) {
    /*
    ID (STR): Id du Lien
    TITLE (STR): Titre de l'anime et de la page Google Sheet
    RANGE (STR): Tableau à prendre dans le Google Sheet
    */
    // console.log(ID, TITLE, RANGE);
    try {
        const Url = `https://docs.google.com/spreadsheets/d/${ID}/gviz/tq?sheet=${TITLE}&range=${RANGE}`;
        const Response = await fetch(Url);
        const Text = await Response.text();
        const Data = JSON.parse(Text.substr(47).slice(0, -2));
        return Data;
    } catch (error) { throw error; }
}

async function TraiterSheetDatas(DATA, TYPE) {
    /*
    DATA (DICT): Données à traiter
    TYPE (STR): Catégorie (Main, Général, Perso...)
    */
    if (TYPE === "Main") {
        return TraiterMainDatas(DATA)
    } else {
        try {
            var Temp = 0;
            Datacolumns = DATA.table.cols.map(Element => Element.label);
            if (Datacolumns[0] == "") {
                Datacolumns = DATA.table.rows[0].c.map(Element => Element.v);
                Temp++;
            }
            let NewData = {};
            let WhereExist = 0;
            for (let i = Temp; i < DATA.table.rows.length; i++) {
                // console.log(DATA.table.rows[i].c[0].v, DATA.table.rows[i].c[1].v);
                if (NewData[DATA.table.rows[i].c[WhereExist].v] !== undefined) {
                    for (let j = WhereExist + 1; j < Datacolumns.length; j++) {
                        // console.log(DATA.table.rows[i].c[j], DATA.table.rows[i].c[j]['v']);
                        if (DATA.table.rows[i].c[j] !== null && DATA.table.rows[i].c[j]['v'] !== null) {
                            TempData = StrToListSpe(DATA.table.rows[i].c[j].v);
                            // console.log("TempData:", TempData);
                            for (let k = 0; k < TempData.length; k++) {
                                if (NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] === null) {
                                    NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] = StrToList(TempData[k]);
                                } else if (TempData[k][0] === "+") {
                                    NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]].push(TempData[k].slice(1).split(","));
                                } else if (TempData[k].includes("=>")) {
                                    test = TempData[k].split("=>").map(item => item.split(","));
                                    for (let k = 0; k < NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]].length; k++) {
                                        const array1 = NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]][k];
                                        const array2 = test[0];
                                        if (Array.isArray(array1) && Array.isArray(array2) && array1.length === array2.length && array1.every((value, index) => value === array2[index])) {
                                            NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]][k] = test[1];
                                        } else if (array1 === array2[0]) {
                                            NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]][k] = test[1][0];
                                        }
                                    }
                                } else {
                                    NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] = StrToList(TempData[k]);
                                }
                            }
                        }
                    }
                } else {
                    NewData[DATA.table.rows[i].c[WhereExist].v] = {};
                    for (let j = WhereExist + 1; j < Datacolumns.length; j++) {
                        if (DATA.table.rows[i].c[j] !== null && DATA.table.rows[i].c[j]['v'] !== null) {
                            TempData = StrToListSpe(DATA.table.rows[i].c[j].v);
                            for (let k = 0; k < TempData.length; k++) {
                                if (NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] === undefined) {
                                    if (TempData[k].includes("=>")) {
                                        test = TempData[k].split("=>").map(item => item.split(","));
                                        NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] = [test];
                                    } else if (TempData[k][0] === "+") {
                                        NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] = [TempData[k].slice(1).split(",")];
                                    } else {
                                        NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] = StrToList(TempData[k]);
                                    }
                                } else {
                                    if (TempData[k].includes("=>")) {
                                        test = TempData[k].split("=>").map(item => item.split(","));
                                        NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]].push(test);
                                    } else if (TempData[k][0] === "+") {
                                        NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]].push(TempData[k].slice(1).split(","));
                                    } else {
                                        NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]].push(StrToList(TempData[k])[0]);
                                    }
                                }
                            }
                        } else {
                            NewData[DATA.table.rows[i].c[WhereExist].v][Datacolumns[j]] = null;
                        }
                    }
                }
            }
            return [NewData, Datacolumns];
        } catch (error) { throw error; }
    }
}

// SPLIT PAR "," SI IL Y'EN A UNE
function StrToList(STR) {
    if (typeof STR === 'string') {
        if (STR.includes(",")) {
            return [STR.split(",")];
        } else {
            return [STR];
        }
    } else {
        return [STR.toString()];
    }
}

// SPLIT PAR "\" SI IL Y'EN A UNE
function StrToListSpe(STR) {
    if (typeof STR === 'string') {
        if (STR.includes("|")) {
            //console.log(STR.split("\\"));
            return STR.split("|");
        } else {
            return [STR];
        }
    } else {
        return [STR.toString()];
    }
}

function Ordre(VAL, CHAPTERS) {
    if (VAL === "") {
        return ""
    } else {
        // console.log(CHAPTERS, VAL);
        return CHAPTERS[VAL]["Ordre"][0]
    }
}

// FONCTION POUR SAVOIR SI L'EVENEMENT EST ACTUEL
function InTime(STR, CHAP, CHAPTERS) {
    // console.log("InTime", STR, CHAP, CHAPTERS)
    let Data = STR.replaceAll("?", "");
    Data = Data.split("-");
    return parseInt(Ordre(Data[0], CHAPTERS)) <= Ordre(CHAP, CHAPTERS) && (Ordre(Data[1], CHAPTERS) === "" || Ordre(CHAP, CHAPTERS) < parseInt(Ordre(Data[1], CHAPTERS)));
}

async function TraiterMainDatas(DATA) {
    try {
        Datacolumns = DATA.table.cols.map(element => element.label)
        let NewData = [];

        for (let i = 0; i < DATA.table.rows.length; i++) {
            // console.log(DATA.table.rows[i]);
            NewData[DATA.table.rows[i].c[0].v] = DATA.table.rows[i].c[1].v;
        }
        return NewData;
    } catch (error) {
        throw error;
    }
}

async function DatasRange() {
    var Modif = localStorage.getItem('Modif');
    if (Modif === 'true') {
        try {
            var NewDatas = await RecupSheetDatas(SHEET_ID, "General", GENERAL_RANGE);
            var Datas = {};
            NewDatas.table.rows.forEach(element => {
                // console.log(element);
                Datas[element.c[0].v] = element.c[1].v;
            })
            // Supprimer la base de données existante
            indexedDB.deleteDatabase(`MaBaseDeDonnees${ANIME}_General`);

            // Réinitialiser la variable locale II à 1
            II = 1;
            localStorage.setItem('II', II);
            // console.log("datas:", Datas);
            var Request = indexedDB.open(`MaBaseDeDonnees${ANIME}_General`, II);

            Request.onupgradeneeded = function (event) {
                var Db = event.target.result;
                var ObjectStore = Db.createObjectStore('MonObjet', { keyPath: 'id', autoIncrement: true }); // Créer un objetStore (équivalent à une table dans une base de données relationnelle)
            };

            Request.onsuccess = function (event) {
                var Db = event.target.result;
                var Transaction = Db.transaction(['MonObjet'], 'readwrite'); // Commencer une transaction en mode lecture-écriture
                var ObjectStore = Transaction.objectStore('MonObjet'); // Récupérer l'objet store
                var NewRequest = ObjectStore.put(Datas);

                NewRequest.onsuccess = function (event) {
                    console.log("Objet General modifié avec succès !");
                };

                NewRequest.onerror = function (event) {
                    console.error("Erreur lors de l'ajout de l'objet General:", event.target.error);
                };
            };

            Request.onerror = function (event) {
                console.error("Erreur lors de l'ouverture de la base de données General:", event.target.error);
            };

        } catch (error) {
            console.error('Une erreur est survenue :', error);
        }
    } else {
        try {
            var Promesse = new Promise(function (Resolve, Reject) {
                var Request = indexedDB.open(`MaBaseDeDonnees${ANIME}_General`, II);

                Request.onsuccess = function (event) {
                    var Db = event.target.result; // Obtention de la référence à la base de données ouverte
                    var Transaction = Db.transaction(['MonObjet'], 'readonly'); // Utilisation de la base de données pour effectuer des opérations | par exemple, récupérer des données depuis un objet store
                    var OjectStore = Transaction.objectStore('MonObjet');
                    var GetRequest = OjectStore.get(1);

                    GetRequest.onsuccess = function (event) {
                        Datas = GetRequest.result;
                        // console.log("Récupération réussie pour : Général")
                        delete Datas.id;
                        Resolve(Datas);
                    };

                    GetRequest.onerror = function (event) {
                        console.error("Erreur lors de la récupération de l'objet Général:", event.target.error);
                        Reject(event.target.error);
                    };
                };

                Request.onerror = function (event) {
                    console.error("Erreur lors de l'ouverture de la base de données Général:", event.target.error);
                    Reject(event.target.error);
                };

                Request.onupgradeneeded = async function (event) {
                    MODIF = 'true';
                    localStorage.setItem('Modif', MODIF);
                    II++;
                    localStorage.setItem('II', II);
                    location.reload();
                };
            });
            Datas = await Promesse;
            return Datas;

        } catch (error) {
            console.error('Une erreur est survenue :', error);
            var NewDatas = await RecupSheetDatas(SHEET_ID, "General", GENERAL_RANGE);
            var Datas = {};
            NewDatas.table.rows.forEach(element => {
                // console.log(element);
                Datas[element.c[0].v] = element.c[1].v;
            })
            return Datas;
        }
    }

    return Datas;
}

async function DatasVictory(SPE, DATAS) {
    var MODIF = localStorage.getItem('Modif');
    if (MODIF === 'true' || SPE === true) {
        try {
            var LISTE = [];
            Object.keys(DATAS).forEach(ele => {
                LISTE.push(ele);
            })
            var Dico = {};
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS[Element], false), Element);
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent

            if (SPE === false) {
                var Request = indexedDB.open(`MaBaseDeDonnees${ANIME}`, I);

                Request.onupgradeneeded = function (event) {
                    var Db = event.target.result;
                    var ObjectStore = Db.createObjectStore('MonObjet', { keyPath: 'id', autoIncrement: true }); // Créer un objetStore (équivalent à une table dans une base de données relationnelle)
                };

                Request.onsuccess = function (event) {
                    var Db = event.target.result;
                    var Transaction = Db.transaction(['MonObjet'], 'readwrite'); // Commencer une transaction en mode lecture-écriture
                    var ObjectStore = Transaction.objectStore('MonObjet'); // Récupérer l'objet store
                    var Data = Dico; // Ajouter l'objet à l'objet store
                    // console.log("Data:", Data, Element);
                    Data["id"] = 1;
                    var NewRequest = ObjectStore.put(Data);

                    NewRequest.onsuccess = function (event) {
                        console.log("Objet modifié avec succès !");
                    };

                    NewRequest.onerror = function (event) {
                        console.error("Erreur lors de l'ajout de l'objet :", event.target.error);
                    };
                };

                Request.onerror = function (event) {
                    console.error("Erreur lors de l'ouverture de la base de données :", event.target.error, Element);
                };
            }

        } catch (error) {
            console.error('Une erreur est survenue :', error);
        }
        if (!SPE) {
            MODIF = false;
            localStorage.setItem('Modif', MODIF);
        }
    }
    else {
        var Dico = {};
        try {
            var Promesse = new Promise(function (Resolve, Reject) {
                var Request = indexedDB.open(`MaBaseDeDonnees${ANIME}`, I);

                Request.onsuccess = function (event) {
                    var Db = event.target.result; // Obtention de la référence à la base de données ouverte
                    var Transaction = Db.transaction(['MonObjet'], 'readonly'); // Utilisation de la base de données pour effectuer des opérations | par exemple, récupérer des données depuis un objet store
                    var ObjectStore = Transaction.objectStore('MonObjet');
                    var GetRequest = ObjectStore.get(1);

                    GetRequest.onsuccess = function (event) {
                        Dico = GetRequest.result;
                        // console.log("Récupération réussie pour :", Element)
                        Resolve();
                    };

                    GetRequest.onerror = function (event) {
                        console.error("Erreur lors de la récupération de l'objet :", event.target.error);
                        Reject(event.target.error);
                    };
                };

                Request.onerror = function (event) {
                    console.error("Erreur lors de l'ouverture de la base de données :", event.target.error);
                    Reject(event.target.error);
                };

                Request.onupgradeneeded = async function (event) {
                    MODIF = 'true';
                    localStorage.setItem('Modif', MODIF);
                    I++;
                    localStorage.setItem('I', I);
                    location.reload();
                };
            });
            await Promesse;

        } catch (error) {
            console.error('Une erreur est survenue :', error);
            var Dico = {};
            var LISTE = [];
            Object.keys(DATAS).forEach(ele => {
                LISTE.push(ele);
            })
            var promises = LISTE.map(async function (Element) { // Création d'un tableau de promesses
                Dico[Element] = await TraiterSheetDatas(await RecupSheetDatas(SHEET_ID, Element, DATAS[Element], false), Element);
            });
            await Promise.all(promises); // Attendre que toutes les promesses se terminent
            console.log(Dico);
            return Dico;
        }
    }

    return Dico;
}

function AfficherButtons(CHAP, SUP) {
    var Text = "";
    CHAP = parseInt(CHAP);
    if (CHAP > 1) {
        Text += `<a href="index.html?chap=1${SUP}"><button>1</button></a> ←`;
    }
    if (CHAP >= 12) {
        Text += `<a href="index.html?chap=${CHAP - 10}${SUP}"><button>${CHAP - 10}</button></a> -`;
    }
    if (CHAP >= 3) {
        Text += `<a href="index.html?chap=${CHAP - 1}${SUP}"><button>${CHAP - 1}</button></a> |`;
    }
    if (CHAP + 1 < CHAPMAX) {
        Text += `| <a href="index.html?chap=${CHAP + 1}${SUP}"><button>${CHAP + 1}</button></a>`;
    }
    if (CHAP + 10 < CHAPMAX) {
        Text += `- <a href="index.html?chap=${CHAP + 10}${SUP}"><button>${CHAP + 10}</button></a>`;
    }
    if (CHAPMAX !== CHAP) {
        Text += `→ <a href="index.html?chap=${CHAPMAX}${SUP}"><button>${CHAPMAX}</button></a>`;
    }
    return Text;
}

function AllNull(DICT) {
    for (let key in DICT) {
        if (key !== "chap" && DICT[key]["Numero"] !== null) {
            return false
        }
    }
    return true
}

function FirstNoNull(DICT) {
    for (let key in DICT) {
        if (key !== "chap" && DICT[key]["Numero"] !== null) {
            return DICT[key];
        }
    }
}

async function General() {
    async function Afficher(TYPE, DATA, MAIN, DICT, LINK) {
        if (TYPE[DATA] === null || MAIN[DATA] === undefined) {
            return "";
        } else {
            let Affichage = [DATA];
            let Types = MAIN[DATA].split("|");
            TYPE[DATA].forEach(Element => {
                var TempList = "";
                var Compteur = 0;
                Types.forEach(Type => {
                    switch (Type) {
                        case "Info":
                            if (Types[Types.length - 1] === "Duree" || Types[Types.length - 1] !== "Duree") {
                                if (MAIN[DATA] === "Info" && Array.isArray(TYPE[DATA])) {
                                    TYPE[DATA].forEach(Element => {
                                        TempList += Element;
                                    });
                                } else if (Array.isArray(TYPE[DATA])) {
                                    TempList += TYPE[DATA][0][0];
                                } else {
                                    TempList += TYPE[DATA];
                                }
                            }
                            break;
                        case "Infos":
                            if (Types[Types.length - 1] === "Duree" || Types[Types.length - 1] !== "Duree") { TempList += " (" + Element[1] + ")"; }
                            break;
                        case "Duree":
                        case "Notes":
                        case "Date":
                        case "Infom":
                            break;
                        default:
                            // console.log("Afficher - Type:", Type)
                            if (Types[Types.length - 1] === "Duree" || Types[Types.length - 1] !== "Duree") {
                                if (Array.isArray(Element)) {
                                    El = Element[Compteur];
                                } else {
                                    El = Element;
                                }
                                // console.log(DICT, Type)
                                // console.log(DICT[Type][0], El);
                                if (DICT[Type][0][El]["Images"] === undefined || DICT[Type][0][El]["Images"] === null) {
                                    TempList += "<a href='index.html?" + LINK[Type] + "=" + El + "'>" + DICT[Type][0][El]['Nom'] + "</a>";
                                } else {
                                    TempList += "<a href='index.html?" + LINK[Type] + "=" + El + "'><img class='pitite' src='" + DICT[Type][0][El]["Images"] + "'>" + DICT[Type][0][El]['Nom'] + "</a>";
                                }
                            }
                            break;
                    }
                    Compteur++;
                })
                if (TempList !== "") {
                    Affichage.push(TempList);
                }
            });
            if (Affichage[0] !== undefined && Affichage.length !== 1) {
                return Affichage.join("<br>");
            } else {
                return "";
            }
        }
    }
    Datas = await DatasRange();
    console.log("Datas:", Datas);

    try {
        var dicoReturn = await DatasVictory(false, Datas);
        console.log("dicoReturn:", dicoReturn);
        var MainDatas = dicoReturn["Main"];
        var [PersoDatas, PersoDatasColumns] = dicoReturn["Perso"];
        var [ChapDatas, ChapDatasColumns] = dicoReturn["Chapter"];

        var Link = {};
        var Linked = {};
        Object.keys(dicoReturn["Link"][0]).forEach(Element => {
            Element = dicoReturn["Link"][0][Element]
            Link[Element["Catégorie"]] = Element["ShortName"];
            if (Linked[Element["Catégorie"]] !== undefined) {
                Linked[Element["Catégorie"]]["Link"].push({
                    Lien: Element["Lien"],
                    NomLien: Element["NomLien"],
                    Duree: Element["Duree"],
                    Colonne: Element["Colonne"]
                })
            } else {
                Linked[Element["Catégorie"]] = {
                    ShortName: Element["ShortName"],
                    Link: [{
                        Lien: Element["Lien"],
                        NomLien: Element["NomLien"],
                        Duree: Element["Duree"],
                        Colonne: Element["Colonne"]
                    }]
                }
            }
        });
        // console.log(Linked)

        ShortNames = {}
        Object.keys(Link).forEach(l => {
            ShortNames[Link[l]] = { Numero: (new URLSearchParams(window.location.search)).get(Link[l]), Nom: l };
        });

        // RIEN
        // console.log(ShortNames, AllNull(ShortNames));
        if (CHAP === null && AllNull(ShortNames)) {
            let Text = "";
            for (let k = 0; k <= CHAPMAX; k++) {
                if (ChapDatas[k] !== undefined) {
                    if (ChapDatas[k]["Nom"] !== null) {
                        Text += `<a href="index.html?chap=${k}"><div class="chapter-line"><div class="chapter-number">${k}</div><div class="chapter-title">${ChapDatas[k]["Nom"]}<br></div></div></a>`;
                    } else {
                        Text += `<a href="index.html?chap=${k}"><div class="chapter-line"><div class="chapter-number">${k}</div><div class="chapter-title">Chapitre ${k}<br></div></div></a>`;
                    }
                }
            }
            // document.getElementById("Chapter_Title").innerHTML = `TOUS LES CHAPITRES<button id="toggleViewButton"><i class="fi fi-rr-apps-sort"></i></button>`;
            document.getElementById("Chapter_Data").innerHTML = Text;
            Text = "";
            for (let i = 0; i <= Object.keys(PersoDatas).length; i++) {
                if (PersoDatas[i] !== undefined) {
                    if (PersoDatas[i]["Images"] !== null) {
                        Text += `<a href="index.html?char=${i}"><div class="chapter-line"><div class="chapter-number"><img class="pitite" src="${PersoDatas[i]["Images"][0][0]}"></div><div class="chapter-title">${PersoDatas[i]["Nom"]}</div></div></a>`;
                    } else {
                        Text += `<a href="index.html?char=${i}"><div class="chapter-line"><div class="chapter-number"><img class="pitite" src="https://images.assetsdelivery.com/compings_v2/kritchanut/kritchanut1406/kritchanut140600093.jpg"></div><div class="chapter-title">${PersoDatas[i]["Nom"]}</div></div></a>`;
                    }
                }
            }
            document.getElementById("Perso_Data").innerHTML = Text;
            // document.getElementById("Discord_Data").innerHTML = `<iframe src="https://discord.com/widget?id=1229847530737500220&theme=dark" width="100%" height="1000px" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>`;

            // CHAP
        } else if (CHAP !== null && AllNull(ShortNames)) {
            if (document.getElementById("container") !== undefined) { document.getElementById("container").remove(); }
            let Text = "Personnages du chapitre<br><div class='vu'>";
            if (ChapDatas[CHAP] !== null && ChapDatas[CHAP]["Personnages"] !== null && ChapDatas[CHAP]["Personnages"][0] !== null) {
                for (let k = 0; k <= ChapDatas[CHAP]["Personnages"][0].length; k++) {
                    if (PersoDatas[ChapDatas[CHAP]["Personnages"][0][k]] !== undefined && ChapDatas[CHAP]["Personnages"][0][k] !== undefined) {
                        if (PersoDatas[ChapDatas[CHAP]["Personnages"][0][k]]["Images"] !== null) {
                            Text += `<p><a href="index.html?char=${ChapDatas[CHAP]["Personnages"][0][k]}"><img class="apercu" src="${PersoDatas[ChapDatas[CHAP]["Personnages"][0][k]]["Images"][0][0]}">${PersoDatas[ChapDatas[CHAP]["Personnages"][0][k]]["Nom"]}</a></p>`;
                        } else {
                            Text += `<p><a href="index.html?char=${ChapDatas[CHAP]["Personnages"][0][k]}"><img class="apercu" src="https://images.assetsdelivery.com/compings_v2/kritchanut/kritchanut1406/kritchanut140600093.jpg">${PersoDatas[ChapDatas[CHAP]["Personnages"][0][k]]["Nom"]}</a></p>`;
                        }
                    }
                }
            } else {
                Text += "<p>Aucun</p>"
            }
            Text += "</div>Personnages mentionnés<br><div class='mentio'>";
            if (ChapDatas[CHAP] !== null && ChapDatas[CHAP]["Mentionnés"] !== null && ChapDatas[CHAP]["Mentionnés"][0] !== null) {
                for (let k = 0; k <= ChapDatas[CHAP]["Mentionnés"][0].length; k++) {
                    if (ChapDatas[CHAP]["Mentionnés"][0][k] !== undefined) {
                        if (PersoDatas[ChapDatas[CHAP]["Mentionnés"][0][k]]["Images"] !== null) {
                            Text += `<p><a href="index.html?char=${ChapDatas[CHAP]["Mentionnés"][0][k]}"><img class="apercu" src="${PersoDatas[ChapDatas[CHAP]["Mentionnés"][0][k]]["Images"][0]}">${PersoDatas[ChapDatas[CHAP]["Mentionnés"][0][k]]["Nom"]}</a></p>`;
                        } else {
                            Text += `<p><a href="index.html?char=${ChapDatas[CHAP]["Mentionnés"][0][k]}"><img class="apercu" src="https://images.assetsdelivery.com/compings_v2/kritchanut/kritchanut1406/kritchanut140600093.jpg">${PersoDatas[ChapDatas[CHAP]["Mentionnés"][0][k]]["Nom"]}</a></p>`;
                        }
                    }
                }
            } else {
                Text += "<p>Aucun</p>"
            }
            Text += "</div>";

            document.getElementById("Character_Name").innerHTML = `TOUS LES PERSOS DU CHAP ${CHAP}`;
            document.getElementById("Data").innerHTML = Text;
            let NewDiv = document.createElement("div");
            NewDiv.classList = "ButtonsNav";
            NewDiv.innerHTML = `<div class="DivButtonsNav">${AfficherButtons(CHAP, "")}</div>`;
            document.body.appendChild(NewDiv);
            // CHAR
        } else if (!AllNull(ShortNames)) {
            let ValNoNull = FirstNoNull(ShortNames)["Numero"];
            let Type = FirstNoNull(ShortNames)["Nom"];
            if (document.getElementById("container") !== undefined) { document.getElementById("container").remove(); }
            document.getElementById("Character_Name").innerHTML = dicoReturn[Type][0][ValNoNull]["Nom"];
            var text = [];
            for (let i = 1; i < dicoReturn[Type][1].length; i++) {
                if (dicoReturn[Type][1][i] === "Numéro" && dicoReturn[Type][0][ValNoNull][dicoReturn[Type][1][i]] !== null) {
                    continue;
                } else if (dicoReturn[Type][1][i] === "Image" && dicoReturn[Type][0][ValNoNull][dicoReturn[Type][1][i]] !== null) {
                    text.unshift("<img src='" + dicoReturn[Type][0][ValNoNull][dicoReturn[Type][1][i]][0][0] + "' alt='" + dicoReturn[Type][0][ValNoNull]["Nom"] + "'>");
                } else {
                    result = await Afficher(dicoReturn[Type][0][ValNoNull], dicoReturn[Type][1][i], MainDatas, dicoReturn, Link);
                    if (result !== "") {
                        text.push(result);
                    }
                }
            }

            Linked[Type]["Link"].forEach(a => {
                var Temp = [a["NomLien"]];
                dicoReturn[a["Lien"]][0].forEach(b => {
                    if (Array.isArray(b[a["Colonne"]]) && Array.isArray(b[a["Colonne"]][0])) {
                        b[a["Colonne"]].forEach(Each => {
                            if (a["Duree"][0] === "False" || (a["Duree"][0] === "True" && b[a["Colonne"]] !== null)) {
                                if (Each !== null && Each.includes(ValNoNull)) {
                                    if (a["Lien"][0] === "Chapter") {
                                        Temp.push("<a href='index.html?chap=" + dicoReturn[a["Lien"]][0].indexOf(b) + "'>" + b["Nom"] + "</a>");
                                    } else {
                                        Temp.push("<a href='index.html?" + Link[a["Lien"][0]][0] + "=" + dicoReturn[a["Lien"]][0].indexOf(b) + "'>" + b["Nom"] + "</a>");
                                    }
                                }
                            }
                        });
                    } else {
                        if (a["Duree"][0] === "False" || (a["Duree"][0] === "True" && b[a["Colonne"]] !== null)) {
                            // console.log(a["Colonne"], b, b[a["Colonne"]]);
                            if (b[a["Colonne"]] !== null && b[a["Colonne"]] !== undefined && b[a["Colonne"]].includes(ValNoNull)) {
                                if (a["Lien"][0] === "Chapter") {
                                    Temp.push("<a href='index.html?chap=" + dicoReturn[a["Lien"]][0].indexOf(b) + "'>" + b["Nom"] + "</a>");
                                } else {
                                    Temp.push("<a href='index.html?" + Link[a["Lien"][0]][0] + "=" + dicoReturn[a["Lien"]][0].indexOf(b) + "'>" + b["Nom"] + "</a>");
                                }
                            }
                        }
                    }
                });
                if (Temp.length !== 1) {
                    text.push(Temp.join("<br>"));
                }
            });

            document.getElementById("Data").innerHTML = text.join("<br><br>");
            let NewDiv = document.createElement("div");
            NewDiv.classList = "ButtonsNav";
            NewDiv.innerHTML = `<div class="DivButtonsNav">${AfficherButtons(CHAP, `&${Link[Type]}=${ValNoNull}`)}</div>`;
            document.body.appendChild(NewDiv);
        }
    } catch (erreur) {
        console.error(erreur);
    }
}