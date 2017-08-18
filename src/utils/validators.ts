import { FormControl } from '@angular/forms';

interface ValidationResult {
    [key: string]: boolean;
}

export class PuketeValidators {

    static emailValidator(control: FormControl): ValidationResult {
        let EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var valid = EMAIL_REGEXP.test(control.value);
        if (control.value.length === 0) return { required: true };
        if (!valid) {
            return { format: true };
        }
        return null;
    }

    static lenghtValidator = (min: number, max: number) => {
        return (control: FormControl) => {
            if (control.value !== '' && control.value.trim() !== '') {
                if (control.value.length > min && control.value.length < max) {
                    return { format: true };
                }
            }
            return null;
        };
    }
}