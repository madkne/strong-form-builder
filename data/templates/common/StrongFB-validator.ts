import { StrongFBValidatorSchema } from "./StrongFB-interfaces";
import { StrongFBValidatorName } from "./StrongFB-types";



export class StrongFBValidator {

    private _schema: StrongFBValidatorSchema[] = [];

    get schema() {
        return this._schema;
    }

    required(error?: string) {
        this._schema.push({
            name: 'required',
            error: error || this.defaultErrorMessages.required,
        });
        return this;
    }
    maxLength(len: number, error?: string) {
        this._schema.push({
            name: 'maxLength',
            value: len,
            error: error || this.defaultErrorMessages.maxLength,
        });
        return this;
    }
    minLength(len: number, error?: string) {
        this._schema.push({
            name: 'minLength',
            value: len,
            error: error || this.defaultErrorMessages.minLength,
        });
        return this;
    }
    email(error?: string) {
        this._schema.push({
            name: 'email',
            error: error || this.defaultErrorMessages.email,
        });
        return this;
    }
    acceptPattern(pattern: RegExp, error?: string) {
        this._schema.push({
            name: 'acceptPattern',
            value: pattern,
            error: error || this.defaultErrorMessages.acceptPattern,
        });
        return this;
    }
    rejectPattern(pattern: RegExp, error?: string) {
        this._schema.push({
            name: 'rejectPattern',
            value: pattern,
            error: error || this.defaultErrorMessages.rejectPattern,
        });
        return this;
    }
    min(len: number, error?: string) {
        this._schema.push({
            name: 'min',
            value: len,
            error: error || this.defaultErrorMessages.min,
        });
        return this;
    }
    max(len: number, error?: string) {
        this._schema.push({
            name: 'max',
            value: len,
            error: error || this.defaultErrorMessages.max,
        });
        return this;
    }

    protected validateEmail(email: string) {
        let matches = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        return matches && matches.length > 0;
    }

    protected validateAcceptPattern(pattern: RegExp, value: string | number) {
        return pattern.test(String(value));
    }

    protected validateRejectPattern(pattern: RegExp, value: string | number) {
        return !pattern.test(String(value));
    }

    protected validateMaxLength(max: number, value: string) {
        return new RegExp(`^.{0,${max}}$`).test(String(value));
    }
    protected validateMinLength(min: number, value: string) {
        return new RegExp(`^.{${min},}$`).test(String(value));
    }

    protected validateMax(max: number, value: number) {
        return value <= max;
    }
    protected validateMin(min: number, value: number) {
        return value >= min;
    }


    get defaultErrorMessages() {
        return {
            email: 'bad email format',
            acceptPattern: 'invalid input',
            rejectPattern: 'invalid input',
            max: 'The number is too large',
            min: 'The number is too small',
            maxLength: 'The maximum number of characters is not respected',
            minLength: 'The minimum number of characters is not met',
            required: 'required field'
        } as { [k in StrongFBValidatorName]: string };
    }

    async checkValidators(value: string | number): Promise<{ isValid: boolean; error?: string }> {
        if (typeof value === 'string') {
            // =>email validation
            if (this._schema.find(i => i.name === 'email') && !this.validateEmail(value)) {
                return { isValid: false, error: this._schema.find(i => i.name === 'email').error };
            }
            // =>maxLength validation
            if (this._schema.find(i => i.name === 'maxLength') && !this.validateMaxLength(this._schema.find(i => i.name === 'maxLength').value, value)) {
                return { isValid: false, error: this._schema.find(i => i.name === 'maxLength').error };
            }
            // =>minLength validation
            if (this._schema.find(i => i.name === 'minLength') && !this.validateMinLength(this._schema.find(i => i.name === 'minLength').value, value)) {
                return { isValid: false, error: this._schema.find(i => i.name === 'minLength').error };
            }
        }
        if (typeof value === 'number') {
            // =>max validation
            if (this._schema.find(i => i.name === 'max') && !this.validateMax(this._schema.find(i => i.name === 'max').value, value)) {
                return { isValid: false, error: this._schema.find(i => i.name === 'max').error };
            }
            // =>min validation
            if (this._schema.find(i => i.name === 'min') && !this.validateMin(this._schema.find(i => i.name === 'min').value, value)) {
                return { isValid: false, error: this._schema.find(i => i.name === 'min').error };
            }
        }

        // =>accept validation
        if (this._schema.find(i => i.name === 'acceptPattern') && !this.validateAcceptPattern(this._schema.find(i => i.name === 'acceptPattern').value, value)) {
            return { isValid: false, error: this._schema.find(i => i.name === 'acceptPattern').error };
        }
        // =>reject validation
        if (this._schema.find(i => i.name === 'rejectPattern') && !this.validateAcceptPattern(this._schema.find(i => i.name === 'rejectPattern').value, value)) {
            return { isValid: false, error: this._schema.find(i => i.name === 'rejectPattern').error };
        }


        return { isValid: true };
    }
}