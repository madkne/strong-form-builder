import { Component, Output, EventEmitter, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { FileUploaderErrorKey, FileUploaderFileStruct, FileUploaderMessageKey, FileUploaderSchema } from './file-uploader-interfaces';
import { interval, Observable, takeUntil } from 'rxjs';
import { HttpEventType } from '@angular/common/http';

@Component({
    selector: 'file-uploader-widget',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss']
})
export class StrongFBFileUploaderWidgetComponent extends StrongFBBaseWidget<FileUploaderSchema> {

    @Output() ngModelChange = new EventEmitter<File[]>();

    @Output() addFileEvent = new EventEmitter<FileUploaderFileStruct>();

    @Output() errorEvent = new EventEmitter<FileUploaderFileStruct>();
    @Output() fileStartUploadingEvent = new EventEmitter<FileUploaderFileStruct>();
    @Output() fileUploadingProgressEvent = new EventEmitter<FileUploaderFileStruct>();
    @Output() fileUploadCompleteEvent = new EventEmitter<FileUploaderFileStruct>();
    @Output() removeFileEvent = new EventEmitter<FileUploaderFileStruct>();


    filesSize = 0;
    filePickerBrowserId: string;
    filePickerFiles: FileUploaderFileStruct[] = [];
    globalError: string;


    override schema: FileUploaderSchema;

    protected defaultErrors: { [k in FileUploaderErrorKey]?: string } = {
        upload_max_size_limit: 'max file size limit is $1 (your file size is $2)',
        upload_max_files_limit: 'max files limit is $1'
    };

    protected defaultMessages: { [k in FileUploaderMessageKey]?: string } = {
        upload_complete: 'Upload Completed',
        uploading: 'uploading ...',
        starting: 'starting ...',
    }
    /********************************** */

    constructor(protected detectChanges: ChangeDetectorRef, protected elref: ElementRef) {
        super(elref);
    }
    /********************************** */

    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);
        // =>after 1.5s, upload a file
        interval(1500).pipe(takeUntil(this.destroy$)).subscribe(() => {
            // =>if no plan for upload files
            if (!this.schema.server) return;
            // =>if not files selected yet!
            if (this.filePickerFiles.length === 0) return;
            // =>find not uploaded file
            const file = this.filePickerFiles.find(i => !i.error && i.progress === 0 && i.status === 'start');
            // =>if all files uploaded
            if (!file) {
                return;
            }
            // =>upload file
            file.status = 'uploading';
            this.fileStartUploadingEvent.emit(file);
            // =>try to upload file
            this.schema.server.sendFile(file.file).pipe(takeUntil(this.destroy$)).subscribe(event => {
                // log('upload event:', event);
                // =>if progress uploading
                if (event && event.type !== undefined && event.type === HttpEventType.UploadProgress) {
                    file.progress = Math.round(100 * event.loaded / event.total);
                } else if (event.type === HttpEventType.Response as any) {
                    file.progress = 100;
                    file.status = 'complete';
                }
                this.detectChanges.detectChanges();
                this.fileUploadingProgressEvent.emit(file);
                // =>check if file upload completed
                if (file.status === 'complete') {
                    this.fileUploadCompleteEvent.emit(file);
                    if (this.schema.removeFilesAfterUploaded) {
                        this.removeFile(file);
                    }
                    // =>if uploaded file event
                    if (this.schema.fileUploadedEvent) {
                        this.schema.fileUploadedEvent.call(this.widgetForm, file, event, this.widgetHeader);
                    }
                }


            }, (error) => {
                file.error = 'Error occurred while uploading file';
                this.errorEvent.emit(file);
            });

        });
    }
    /********************************** */

    normalizeSchema(schema: FileUploaderSchema) {
        if (!schema.placeholder) schema.placeholder = 'Upload files here...';
        if (schema.multiple === undefined) schema.multiple = false;
        // if (!schema.status) schema.status = 'basic';
        if (!schema.maxFiles) schema.maxFiles = 1;
        if (!schema.maxSize) schema.maxSize = 1000 * 1000 * 100; //100 MB;
        if (schema.fullWidth === undefined) schema.fullWidth = false;
        // if (!schema.appearance) schema.appearance = 'filled';
        if (!schema.accept) schema.accept = ['*'];

        if (!schema.errors) schema.errors = {};
        // merge error messages with defaults
        for (const key of Object.keys(this.defaultErrors)) {
            if (!schema.errors[key]) {
                schema.errors[key] = this.defaultErrors[key];
            }
        }
        if (!schema.messages) schema.messages = {};
        // merge messages with defaults
        for (const key of Object.keys(this.defaultMessages)) {
            if (!schema.messages[key]) {
                schema.messages[key] = this.defaultMessages[key];
            }
        }
        return schema;
    }

    /********************************** */
    removeFile(file: FileUploaderFileStruct) {
        let index = this.filePickerFiles.findIndex(i => i.name === file.name);
        if (index < 0) return;
        this.removeFileEvent.emit(file);
        this.filePickerFiles.splice(index, 1);
        this.detectChanges.detectChanges();
        this.fileUploaderChange(this.filePickerFiles.map(i => i.file));
    }
    /********************************** */
    /********************************** */
    /********************************** */
    fileUploaderChange(event: File[]) {
        // =>set value to form field
        if (this.widgetHeader['_formFieldName']) {
            this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']] = event;
        }
        // console.log('change:', event)
        this.ngModelChange.emit(event);
    }
    /********************************** */
    fileBrowserChange(event: MouseEvent | any) {
        let files: File[] | FileList = event.target;
        if (!Array.isArray(files) && !(files as FileList).item) {
            files = event.target.files;
        }
        if (!files || (!Array.isArray(files) && !(files as FileList).item)) { return; }
        // =>convert filelist to file[]
        if ((files as FileList).item) {
            let tmp: File[] = [];
            for (let i = 0; i < files.length; i++) {
                tmp.push(files[i]);
            }
            files = tmp;
        }
        this.globalError = undefined;
        let i = 0;
        for (const file of files as File[]) {
            i++;
            let error;
            // =>check max file size
            if (file.size > this.schema.maxSize) {
                error = this.makeFileError('upload_max_size_limit', [this.convertBytesToHumanly(this.schema.maxSize), this.convertBytesToHumanly(file.size)]);

            }
            // =>check max files
            if (this.filePickerFiles.length + 1 > this.schema.maxFiles) {
                error = this.makeFileError('upload_max_files_limit', [this.schema.maxFiles]);
                this.errorEvent.emit({
                    file,
                    color: undefined,
                    name: file.name,
                    error,
                    size: file.size,
                    status: 'failed',
                    progress: 0,
                });
                // =>action error
                this.globalError = error;
                return;

            }
            this.filePickerFiles.push({
                file,
                name: file.name,
                error,
                size: file.size,
                status: error ? 'failed' : 'start',
                color: error ? 'danger' : 'basic', //'#c44e47' : '#595e68',
                progress: 0,
            });
            this.addFileEvent.emit(this.filePickerFiles[this.filePickerFiles.length - 1]);
            // =>in not any error
            if (!error) {
                // =>add file size to all
                this.filesSize += file.size;
            } else {
                this.errorEvent.emit(this.filePickerFiles[this.filePickerFiles.length - 1]);
            }
        }
        this.fileUploaderChange(this.filePickerFiles.map(i => i.file));
    }
    /********************************** */
    getFileAcceptRaw() {
        if (!this.schema.accept || !Array.isArray(this.schema.accept)) return '';
        return this.schema.accept.join(' ,');
    }
    /********************************** */
    makeFileError(key: FileUploaderErrorKey, params: any[] = []) {
        // =>load error message
        let message = this.schema.errors[key];
        if (!message) return 'not found error message!';
        // =>iterate params
        for (let i = 0; i < params.length; i++) {
            if (message.indexOf(`$${i + 1}`) > -1) {
                let regex = new RegExp(`\\$${i + 1}`, 'g');
                message = message.replace(regex, params[i]);
            }
        }

        return message;
    }
    /********************************** */
    convertBytesToHumanly(bytes: number, units = ['Bytes', 'KB', 'MB', 'GB', 'TB']) {
        let size = bytes.toString();
        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < units.length; i++) {
            if (bytes < 1000) { return size + ' ' + units[i]; }
            bytes /= 1000;
            size = bytes.toFixed(1);
        }
        return size + ' ' + units[units.length - 1];
    }
}