# File Uploader Widget

## Introduction

you can pass a send file function to file uploader to upload files automatically and with progress or just use it for file picking from user and upload later files.

sample code:

```ts
return new StrongFBFormFieldWidget().field(
new StrongFBFileUploaderWidget()
    .formFieldName(field.name)
    .accept(['image/*'])
).label('file uploader')
```

## methods

### `multiple` method

```ts
multiple(is = true, maxFiles = 1)
```
allow to select multiple files (in file browser) and get `maxFiles` is max files allowed to select and upload.

### `maxSize` method

```ts
maxSize(size: number)
```

max file size allowed to select and upload. (in bytes)

in default is 100 MB equals `1000 * 1000 * 100` bytes

### `accept` method

```ts
accept(mimeTypes: mimeTypes[])
```

allowed mime type files. default is `['*']` that allowed any file.
sample mime types:
```ts
export type mimeTypes = '*' | 'audio/mp3' | 'audio/wav' | 'audio/mpeg' | 'image/png' | 'image/jpeg' | 'image/gif' | 'video/mp4' | 'video/webm' | 'application/xml' | 'application/json' | 'text/plain' | 'application/zip' | 'application/gzip' | 'application/x-7z-compressed' | 'application/vnd.rar' | 'application/x-sega-cd-rom' | 'application/vnd.android.package-archive' | 'image/*'
```

### `placeholder` method

```ts
placeholder(text: string)
```

the text that shows on file uploader. in default is: **Upload files here...**


### `serverSendFile` method

```ts
serverSendFile(send: FileUploaderServerSendFileType) 
```

if you want to automatically upload selected files in file uploader, you can define your `sendFile` function.

sample function for demo:
```ts
serverSendFile((file) => {
    // simulates uploading a file
    let uploadPercent = 0;
    return new Observable((observer) => {
        let intervalVar = setInterval(() => {
            observer.next({
                type: HttpEventType.UploadProgress,
                loaded: uploadPercent += 5,
                total: 100,
            } as any);
            if (uploadPercent >= 100) {
                clearInterval(intervalVar);
                return;
            }
        }, 1000);
    });
})
```

this function no really upload file but simulate it :)

### `customErrors` method

```ts
customErrors(errors: { [k in FileUploaderErrorKey]?: string })
```

you can customize error messages and use parameters like `$1`, `$2`. like `'max file size limit is $1'`

### `customMessages` method

```ts
customMessages(messages: { [k in FileUploaderMessageKey]?: string })
```

you can customize the other messages.