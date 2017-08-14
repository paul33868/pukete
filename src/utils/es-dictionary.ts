export var esDictionary = {
    index: {
        alreadyPaid: 'ya pagó',
        alreadyHasNameError: 'Otra persona ya tiene este nombre',
        noNameError: 'Por favor introduzca un nombre',
        validAmountError: "Por favor introduzca un valor válido para todos los gastos",
        noNameEventError: 'El evento debe tener un nombre',
        event: 'Evento',
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
        title: 'Detalles del evento',
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
        title: 'Mis eventos',
        created: 'Creado el',
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
        menu: "Menú",
        list: "Eventos",
        help: "Ayuda",
        settings: "Ajustes"
    },
    settings: {
        title: "Ajustes",
        language: "Idioma",
        english: "Inglés",
        spanish: "Español",
        defaultExpense: 'Gastos por defecto',
        contact: 'Contacto',
        currencySymbol: 'Símbolo de moneda por defecto',
        currencies: {
            default: 'Por defecto ($)',
            euro: 'Euro (€)',
            pound: 'Libra (£)'
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
        title: "Ayuda",
        appTitle: "Pukete",
        slogan: "Cuentas claras conservan la amistad :)",
        skip: "saltar"
    },
    results: {
        title: "Resultados",
        totalFor: "Total por ",
        spentInTotal: "gastó en total: ",
        and: " y",
        gets: "recibe ",
        gives: "da ",
        isEven: "sale derecho",
        paid: " pagó ",
        for: " por ",
        counted: "fue contado/a",
        notCounted: "no fue contado/a",
        noConsumption: " hubo pagos pero no consumos.",
        attention: "Atención, en "
    }
};