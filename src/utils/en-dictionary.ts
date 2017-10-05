export var enDictionary = {
    index: {
        alreadyPaid: 'already paid',
        alreadyHasNameError: 'Another person already has this name',
        noNameError: 'Please add a name',
        validAmountError: "Please provide a valid amount for all the expenses",
        event: 'EVENT',
        for: 'for ',
        and: ' and ',
        ItIs: 'its ',
        ItIsNot: "it isn't ",
        counted: 'counted',
        calculate: 'Calculate',
        inputs: {
            event: "Event's name",
            person: "Person's name"
        },
        popups: {
            removePerson: {
                title: 'Remove person?',
                noButton: 'No',
                yesButton: 'Yes',
            },
            addAmountToExpense: {
                title: 'Add money to expense',
                noButton: 'Cancel',
                yesButton: 'Save',
            }
        }
    },
    eventDetails: {
        title: "EVENT'S DETAILS",
        expenses: 'Expenses',
        newExpensePlaceholder: 'New expense',
        expensePlaceholder: "Expense's name",
        alredyExpenseError: 'There is already an expense with that name',
        noNameExpenseError: 'Please add a name for the expense',
        popups: {
            removeExpense: {
                title: "Remove expense?",
                subtitle: "It will be removed from the persons expenses also.",
                noButton: "No",
                yesButton: "Yes"
            },
            expenseError: {
                title: "Error",
                subtitle: "The event must have at least one expense."
            },
        }

    },
    list: {
        title: 'MY EVENTS',
        created: 'Created on',
        noNameEvent: 'No name event',
        noPersonDescription: 'That button should do something important...',
        inputs: {
            search: "Search event"
        },
        popups: {
            removeEvent: {
                title: "Remove event?",
                noButton: "No",
                yesButton: "Yes",
            }
        }
    },
    menu: {
        menu: "Menu",
        list: "Events",
        help: "Help",
        settings: "Settings"
    },
    settings: {
        title: "SETTINGS",
        language: "Language",
        newExpensePlaceholder: 'New expense',
        languageSettings: "App language",
        english: "English",
        spanish: "Spanish",
        french: "French",
        defaultExpense: 'Default expenses',
        contact: 'Contact',
        contactText: 'Any doubts or bugs to report?',
        currencySettings: 'Currency',
        currencySymbol: 'Currency symbol',
        currencies: {
            default: '$',
            euro: '€',
            pound: '£'
        },
        popups: {
            removeExpense: {
                title: "Remove default expense?",
                noButton: "No",
                yesButton: "Yes",
            },
        },
        alredyExpenseError: 'There is already an expense with that name',
        noNameExpenseError: 'Please add a name for the expense',
        defaultLabel1: 'Drinks',
        defaultLabel2: 'Food',
        defaultLabel3: 'Others'
    },
    help: {
        title: "HELP",
        appTitle: "PUKETE",
        slogan: "Thanks for chossing the app :) Slide to know how it works",
        skip: "skip",
        slide1Title: 'Just add an event',
        slide2Title: 'Add people and their expenses',
        slide3Title: 'And Calculate!',
        slide3SubTitle: 'Also you can share after...',
        slide3Button: 'Peace of Cake, Let’s Begin!'
    },
    results: {
        title: "RESULTS",
        totalFor: "Total for",
        noNameEvent: 'No name event',
        spentInTotal: "spent in total: ",
        details: 'Details:',
        and: " and",
        gets: "gets ",
        gives: "gives ",
        isEven: "is even",
        paid: " paid ",
        for: " For ",
        counted: "it was counted",
        notCounted: "it wasn't counted",
        noConsumption: " there's been payments but no consuption.",
        attention: "Attention, in ",
        in: 'In ',
        itHasBeenSpent: ' it has been spent: '
    }
};