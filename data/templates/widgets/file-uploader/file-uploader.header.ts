import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBFileUploaderWidgetComponent } from "./file-uploader.component";
import { BehaviorSubject } from 'rxjs';
import { FileUploaderErrorKey, FileUploaderFileStruct, FileUploaderFileUploadedEventCallback, FileUploaderMessageKey, FileUploaderSchema, FileUploaderServerSendFileType } from "./file-uploader-interfaces";
import { MimeTypes } from "../../common/StrongFB-types";



export class StrongFBFileUploaderWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<FileUploaderSchema> {

    protected override _schema: FileUploaderSchema = {};

    override get component(): any {
        return StrongFBFileUploaderWidgetComponent;
    }

    override get widgetName(): string {
        return 'file-uploader';
    }

    multiple(is = true, maxFiles = 1) {
        this._schema.multiple = is;
        this._schema.maxFiles = maxFiles;
        return this;
    }

    maxSize(size: number) {
        this._schema.maxSize = size;
        return this;
    }

    accept(mimeTypes: MimeTypes[]) {
        this._schema.accept = mimeTypes;
        return this;
    }


    placeholder(text: string) {
        this._schema.placeholder = text;
        return this;
    }



    // fullWidth(is = true) {
    //     this._schema.fullWidth = is;
    //     return this;
    // }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    serverSendFile(send: FileUploaderServerSendFileType) {
        this._schema.server = {
            sendFile: send,
        }
        return this;
    }

    customErrors(errors: { [k in FileUploaderErrorKey]?: string }) {
        this._schema.errors = errors;
        return this;
    }

    customMessages(messages: { [k in FileUploaderMessageKey]?: string }) {
        this._schema.messages = messages;
        return this;
    }

    removeFilesAfterUploaded(is = true) {
        this._schema.removeFilesAfterUploaded = true;
        return this
    }


    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    fileUploadedEvent(callback: FileUploaderFileUploadedEventCallback) {
        this._schema.fileUploadedEvent = callback;
        return this;
    }




}