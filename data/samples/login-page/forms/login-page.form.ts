import { StrongFBBase } from "../common/StrongFB-base";
import { StrongFBWidget } from "../common/StrongFB-decorators";
import { StrongFBButtonWidget } from "../widgets/button/button.header";
import { StrongFBCardWidget } from "../widgets/card/card.header";
import { StrongFBFormFieldWidget } from "../widgets/form-field/form-field.header";
import { InputSchema } from "../widgets/input/input-interfaces";
import { StrongFBInputWidget } from "../widgets/input/input.header";

type widgets = 'usernameField' | 'passwordField' | 'loginButton' | 'loginCard';
/**
 * widgets:
 * card: on center of window
 * input: username field
 * input: password field
 * button: login button 
 */
export class LoginPageForm extends StrongFBBase<widgets> {
    showPassword = false;
    override get layout() {
        return this.layoutBuilder().centerScreenBox().widget(this.loginCard)
        // ({
        //     layout: this.layoutBuilder().columnBox().widget(['usernameField', 'passwordField', 'loginButton'])
        // });
    }
    @StrongFBWidget
    loginCard() {
        console.log('this;', this)
        return new StrongFBCardWidget().header("Login Form").content(
            this.layoutBuilder().columnBox().widget([
                this.usernameField,
                this.passwordField,
            ])).footer(this.layoutBuilder().rowBox().widget(this.loginButton));
    }
    @StrongFBWidget
    usernameField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget().placeholder('username'));
    }

    @StrongFBWidget
    passwordField() {
        return new StrongFBFormFieldWidget().field(new StrongFBInputWidget().type('password').placeholder('password')).suffixButton(new StrongFBButtonWidget().icon('eye-outline').mode('icon').click((ev, self) => {
            if (this.showPassword) {
                self.icon('eye-outline');
                this.findWidgetByFormWidgetName<StrongFBFormFieldWidget>('passwordField').schema.field.schema.type = 'password';

            } else {
                self.icon('eye-off-2-outline');
                this.findWidgetByFormWidgetName<StrongFBFormFieldWidget>('passwordField').schema.field.schema.type = 'text';

            }
            // this.updateWidgetByFormWidgetName('passwordField');
            this.showPassword = !this.showPassword;
        }));
    }

    @StrongFBWidget
    loginButton() {
        return new StrongFBButtonWidget().text('Login').appearance('colorful').status('primary');
    }
}