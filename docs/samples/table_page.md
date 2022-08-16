# A page includes table Sample

## description

a page that has a table with refresh button

## code 

```ts
import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBButtonWidget } from "../../widgets/button/button.header";
import { TableTagColumnMapValue } from "../../widgets/table/table-interfaces";
import { StrongFBTableWidget } from "../../widgets/table/table.header";

type widgets = 'workersTable' | 'refreshButton';

type TableColumns = 'index' | '_id' | 'type' | 'started_at' | 'ended_at' | 'success' | 'options';



export class WorkersPageForm extends StrongFBFormClass<widgets> {

    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().gridBox()
                .gridColumnLayout({ desktop: 'col-9' }, this.layoutBuilder().box({ html: `<h1>Workers</h1>` }).finish())
                .gridColumnLayout({ desktop: 'col-3' }, this.layoutBuilder().rowBox().styleCss('flex-direction', 'row-reverse').widget(this.refreshButton).finish())
                .finish(),
            this.layoutBuilder().box().widget(this.workersTable).finish(),
        ]).finish()
    }

    refreshButton() {
        return new StrongFBButtonWidget().icon('refresh-outline').mode('iconButton').appearance('colorful').status('warning').click(() => {
            this.findWidgetByName<StrongFBTableWidget>('workersTable').updateRows();
        });
    }

    workersTable() {
        return new StrongFBTableWidget<TableColumns>().columns([
            { name: 'index', title: '#' },
            { name: '_id', title: 'Worker ID' },
            { name: 'type', title: 'Type' },
            { name: 'started_at', title: 'Started At' },
            { name: 'ended_at', title: 'Ended At' },
            { name: 'success', title: 'Result', type: 'tag' },
            { name: 'options', title: 'Options', type: 'actions' },
        ]).mapColumnValue('index', (row, i) => {
            return i + 1;
        }).mapColumnValue('started_at', (row, i) => {
            let date = new Date(row['started_at']);
            return date.toDateString() + ' - ' + date.toTimeString().substring(0, 8);
        }).mapColumnValue('ended_at', (row, i) => {
            let date = new Date(row['ended_at']);
            return date.toDateString() + ' - ' + date.toTimeString().substring(0, 8);
        }).mapColumnValue<TableTagColumnMapValue>('success', (row, i) => {
            return {
                value: row['success'] ? 'Success' : 'failed',
                status: row['success'] ? 'success' : 'danger',
            }
        }).loadRowsByApi({
            path: '/worker/list',
            method: 'GET'
        }, (res, err) => {
            if (err) {
                console.warn('error:', err);
                return [];
            }
            console.log('res:', res['data'])
            return res['data'];
        }).mapActionsColumn('options', [
            {
                mode: 'icon',
                icon: 'info-outline',
                text: 'Details',
                status: 'info',
                disabled: true,
                action: (row, i, self) => {
                    alert('hello details');
                }
            },
            {
                mode: 'icon',
                icon: 'archive-outline',
                text: 'History',
                status: 'primary',
                disabled: true,
                action: (row, i, self) => {
                    alert('hello history');
                }
            },
        ]).mapPaginationByApi({
            pageSize: 5,
            pageCountResponse: 'pagination.page_count',
        });
    }

}
```