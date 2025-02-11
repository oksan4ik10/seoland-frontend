

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ISeller, IProduct, IOrder, ICategoryAPI, IProductClassesAPI, IOrderInfo, IAttrAPI, ILoginAPI, IUser, IDavdamerInfo, IAttributesValues, IAttrValuesAPI, IFiltersAnalyticsAPI, IDataAnalyticsAPI, IDataDiagram } from '../../models/type'
import { statusOrder } from '../../models/type';

import { RootState } from '../store';

export interface IParamsAPI {
    [key: string]: number | string;
}


interface IProductAnswer {
    results: IProduct[]
}
interface IOrderAnswer {
    results: IOrder[]
}

interface IParamsMutation {
    [key: string]: number | string | File;
}
interface IParamDeleteImg {
    productID: number,
    imageID: number
}

export const davDamerAPI = createApi({
    reducerPath: 'davDamerAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:4000/api', prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).userReducer.access_token;
            if (token) {
                headers.set('Authorization', `JWT ${token}`)
            }
            return headers
        },
    }),

    tagTypes: ["Davdamers", 'Sellers', 'Products', 'Orders', "Attr", "Analytics"],
    endpoints: (build) => ({
        fetchAllSellers: build.query<ISeller[], IParamsAPI>({
            query: (args) => ({
                url: `/davdamer/seller/`,
                params: { ...args }

            }),

            providesTags: ['Sellers']
        }),
        fetchAllProducts: build.query<IProduct[], IParamsAPI>({
            query:
                (args) => ({
                    url: `/davdamer/product/`,
                    params: { ...args }
                }),
            transformResponse: ((res: IProductAnswer) => {
                const newArr = res.results.map((item) => {
                    item.sale_count = (item.orders_count * (+item.price.incl_tax))
                    item["nameSeller"] = { name: item.seller.name, id: item.seller.id };
                    item["category"] = [...item.categories];

                    return item
                })
                return newArr
            }),

            providesTags: ['Products']
        }),
        fetchAllOrders: build.query<IOrder[], IParamsAPI>({
            query:
                (args) => ({

                    url: `/davdamer/order/`,
                    params: { ...args }

                }),
            transformResponse: ((res: IOrderAnswer) => {
                const arr = res.results.map((item) => {
                    const status = item.status.toUpperCase()

                    item.statusName = statusOrder[status];
                    return item
                })

                return arr
            }),

            providesTags: ['Orders']
        }),
        fetchGetSeller: build.query<ISeller, string | undefined>({
            query:
                (id) => {
                    if (!id) return ({ url: `/davdamer/seller/` })
                    return (
                        {
                            url: `/davdamer/seller/${id}`,

                        })
                },

            providesTags: ['Sellers']
        }),
        fetchCreateSeller: build.mutation<IParamsMutation, ISeller>({
            query: (body) => ({
                url: `/davdamer/seller/`,
                method: 'POST',
                body: body
            }),
            invalidatesTags: ['Sellers']
        }),
        fetchEditSeller: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/davdamer/seller/${body.id}/`,
                    method: 'PATCH',
                    body: body.body
                })
            },
            invalidatesTags: ['Sellers']
        }),
        fetchGetCategory: build.query<ICategoryAPI[], void>({
            query:
                () => ({ url: `/davdamer/enums/category/` })

        }),
        fetchGetProductClass: build.query<IProductClassesAPI[], void>({
            query:
                () => ({ url: `/davdamer/productclasses/` })

        }),
        fetchCreateProduct: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/davdamer/seller/${body.id}/add_product_v2/`,
                    method: 'POST',
                    body: body.body
                })
            },
            invalidatesTags: ['Products']
        }),
        fetchGetProduct: build.query<IProduct, string | undefined>({
            query:
                (id) => {
                    if (!id) return ({ url: `/davdamer/product/` })
                    return (
                        {
                            url: `/davdamer/product/${id}/`,

                        })
                },

            providesTags: ['Products']
        }),
        deleteImgProduct: build.mutation<void, IParamDeleteImg>({
            query: (body) => {
                return ({
                    url: `/davdamer/product/${body.productID}/image/${body.imageID}/`,
                    method: 'DELETE',
                })
            },
            invalidatesTags: ['Products']
        }),
        fetchEditProduct: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/davdamer/product/${body.id}/`,
                    method: 'PATCH',
                    body: body.body
                })
            },
            invalidatesTags: ['Products']
        }),
        fetchGetOrder: build.query<IOrderInfo, string | undefined>({
            query:
                (id) => {
                    if (!id) return ({ url: `/davdamer/order/` })
                    return (
                        {
                            url: `/davdamer/order/${id}/`,

                        })
                },
            transformResponse: ((res: IOrderInfo) => {
                res.statusName = statusOrder[res.status];
                return res
            }),
            providesTags: ['Orders']
        }),
        fetchEditOrder: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/davdamer/order/${body.id}/`,
                    method: 'PATCH',
                    body: body.body
                })
            },
            invalidatesTags: ['Orders']
        }),
        fetchGetAttr: build.query<IAttrAPI[], void>({
            query:
                () => ({ url: `/davdamer/enums/attribute/` })

        }),
        fetchLogin: build.mutation({
            query: (body: ILoginAPI) => {
                return ({
                    url: `/auth/login`,
                    method: 'POST',
                    body: body
                })
            },

        }),
        fetchAuth: build.query<IUser, void>({
            query:
                () => {
                    return ({ url: `/davdamer/me/` })
                }

        }),
        fetchGetDavdamers: build.query<IDavdamerInfo[], void>({
            query:
                () => {
                    return ({ url: `/admin/davdamer/` })
                },
            transformResponse: ((res: IDavdamerInfo[]) => {
                const newRes = res.map((item) => {
                    item.fullName = `${item.last_name + " "} ${item.first_name}`;
                    return item
                })

                return newRes
            }),
            providesTags: ['Davdamers']

        }),
        fetchCreateDavdamer: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/admin/davdamer/`,
                    method: 'POST',
                    body: body.body
                })
            },
            invalidatesTags: ['Davdamers']
        }),
        fetchGetDavdamer: build.query<IDavdamerInfo, string | undefined>({
            query:
                (id) => {
                    if (!id) return ({ url: `/admin/davdamer/` })
                    return (
                        {
                            url: `/admin/davdamer/${id}`,

                        })
                },

            providesTags: ['Davdamers']
        }),
        fetchEditDavdamer: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/admin/davdamer/${body.id}/`,
                    method: 'PATCH',
                    body: body.body
                })
            },
            invalidatesTags: ['Davdamers']
        }),
        fetchDelDavdamer: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/admin/davdamer/${body.id}/`,
                    method: 'DELETE',
                })
            },
            invalidatesTags: ['Davdamers']
        }),

        getChildrenProduct: build.query<string, string>({
            query:
                (id) => {
                    if (!id) return ({ url: `/davdamer/` })
                    return (
                        {
                            url: `/davdamer/product/${id}`,

                        })
                },

            providesTags: ['Davdamers']
        }),
        fetchGetAttributes: build.query<IAttributesValues[], { code: string }>({
            query: (args = { code: "color" }) => ({
                url: `/admin/attribute_value/`,
                params: { ...args }

            }),


            providesTags: ['Attr']

        }),
        fetchDelAttr: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/admin/attribute_value/${body.id}/`,
                    method: 'DELETE',
                })
            },
            invalidatesTags: ['Attr']
        }),
        fetchCreateAttr: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/admin/attribute_value/`,
                    method: 'POST',
                    body: body.body
                })
            },
            invalidatesTags: ['Attr']
        }),
        fetchGetAttrValue: build.query<IAttributesValues, string | undefined>({
            query:
                (id) => {
                    if (!id) return ({ url: `/admin/attribute_value/` })
                    return (
                        {
                            url: `/admin/attribute_value/${id}/`,

                        })
                },

            providesTags: ['Attr']
        }),

        fetchEditAttr: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/admin/attribute_value/${body.id}/`,
                    method: 'PATCH',
                    body: body.body
                })
            },
            invalidatesTags: ['Attr']
        }),
        getEnumsAttr: build.query<IAttrValuesAPI, void>({
            query:
                () => {

                    return (
                        {
                            url: `/davdamer/enums/attribute_value`,

                        })
                },

            providesTags: ['Products']
        }),
        fetchCreateChildProduct: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/davdamer/product/${body.id}/add_child/`,
                    method: 'POST',
                    body: body.body
                })
            },
            invalidatesTags: ['Products']
        }),
        getFiltersAnalytics: build.query<IFiltersAnalyticsAPI, void>({
            query: () => ({
                url: `/admin/analytics/params/`,


            }),

            providesTags: ['Analytics']
        }),
        getDataAnalytics: build.query<IDataAnalyticsAPI[], IParamsAPI>({
            query: (args) => ({
                url: `/admin/analytics/dataset/`,
                params: { ...args }

            }),

            providesTags: ['Analytics']
        }),
        getDataDiagramDavdamer: build.query<IDataDiagram[], IParamsAPI>({
            query: (args) => ({
                url: `/admin/analytics/plot/revenue_by_davdamer/`,
                params: { ...args }

            }),

            providesTags: ['Analytics']
        }),
        getDataDiagramSeller: build.query<IDataDiagram[], IParamsAPI>({
            query: (args) => ({
                url: `/admin/analytics/plot/revenue_by_seller/`,
                params: { ...args }

            }),

            providesTags: ['Analytics']
        }),
        getDataDiagramDays: build.query<IDataDiagram[], IParamsAPI>({
            query: (args) => ({
                url: `/admin/analytics/plot/revenue_by_date/`,
                params: { ...args }

            }),
            transformResponse: ((res: IDataDiagram[]) => {
                const newArr = res.map((item) => {
                    item.date = new Date(item.label)
                    return item
                })
                return newArr
            }),

            providesTags: ['Analytics']
        }),
        fetchDelProduct: build.mutation<IParamsMutation, IParamsMutation>({
            query: (body) => {
                return ({
                    url: `/davdamer/product/${body.id}/`,
                    method: 'DELETE',
                })
            },
            invalidatesTags: ['Products']
        }),
    })
})