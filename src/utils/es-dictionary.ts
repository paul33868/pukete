export var esDictionary = {
    index: {
        alreadyPaid: 'ya pagó',
        alreadyHasNameError: 'Otra persona ya tiene este nombre',
        noNameError: 'Por favor introduzca un nombre',
        validAmountError: "Por favor introduzca un valor válido para todos los gastos",
        event: 'EVENTO',
        for: 'por ',
        and: ' y ',
        ItIs: 'está ',
        ItIsNot: 'no está ',
        counted: 'contado/a',
        calculate: 'Calcular',
        inputs: {
            event: 'Nombre del evento',
            person: 'Nombre de la persona'
        },
        popups: {
            removePerson: {
                title: '¿Quitar persona?',
                noButton: 'No',
                yesButton: 'Sí',
            },
            addAmountToExpense: {
                title: 'Agregar dinero al gasto',
                noButton: 'Cancelar',
                yesButton: 'Guardar',
            }
        }
    },
    eventDetails: {
        title: 'DETALLES DEL EVENTO',
        expenses: 'Gastos',
        newExpensePlaceholder: 'Nuevo gasto',
        expensePlaceholder: 'Gasto',
        alredyExpenseError: 'Ya existe un gasto con ese nombre',
        noNameExpenseError: 'Por favor agregar un nombre para el gasto',
        popups: {
            removeExpense: {
                title: "¿Quitar gasto?",
                subtitle: "Será también quitado de los gastos de las personas.",
                noButton: "No",
                yesButton: "Sí"
            },
            expenseError: {
                title: "Error",
                subtitle: "El evento debe tener al menos un gasto."
            },
        }
    },
    list: {
        title: 'MIS EVENTOS',
        created: 'Creado el',
        noNameEvent: 'Evento sin nombre',
        noPersonDescription: 'Ese botón debe servir para algo importante...',
        inputs: {
            search: "Buscar evento"
        },
        popups: {
            removeEvent: {
                title: "¿Quitar evento?",
                noButton: "No",
                yesButton: "Sí",
            },
        }
    },
    menu: {
        menu: "MENU",
        list: "Eventos",
        help: "Ayuda",
        settings: "Ajustes"
    },
    settings: {
        title: "AJUSTES",
        language: "Idioma de la app",
        languageSettings: "Idioma",
        newExpensePlaceholder: 'Nuevo gasto',
        english: "Inglés",
        spanish: "Español",
        french: "Francés",
        defaultExpense: 'Gastos por defecto',
        contact: 'Contacto',
        currencySettings: 'Moneda',
        currencySymbol: 'Símbolo de moneda',
        currencies: {
            default: '$',
            euro: '€',
            pound: '£'
        },
        contactText: '¿Alguna duda o error que reportar?',
        popups: {
            removeExpense: {
                title: "¿Quitar gasto por defecto?",
                noButton: "No",
                yesButton: "Sí",
            },
        },
        alredyExpenseError: 'Otro gasto ya tiene este nombre',
        noNameExpenseError: 'Por favor introduzca un nombre',
        defaultLabel1: 'Bebidas',
        defaultLabel2: 'Comida',
        defaultLabel3: 'Otros'
    },
    help: {
        title: "AYUDA",
        appTitle: "PUKETE",
        slogan: "Gracias por elegir la app :) Desliza para saber cómo funciona",
        skip: "saltar",
        slide1Title: 'Crea un evento',
        slide2Title: 'Agrega participantes y gastos',
        slide3Title: 'Y calcula!',
        slide3SubTitle: 'También es posible compartir los resultados!',
        slide3Button: 'Es fácil, empecemos!',

    },
    results: {
        title: "RESULTADOS",
        totalFor: "Total por",
        noNameEvent: 'Evento sin nombre',
        spentInTotal: "gastó en total: ",
        details: 'Detalles:',
        and: " y",
        gets: "recibe ",
        gives: "da ",
        isEven: "está saldado/a",
        paid: " pagó ",
        for: " Por ",
        counted: "fue contado/a",
        notCounted: "no fue contado/a",
        noConsumption: " hubo pagos pero no consumos.",
        attention: "Atención, en ",
        in: 'En ',
        itHasBeenSpent: ' se ha gastado: '
    }
};