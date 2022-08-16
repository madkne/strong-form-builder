# Layouts

you can use some definitions of layouts like row flex box, column flex box, ...

every layout have common properties ( in sub class) and maybe have some special properties.

for example:

```plantuml
@startuml


class Box {
  String text
  String html
}

class BoxProperties {
    {method} widget()
    {method} widgets()
    {method} layout()
    {method} ...
}


BoxProperties <.. Box

@enduml
```

for layout of a simple form:

```ts
override get layout() {
    return this.layoutBuilder().centerScreenBox().widget(this.loginCard).finish();
}
```

```plantuml
@startuml

object layout
object StrongFBLayoutBuilder {
    centerScreenBox
}
map StrongFBLayoutBuilderProperties {
    widget => (loginCard)
    finish => ()
}

StrongFBLayoutBuilder::centerScreenBox ..> StrongFBLayoutBuilderProperties::widget 

StrongFBLayoutBuilderProperties::finish ..> StrongFBLayoutBuilder

StrongFBLayoutBuilder ..> layout



@enduml
```

## `StrongFBLayoutBuilder` schema

```plantuml	
@startmindmap
+ StrongFBLayoutBuilder
++ columnBox
+++ common methods
++++ widget
++++ layout
++++ styleClass
++++ styleCss
++++ id
++++ finish
++ rowBox
+++ common methods
++++ ...
++ box
+++ common methods
++++ ...
+++ html
+++ text
++ fullFlexBox
+++ common methods
++++ ...
++ centerScreenBox
+++ common methods
++++ ...
++ gridBox
+++ common methods
++++ ...
+++ gridColumnLayout

@endmindmap
```