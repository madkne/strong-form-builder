# Validators

validators used for form field widget fields. in any validation type, you can set your custom error message.

## Types

### `required` type

**value type** `any` 

check your input not empty.

### `number` type

**value type** `any` 

check your input has just numbers (integer).

### `maxLength` type

**value type** `string` 

check max length of your input value

### `minLength` type

**value type** `string` 

check min length of your input value

### `acceptPattern` type

**value type** `string` 

check a regex pattern on your input value.

### `rejectPattern` type

**value type** `string` 

check that a regex pattern not match on your input value.

### `email` type

**value type** `string` 

check your input value that validate with email address format like `sample@host.com`

### `min` type

**value type** `number` 

check min number of your input value

### `max` type

**value type** `number` 

check max number of your input value

### `custom` type

**value type** `any` 

get a validator function that must returns a boolean value (can returns with promise) and this return value is checked. 
```ts
validatorFunction: (value: string | number) => Promise<boolean> | boolean
```

passed parameter is value of your input.

!> **Important!** if you want to access your form variables, you must set `this` in validator constructor like: `
validator(new StrongFBValidator(this).custom(((value) => {})));`

for example:

This field is for enter user national code and validator function validates the Iranian people's National code.

```ts
return new StrongFBFormFieldWidget().field(new StrongFBInputWidget().formFieldName('national_code')).label('National Code').validator(new StrongFBValidator().custom((nationalId) => {
 // STEP 0: Validate national Id

  // Check length is 10
  if (nationalId.length < 8 || 10 < nationalId.length) {
    console.log(false);
    return false;
  }

  // Check if all of the numbers are the same
  if (
    nationalId == "0000000000" ||
    nationalId == "1111111111" ||
    nationalId == "2222222222" ||
    nationalId == "3333333333" ||
    nationalId == "4444444444" ||
    nationalId == "5555555555" ||
    nationalId == "6666666666" ||
    nationalId == "7777777777" ||
    nationalId == "8888888888" ||
    nationalId == "9999999999"
  ) {
    console.log(false);
    return false;
  }

  // STEP 00 : if nationalId.lenght==8 add two zero on the left
  if (nationalId.length < 10) {
    let zeroNeeded = 10 - nationalId.length;

    let zeroString = "";
    if (zeroNeeded == 2) {
      zeroString = "00";
    } else {
      zeroString = "0";
    }

    nationalId = zeroString.concat(nationalId);
  }

  // STEP 1: Sum all numbers
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += nationalId.charAt(i) * (10 - i);
  }

  // STEP 2: MOD ON 11
  let mod = sum % 11;

  // STEP 3: Check with 2
  let finalValue;
  if (mod >= 2) {
    finalValue = 11 - mod;
  } else {
    finalValue = mod;
  }

  // STEP 4: Final Step check with control value
  if (finalValue == nationalId.charAt(9)) {
    console.log(true);
    return true;
  } else {
    console.log(false);
    return false;
  }
}, 'your entered national code invalid!'));

```




