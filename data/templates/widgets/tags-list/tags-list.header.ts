import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { TagAppearance, TagSeparatorKey, TagsListSchema, TagStatus } from "./tags-list-interfaces";
import { StrongFBTagsListWidgetComponent } from "./tags-list.component";
import { BehaviorSubject } from 'rxjs';
import { SelectOption } from "../select/select-interfaces";



export class StrongFBTagsListWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<TagsListSchema> {
    // private _updateOptions$ = new BehaviorSubject<boolean>(true);

    protected override _schema: TagsListSchema = {};

    override get component(): any {
        return StrongFBTagsListWidgetComponent;
    }

    override get widgetName(): string {
        return 'tags-list';
    }



    appearance(appearance: TagAppearance) {
        this._schema.appearance = appearance;
        return this;
    }



    status(status: TagStatus) {
        this._schema.status = status;
        return this;
    }


    placeholder(text: string) {
        this._schema.placeholder = text;
        return this;
    }

    autoCompleteOptions(options: string[] | SelectOption[]) {
        if (typeof options[0] === 'string') {
            options = options.map(i => {
                return {
                    text: i,
                    value: i,
                } as SelectOption
            });
        }
        this._schema.autoCompleteOptions = options as SelectOption[];
        return this;
    }


    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    fullWidth(is = true) {
        this._schema.fullWidth = is;
        return this;
    }

    selectedTags(selected: string[]) {
        this._schema.value = selected;
        return this;
    }

    addable(is = true) {
        this._schema.addable = is;
        return this;
    }

    tagsLimit(limit = 0) {
        this._schema.limit = limit;
        return this;
    }

    removable(is = true) {
        this._schema.removable = is;
        return this;
    }

    separatorKeys(keys: TagSeparatorKey[]) {
        this._schema.separatorKey = keys;
        return this;
    }

    /********************************* */
    /*************EVENTS************** */
    /********************************* */




}