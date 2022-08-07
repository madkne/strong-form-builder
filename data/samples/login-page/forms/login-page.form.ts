import { StrongFBBase } from "../common/StrongFB-base";
import { StrongFBWidget } from "../common/StrongFB-decorators";
import { StrongFBCardWidget } from "../widgets/card/card.header";
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
                this.loginButton,
            ]));
    }
    @StrongFBWidget
    usernameField() {
        return new StrongFBInputWidget();
    }

    @StrongFBWidget
    passwordField() {
        return new StrongFBInputWidget().type('password');
    }

    @StrongFBWidget
    loginButton() {
        return new StrongFBInputWidget(); //TODO:
    }
}