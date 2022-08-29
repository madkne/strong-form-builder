import { StrongFBFormClass } from "./StrongFB-base";
import { StrongFBCheckValidatorsResponse, StrongFBCustomValidatorFunctionType, StrongFBValidatorSchema } from "./StrongFB-interfaces";
import { StrongFBValidatorName } from "./StrongFB-types";



export class StrongFBValidator {

    private _schema: StrongFBValidatorSchema[] = [];

    protected _widgetForm: StrongFBFormClass;

    constructor(form?: StrongFBFormClass) {
        this._widgetForm = form;
    }

    get schema() {
        return this._schema;
    }

    required(error?: string) {
        this._schema.push({
            name: 'required',
            error: error,
        });
        return this;
    }

    number(error?: string) {
        this._schema.push({
            name: 'number',
            error: error,
        });
        return this;
    }

    maxLength(len: number, error?: string) {
        this._schema.push({
            name: 'maxLength',
            value: len,
            error: error,
        });
        return this;
    }
    minLength(len: number, error?: string) {
        this._schema.push({
            name: 'minLength',
            value: len,
            error: error,
        });
        return this;
    }
    email(error?: string) {
        this._schema.push({
            name: 'email',
            error: error,
        });
        return this;
    }
    acceptPattern(pattern: RegExp, error?: string) {
        this._schema.push({
            name: 'acceptPattern',
            value: pattern,
            error,
        });
        return this;
    }
    rejectPattern(pattern: RegExp, error?: string) {
        this._schema.push({
            name: 'rejectPattern',
            value: pattern,
            error: error,
        });
        return this;
    }
    min(len: number, error?: string) {
        this._schema.push({
            name: 'min',
            value: len,
            error: error,
        });
        return this;
    }
    max(len: number, error?: string) {
        this._schema.push({
            name: 'max',
            value: len,
            error: error,
        });
        return this;
    }

    custom(validatorFunction: StrongFBCustomValidatorFunctionType, error?: string) {
        this._schema.push({
            name: 'custom',
            value: validatorFunction,
            error: error,
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

    protected validateNumber(value: string) {
        return /^\d+$/.test(String(value));
    }

    protected validateRequired(value: string | number) {
        if (value === undefined || value === null) {
            return false;
        }
        if (typeof value === 'string' && value === '') {
            return false;
        }

        return true;
    }

    protected async validateCustom(func: StrongFBCustomValidatorFunctionType, value: any) {
        let thisCall = this;
        if (this._widgetForm) {
            thisCall = this._widgetForm as any;
        }
        return await func.call(thisCall, value);
    }


    protected getErrorMessages(type: StrongFBValidatorName) {
        let customError = this._schema.find(i => i.name === type)?.error;
        if (customError) return customError;

        let messages = {
            email: 'bad email format',
            acceptPattern: 'invalid input',
            rejectPattern: 'invalid input',
            max: 'The number is too large',
            min: 'The number is too small',
            maxLength: 'The maximum number of characters is not respected',
            minLength: 'The minimum number of characters is not met',
            required: 'required field',
            number: 'number field',
            custom: 'field value is invalid'
        } as { [k in StrongFBValidatorName]: string };


        return this._widgetForm?.locale?.trans('msgs', messages[type]) ?? messages[type];
    }

    async checkValidators(value: string | number, form?: any): Promise<StrongFBCheckValidatorsResponse> {
        // if (form) this._widgetForm = form;
        // =>find validator object by name
        const findVObj = (name: StrongFBValidatorName) => this._schema.find(i => i.name === name);
        // =>required validation
        if (findVObj('required') && !this.validateRequired(value)) {
            return {
                isValid: false,
                error: this.getErrorMessages('required'),
                name: 'required',
            };
        }
        // =>number validation
        if (findVObj('number') && !this.validateNumber(String(value))) {
            return {
                isValid: false,
                error: this.getErrorMessages('number'),
                name: 'number',
            };
        }
        // =>custom validation
        if (findVObj('custom') && !this.validateCustom(findVObj('custom').value, value)) {
            return {
                isValid: false,
                error: this.getErrorMessages('custom'),
                name: 'custom',
            };
        }
        if (typeof value === 'string') {
            // =>email validation
            if (findVObj('email') && !this.validateEmail(value)) {
                return {
                    isValid: false,
                    error: this.getErrorMessages('email'),
                    name: 'email',
                    newValue: value,
                };
            }
            // =>maxLength validation
            if (findVObj('maxLength') && !this.validateMaxLength(findVObj('maxLength').value, value)) {
                return {
                    isValid: false,
                    error: this.getErrorMessages('maxLength'),
                    name: 'maxLength',
                    newValue: value.substring(0, Number(findVObj('maxLength').value)),
                };
            }
            // =>minLength validation
            if (findVObj('minLength') && !this.validateMinLength(findVObj('minLength').value, value)) {
                return {
                    isValid: false,
                    error: this.getErrorMessages('minLength'),
                    name: 'minLength',
                };
            }
        }
        if (typeof value === 'number') {
            // =>max validation
            if (findVObj('max') && !this.validateMax(findVObj('max').value, value)) {
                return {
                    isValid: false,
                    error: this.getErrorMessages('max'),
                    name: 'max',
                    newValue: findVObj('max').value,
                };
            }
            // =>min validation
            if (findVObj('min') && !this.validateMin(findVObj('min').value, value)) {
                return {
                    isValid: false,
                    error: this.getErrorMessages('min'),
                    name: 'min',
                    newValue: findVObj('min'),
                };
            }
        }

        // =>accept validation
        if (findVObj('acceptPattern') && !this.validateAcceptPattern(findVObj('acceptPattern').value, value)) {
            return {
                isValid: false,
                error: this.getErrorMessages('acceptPattern'),
                name: 'acceptPattern',
            };
        }
        // =>reject validation
        if (findVObj('rejectPattern') && !this.validateAcceptPattern(this._schema.find(i => i.name === 'rejectPattern').value, value)) {
            return {
                isValid: false,
                error: this.getErrorMessages('rejectPattern'),
                name: 'rejectPattern',
            };
        }


        return { isValid: true };
    }
}