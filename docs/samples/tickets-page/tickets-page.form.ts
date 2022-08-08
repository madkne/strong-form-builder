import { StrongFBFormClass } from "../../../data/templates/common/StrongFB-base";
import { AddTicketForm } from "./add-ticket.form";

type widgets = 'add_ticket' | 'search_ticket' | 'filter_ticket_by_status' | 'tickets_table';

/**
 * table : list of tickets
 * search box: filter tickets
 * drop down: filter tickets by status
 * add button: ticket add in dialog box
 */
export class TicketsPageForm extends StrongFBFormClass<widgets> {
    selectedTicketStatus: number;


    get layout() {
        return this.layoutBuilder().columnBox({
            layout: [
                this.layoutBuilder().rowBox({
                    class: ['header'],
                    layout: [
                        this.layoutBuilder().box({
                            text: 'Tickets',
                            class: ['h1']
                        }),
                        this.layoutBuilder().fullFlexBox(),
                        this.layoutBuilder().box({
                            class: 'actions',
                            widget: 'add_ticket',
                        })
                    ]
                }),
                this.layoutBuilder().rowBox().styleClass('filter').layout([
                    this.layoutBuilder().fullFlexBox().widget('search_ticket'),
                    this.layoutBuilder().box().widget('filter_ticket_by_status'),
                ]),
                this.layoutBuilder().widget('tickets_table'),
            ]
        });
    }

    @StrongFBWidget
    get add_ticket() {
        return new StrongFBButton().text('Add ticket').click(async (event) => {
            let res = await this.dialog.openForm(AddTicketForm, [
                {
                    isCancel: true,
                },
                {
                    text: 'save',
                    action: async (values: object) => {

                    }
                }
            ])
            if (res.OK) {
                this.tickets_table().update();
            }
        })
    }

    @StrongFBWidget
    get search_ticket() {
        return new StrongFBInput().type('search').beforeIcon('search').placeholder('search ...');
    }

    @StrongFBWidget
    get filter_ticket_by_status() {
        return new StrongFBSelect().loadOptionsByApi<TicketStatus[]>({
            url: '/ticket_status',
            method: 'get',
            headers: {},
            response: (res) => {
                return res.map(i => {
                    return {
                        value: String(i.id),
                        text: i.name,
                    };
                });
            } // {value: string; text?: string;}[]
        }).change((selectedValue, event) => {
            this.selectedTicketStatus = Number(selectedValue);
        });
    }

    @StrongFBWidget
    get tickets_table() {
        return new StrongFBTable().columns<TicketRow>([
            { name: 'index', title: '#' },
            { name: 'title', title: 'Title' },
            { name: 'status', title: 'Status', type: 'label' },
            { name: 'des', title: 'Description' },
            { name: 'options', title: 'Options', type: 'actions' },
        ]).loadRowsByApi<Ticket[]>({
            url: `/tickets?${this.selectedTicketStatus ? 'status=' + this.selectedTicketStatus : ''}`,
            method: 'get',
            response: (res) => {
                return res.map(i => {
                    return {
                        value: String(i.id),
                        text: i.name,
                    };
                });
            }// {[columns_name]}[]
        }).mapRowColumn<Ticket>('index', (row: T, index: number) => {
            return index + 1
        }).mapRowColumn<Ticket>('status', async (row: T, index: number) => {
            return await this.translateStatusId(row['status_id'])
        }).mapActionsColumn<TicketRow, Ticket>('options', [
            {
                type: 'icon', //icon| text
                icon: 'trash',
                action: async (displayRow: T1, simpleRow: T2, index: number) => {
                    if (await this.http.delete('/ticket?id=' + simpleRow.id)) {
                        this.update(); // update table rows
                    }
                }
            }
        ]).mapPaginationByApi({
            pageSize: 'meta.pagination.page_size', // field name in response
            maxPage: 'meta.pagination.max_page', // field name in response
        }).enablePagination()
    }

    async translateStatusId(id: number) {
        let res = await this.http.get('/ticket_status?status=' + id);
        return res.name;
    }
}