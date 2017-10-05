export var frDictionary = {
    index: {
        alreadyPaid: 'a déjà payé',
        alreadyHasNameError: 'Ce prénom a déjà été attribué à un participant',
        noNameError: 'Ajoutez un nom SVP',
        validAmountError: "Fournissez une somme valide pour chacune des dépenses SVP",
        event: 'ÉVÉNEMENT',
        for: 'pour ',
        and: ' et ',
        ItIs: 'il/elle y participe ',
        ItIsNot: "il/elle n'y participe pas ",
        counted: '',
        calculate: 'Calculer',
        inputs: {
            event: "Nom de l'événement",
            person: "Prénom du participant"
        },
        popups: {
            removePerson: {
                title: 'Éliminer ce participant ?',
                noButton: 'Non',
                yesButton: 'Oui',
            },
            addAmountToExpense: {
                title: 'Ajouter une dépense à cette catégorie ',
                noButton: 'Annuler',
                yesButton: 'Sauvegarder',
            }
        }
    },
    eventDetails: {
        title: "DÉTAILS DE L'ÉVÉNEMENT",
        expenses: 'Dépenses',
        newExpensePlaceholder: 'Nouvelle dépense',
        expensePlaceholder: "Nom de la dépense",
        alredyExpenseError: 'Dépense déjà existante',
        noNameExpenseError: 'Donnez un nom à cette dépense SVP',
        popups: {
            removeExpense: {
                title: "Éliminer cette dépense?",
                subtitle: "Ce sera éliminé des dépenses de tous les participants.",
                noButton: "Non",
                yesButton: "Oui"
            },
            expenseError: {
                title: "Erreur",
                subtitle: "L'événement doit avoir au moins une dépense."
            },
        }

    },
    list: {
        title: 'MES ÉVÉNEMENTS',
        created: 'Créé le',
        noNameEvent: 'Événement sans nom',
        noPersonDescription: 'Ce "plus" doit servir à quelque chose...',
        inputs: {
            search: "Rechercher un événement"
        },
        popups: {
            removeEvent: {
                title: "Éliminer cet événement?",
                noButton: "Non",
                yesButton: "Oui",
            }
        }
    },
    menu: {
        menu: "MENU",
        list: "Événements",
        help: "Aide",
        settings: "Paramètres"
    },
    settings: {
        title: "PARAMÈTRES",
        language: "Langue",
        languageSettings: "Langue choisie",
        newExpensePlaceholder: 'Nouvelle dépense',
        english: "Anglais",
        spanish: "Espagnol",
        french: "Français",
        defaultExpense: 'Dépenses par défaut',
        contact: 'Contact',
        contactText: 'Besoin de nous contacter?',
        currencySettings: 'Monnaie',
        currencySymbol: 'Monnaie choisie',
        currencies: {
            default: '$',
            euro: '€',
            pound: '£'
        },
        popups: {
            removeExpense: {
                title: "Éliminer dépense par défaut?",
                noButton: "Non",
                yesButton: "Oui",
            },
        },
        alredyExpenseError: 'Attention ! Il existe déjà une dépense avec ce nom',
        noNameExpenseError: 'Donnez un nom à cette dépense SVP',
        defaultLabel1: 'Boissons',
        defaultLabel2: 'Nourriture',
        defaultLabel3: 'Autres'
    },
    help: {
        title: "AIDE",
        appTitle: "Pukete",
        slogan: "Merci d'avoir choisi l'app :) Glissez pour savoir comment ça fonctionne",
        skip: "Sauter",
        slide1Title: 'Créez un événement',
        slide2Title: 'Ajoutez les participants et leurs dépenses',
        slide3Title: 'Et calculez !',
        slide3SubTitle: 'Vous pouvez aussi partager les résultats !',
        slide3Button: "C'est simple, c'est parti !",
    },
    results: {
        title: "RÉSULTATS",
        totalFor: "Total pour",
        noNameEvent: 'Événement sans nom',
        spentInTotal: "a dépensé au total: ",
        details: 'Details:',
        and: " et",
        gets: "prend ",
        gives: "paye ",
        isEven: "is even",
        paid: " a payé ",
        for: " pour ",
        counted: "il/elle y a participé",
        notCounted: "il/elle n'y a pas participé",
        noConsumption: " on a payé mais on n'a pas consommé.",
        attention: "Attention, pour ",
        in: 'pour ',
        itHasBeenSpent: ' on a dépensé: '
    }
};