type Product = {
    id: string
    available: boolean
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
type CategorySTypes = {types: {id: string, title: string, createdAt: Date, updatedAt: Date, categoryId: string}[]  ,id: string, title: string, icon: string, createdAt: Date, updatedAt: Date}
type AllCategories = CategorySTypes[]
type ProductFormData = Pick<Product, "title" | "description" | "discount" | "ProductWeight" | "price" | "categoryId" | "typeId"| "CaloryInfo"> & {Images: File[]} & {oldImages? : string[]} & {FileData?: UpdateFileData}

type UpdateFileData = {
    replace?: {
        index: number,
        fileName: string
    }[],
    push?: string [],
    remove?: number []
}
export type { Product ,AllCategories , ProductFormData, UpdateFileData}
