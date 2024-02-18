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
}

export type { Product }