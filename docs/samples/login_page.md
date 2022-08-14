# Login page Sample

## description

a username and password field with show/hide action for password. and finally, call API and send values on it.



## code

```typescript
import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBWidget } from "../../common/StrongFB-decorators";
import { StrongFBButtonWidget } from "../../widgets/button/button.header";
import { StrongFBCardWidget } from "../../widgets/card/card.header";
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
import { InputSchema } from "../../widgets/input/input-interfaces";
import { StrongFBInputWidget } from "../../widgets/input/input.header";

type widgets = 'usernameField' | 'passwordField' | 'loginButton' | 'loginCard' | 'passwordInput';

interface loginFormFields {
    username: string;
    password: string;
}
export class LoginPageForm extends StrongFBFormClass<widgets, loginFormFields> {
    showPassword = false;

    override get layout() {
        return this.layoutBuilder().centerScreenBox().widget(this.loginCard).finish();
    }
    loginCard() {
        // console.log('this;', this)
        return new StrongFBCardWidget().header("Workflow Engine Service Frontend").content(
            this.layoutBuilder().columnBox().widget([
                this.usernameField,
                this.passwordField,
            ]).finish()).footer(this.layoutBuilder().rowBox().widget(this.loginButton).finish());
    }
    usernameField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget<loginFormFields>().placeholder('username').formFieldName('username'));
    }

    passwordField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget<loginFormFields>().type('password').formFieldName('password').name('passwordInput').placeholder('password')).suffixButton(new StrongFBButtonWidget().icon('eye-outline').mode('icon').click((ev, self) => {
            if (this.showPassword) {
                self.icon('eye-outline');
                this.findWidgetByName<StrongFBInputWidget>('passwordInput').type('password');

            } else {
                self.icon('eye-off-2-outline');
                this.findWidgetByName<StrongFBInputWidget>('passwordInput').type('text');

            }
            this.showPassword = !this.showPassword;
        }));
    }

    loginButton() {
        return new StrongFBButtonWidget().name('loginButton').text('Login').appearance('colorful').status('primary').click(async (ev, self) => {
            let res = await this.http.post('/token', {
                username: this.formFieldValues().username,
                secret_key: this.formFieldValues().password,
            });
            console.log(res)
            // =>if success
            if (res && res.statusCode < 300) {
                this.http.setToken(res.result.data.access_token);
                this.http.setRefreshToken(res.result.data.refresh_token);
                this.service.goToPage('dashboard');
            }
            // =>if failed
            else {
                this.notify('username or password is not valid!', 'failure');
            }
        });
    }
}

```