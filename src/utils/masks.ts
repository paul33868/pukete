import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export class Masks {

    static currency = createNumberMask({
        prefix: '$',
        suffix: '',
        allowDecimal: true,
        thousandsSeparatorSymbol: ',',
        decimalSymbol: '.',
        decimalLimit: 2,
        integerLimit: 4,
        allowLeadingZeroes: false
    })
}