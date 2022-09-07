import { StrongFBBaseComposite } from "../common/StrongFB-composite";


export class Sample1Composite extends StrongFBBaseComposite {

    @input() title: string;

    @input() listAPI: string;

    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().gridBox()
                .gridColumnLayout({ desktop: 'col-9' }, this.layoutBuilder().box({ html: `<h1>${this.title}</h1>` }).finish())
                .gridColumnLayout({ desktop: 'col-3' }, this.layoutBuilder().rowBox().styleCss('flex-direction', 'row-reverse').widget([this.refreshButton, this.addButton]).finish())
                .finish(),
            this.layoutBuilder().box().widget(this.usersTable).finish(),
        ]).finish()
    }

    refreshButton() {
        return new StrongFBButtonWidget().icon('refresh-outline').mode('iconButton').appearance('colorful').tooltip('Refresh').status('warning').click(() => {
            this.findWidgetByName<StrongFBTableWidget>('usersTable').updateRows();
        });
    }


    usersTable() {
        return new StrongFBTableWidget<TableColumns>().columns([
            { name: 'index', title: '#' },
            { name: 'id', title: 'ID' },
            { name: 'name', title: 'Username' },
            { name: 'email', title: 'Email' },
            { name: 'roles', title: 'Roles', type: 'tagsList' },
            { name: 'created_at', title: 'Created At' },
            { name: 'options', title: 'Options', type: 'actions' },
        ]).mapColumnValue('index', (row, i) => {
            return i + 1;
        }).mapColumnValue('created_at', async (row, i) => {
            let date = new Date(row['created_at']);
            if (!row['created_at'] || !date) return '-';
            return await this.locale.dateFormat('DD MMMM YYYY - HH:mm', date);
        }).mapColumnValue<TableTagColumnMapValue[]>('roles', (row, i) => {
            let roles = row['roles'];
            return roles.map(j => {
                return {
                    status: 'primary',
                    value: j,
                } as TableTagColumnMapValue
            })
        }).loadRowsByApi({
            path: this.listAPI,
            method: 'GET'
        }, (res, err) => {
            if (err) {
                console.warn('error:', err);
                return [];
            }
            console.log('res:', res['data'])
            return res['data'];
        }).mapActionsColumn('options', [
            // {
            //     mode: 'icon',
            //     icon: 'info-outline',
            //     text: 'Details',
            //     status: 'info',
            //     disabled: true,
            //     action: (row, i, self) => {
            //         alert('hello details');
            //     }
            // },
            {
                mode: 'icon',
                icon: 'trash-outline',
                text: 'Delete',
                status: 'danger',
                action: async (row, i, self) => {

                    if (!await this.confirm(this.__('Delete User'), this.__('Are you sure to delete this user?'))) return;
                    let res = await this.http.delete('/admin/user/delete', { id: row['id'] });
                    if (res.result) {
                        self.updateRows();
                    } else {
                        this.notify('can not delete user!', 'failure');
                    }
                }
            },
        ]).mapPaginationByApi({
            pageSize: 10,
            pageCountResponse: 'pagination.page_count',
        });;
    }
}