import { HttpProgressEvent, HttpSentEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { StrongFBFileUploaderWidget } from "./file-uploader.header";




export interface FileUploaderFileStruct {
    file?: File;
    name?: string;
    size?: number;
    progress?: number;
    status: 'complete' | 'failed' | 'uploading' | 'start' | 'uploaded';
    // color: '#c44e47' /**red */ | '#595e68' /**gray */ | '##369763' /**green */;
    color?: 'danger' | 'success' | 'basic';
    error?: string;
    /**
     * for display file on file picker
     */
    url?: string;
}

export type mimeTypes = '*' | 'audio/mp3' | 'audio/wav' | 'audio/mpeg' | 'image/png' | 'image/jpeg' | 'image/gif' | 'video/mp4' | 'video/webm' | 'application/xml' | 'application/json' | 'text/plain' | 'application/zip' | 'application/gzip' | 'application/x-7z-compressed' | 'application/vnd.rar' | 'application/x-sega-cd-rom' | 'application/vnd.android.package-archive' | 'image/*';

export type FileUploaderErrorKey = 'upload_max_size_limit' | 'upload_max_files_limit';

export type FileUploaderMessageKey = 'uploading' | 'upload_complete' | 'starting';

export type FileUploaderServerSendFileType<R extends HttpProgressEvent = HttpProgressEvent> = (file: File, self?: StrongFBFileUploaderWidget) => Observable<R>;


export interface FileUploaderSchema {
    /**
     * @default false
     */
    disabled?: boolean;

    /**
     * @default 'Upload files here...'
     */
    placeholder?: string;
    /**
     * @default false
     */
    fullWidth?: boolean;
    /**
     * can upload multiple files
     * @default false
     */
    multiple?: boolean;
    value?: File[];
    /**
     * @default '*'
     * accept to upload mime type files
     */
    accept?: mimeTypes[];
    /**
    * @default 1
    * max files that client can be uploaded
    */
    maxFiles?: number;
    /**
     *  @default 100 MB
     */
    maxSize?: number;
    /**
    * when a file upload completed, remove it!
    * @default false
    */
    removeFilesAfterUploaded?: boolean;

    /**
     * when an error occurs, on adding files (like file size limit), you can choose to just ignore that file and continue or stop add all files (reset)
     * @default reset
     */
    // errorActionType?: 'ignore' | 'reset';
    // fake server to simulate loading a 'local' server file and processing a file
    server?: {
        sendFile: FileUploaderServerSendFileType;
        // process: (fieldName, file: File, metadata, load) => void,

        // load?: (source, load) => void,
        //   => {
        //     // simulates loading a file from the server
        //     fetch(source).then(res => res.blob()).then(load);
        //   }
    };
    /**
     * customize error messages
     * you can use params like $1, $2
     * @example 'max file size limit is $1'
     */
    errors?: { [k in FileUploaderErrorKey]?: string };
    /**
     * customize other messages
     */
    messages?: { [k in FileUploaderMessageKey]?: string };




    /********************************* */
    /*************EVENTS************** */
    /********************************* */

}