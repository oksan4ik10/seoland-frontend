export interface IWorker {
    _id: string,
    name: string,
    last_name: string,
    image: string,
    is_admin: boolean,
    role: IRole | null,
    roleName: string,
    login: string,
    password: string,
    salary: number | undefined,
    idRole: string

}
export interface IProject {
    _id: string,
    name: string,
    date_start: Date,
    date_end: Date,
    timePlan: number,
    idResponsibleUser: string,
    desc: string,
    worker: IWorker,
    workerName: string,
    id: string
}
export interface ITask {

    _id: string,
    name: string,
    date_start: Date,
    date_PlanEnd: Date,
    timePlan: number,
    IDworker: string,
    IDproject: string,
    status: string,
    desc: string,
    worker: IWorker
    project: IProject
    workerName: string,
    projectName: string,
    projectDesc: string


}
export interface ITrack {
    _id: string,
    IDworker: string,
    IDproject: string,
    attr: {
        dateWork: Date,
        timePlan: number,
        timeFact: number
    }[],
    project: IProject,
    worker: IWorker,
    task: ITask,
    workerName: string,
    projectName: string
    taskName: string,
    taskDesc: string
}
export interface IRole {
    _id: string,
    code: string,
    name: string,

}
export interface IAnalyticsPlan {
    data: IPlan[],
    project: IProject
}
export interface IPlan {
    _is: string;
    timePlan: number,
    timeFact: number,
    FOTfact: number,
    FOTplan: number,
    countWorkers: number,
    timeProc: 75,
    month: string,
    countSort?: string,
    timeProgress: number
}
//==========OLD
interface IDavdamer {
    id: number;
    name: string;
    last_name: string;
    image: string;
}
export interface ISeller {
    address: string;
    city: string;
    country: string;
    davdamer: IDavdamer;
    description: string;
    full_address: string;
    id: number;
    market?: string;
    name: string;
    phone_number?: string;
    products_amount: number;
    rating: string;
    image: string;
    orders_total: number;
    registered_dt: Date;
    telegram_chat_id: string;
    enot_shop_id: string;
    card_number: string;
    card_name: string;
    card_bank: string;
}


export interface IProductChild {
    color: {
        label: string;
        value: string;
    },
    description: string;
    id: number;
    images: {
        original: string;
    }[],
    sizes: {
        product_id: number;
        label: string;
        value: string;
        num_in_stock: number;
    }[]
}

export interface IProduct {
    location: string,
    items: IProductChild[],
    sex: string;
    material: string;
    parent: number;
    children: {
        images: {
            original: string
        }[],
        id: number,
        title: string
    }[],
    sub_categories: {
        child: {
            id: number,
            full_name: string,
            name: string
        },
        full_name: string,
        id: number,
        name: string
    }[],
    categories: string[],
    attributes: {
        name: string,
        value: string,
        code: string
    }[]
    id: number,
    images: {
        id: number,
        original: string
    }[],
    title: string,
    description: string,
    price: {
        currency: string,
        incl_tax: string,

        num_in_stock: number,
        old_price: string

    },
    rating: number | null,
    seller: {
        id: number,
        name: string,
        rating: string
    }
    orders_count: number,
    sale_count: number,
    nameSeller: {
        id: number,
        name: string
    },
    category: string[],
    product_class: string
}
export interface ICategoryAPI {
    id: number,
    name: string,
    full_name: string,
    children: {
        id: number,
        name: string,
        full_name: string,
    }[]
}
export interface IAttrAPI {
    code: string,
    name: string
}
export interface IProductClassesAPI {
    slug: string,
    name: string
}

export interface ILoginAPI {
    login: string;
    password: string
}


export interface IDavdamerInfo extends IUser {
    registered_dt: Date;
    fullName: string;
    first_name: string;
    email: string;
    password: string;
    phone_number: string

}


export interface ILoginResponse {
    data: {
        access_token: string,
        user: IUser
    }
    error: {
        status: string
    }


}


export type TStatusOrder = "NEW" | "PAID" | "PROCESSING" | "SENT" | "DELIVERED" | "REFUND" | "CANCELLED" | "READY"
export interface IOrder {
    id: number,
    shipping_address: {
        first_name: string,
        last_name: string,
        line1: string,
        state: string,
        phone_number: string,
        notes: string,
        time: string,
        date: string,
        shipping_method: string,
        custom_shipping_method: string
    },
    seller: {
        id: number,
        name: string,
        rating: string
    },
    user: {
        id: number,
        first_name: string,
        last_name: string
    },
    number: string,
    currency: string,
    total_incl_tax: string,
    shipping_method: string,
    shipping_code: string,
    guest_email: string,
    date_placed: Date,
    status: string,
    updated_dt: Date,
    site: number,
    basket: number,
    billing_address: null | string
    statusName: string,

}

export interface IOrderInfo extends IOrder {
    lines: {
        product: IProduct,
        quantity: number,
        unit_price_incl_tax: string
    }[]
}
interface IStatusOrder {
    [key: string]: string
}
export const statusOrder: IStatusOrder = {
    NEW: "Новый",
    PAID: "Оплачен",
    PROCESSING: "В обработке",
    SENT: "Отправлен",
    DELIVERED: "Доставлен",
    REFUND: "Возврат",
    CANCELLED: "Отменён",
    READY: "Собран продавцом"
}

export const statusOrderColor: IStatusOrder = {
    "Новый": "#8D989E",
    "В процессе": "#FFC448",
    "Отменен": "#D24950",
    "Завершен": "#D4E0FA"
}

export interface IAttributesValues {
    id: number,
    code: string,
    label: string,
    value: string
}

interface IAttr {
    label: string, value: string
}

export interface IAttrValuesAPI {
    color: IAttr[],
    material: IAttr[],
    sex: IAttr[],
    size: IAttr[]
}

export interface IAttrSize {
    name: string;
    id: string;
    check: boolean;
}

export interface IFiltersAnalyticsAPI {

    category: [
        {
            id: string,
            label: string
        }
    ],
    city: [
        {
            id: string,
            label: string
        }
    ],
    davdamer: [
        {
            id: string,
            label: string
        }
    ],
    market: [
        {
            id: string,
            label: string
        }
    ],
    seller: [
        {
            id: string,
            label: string
        }
    ],
    sub_category: [
        {
            id: string,
            label: string
        }
    ]
}


export interface IDataAnalyticsAPI {
    "order_line": number,
    "order": number,
    "order_dt": Date,
    "quantity": number,
    "unit_price": number,
    "line_price": number,
    "product": string,
    "category": string,
    "sub_category": string,
    "davdamer": string,
    "seller": string,
    "city": string,
    "market": string
}

export interface IDataDiagram {

    "label": string,
    "value": string

}
export interface IDataDiagram {

    "label": string,
    "value": string
    date: Date
}



//NEW INTERFASES




export interface IUser {
    id: string,
    name: string,
    last_name: string,
    image: string,
    is_admin: boolean,
    role: IRole | null

}
