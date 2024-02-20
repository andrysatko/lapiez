type Product = {
    id: string
    title: string
    description: string
    discount: number | null
    images: string[]
    ProductWeight: number
    price: number
    categoryId: string
    typeId: string | null
    CaloryInfo: {
        Proteins: number
        Carbohydrates: number
        Fats: number
        CalorieContent: number | null
    }
    "createdAt": string,
    "updatedAt": string,
    "category": {
        "id": string,
        "title": string,
        "icon": string,
        "createdAt": string,
        "updatedAt": string
    }
    "type"?: {
        "id": string,
        "title": string,
        "createdAt": string,
        "updatedAt": string,
        "categoryId": string
    },
}

export type { Product }