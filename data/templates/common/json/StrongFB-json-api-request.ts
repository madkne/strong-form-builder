import { StrongFBJsonApiRequestSchema } from "./StrongFB-interfaces";
import { HttpMethodName } from "./StrongFB-types";


export class StrongFBJsonApiRequest {
    private _schema: StrongFBJsonApiRequestSchema = {};
    /*********************************** */
    constructor() {
        this.method('GET');
    }
    /*********************************** */
    method(method: HttpMethodName = 'GET') {
        this._schema.method = method;
        return this;
    }
    /*********************************** */
    path(path: string) {
        this._schema.path = path;
        return this;
    }
    /*********************************** */
    queryParam(key: string, value: string) {
        this._schema.params[key] = value;
        return this;
    }
    /*********************************** */
    header(key: string, value: string | string[]) {
        this._schema.headers[key] = value;
        return this;
    }
    /*********************************** */
    body(value: any) {
        this._schema.body = value;
        return this;
    }
    /*********************************** */
    appendFormFieldsToBody(fieldNames = ['*']) {
        if (!this._schema._actions) this._schema._actions = [];
        this._schema._actions.push({
            name: 'append_form_fields_to_body',
            value: fieldNames,
        });
        return this;
    }
    /*********************************** */
    bodyParam(key: string, value: string) {
        if (!this._schema.body || typeof this._schema.body !== 'object') {
            this._schema.body = {};
        }
        this._schema.body[key] = value;
        return this;
    }
    /*********************************** */
    toJson() {
        return this._schema;
    }

}