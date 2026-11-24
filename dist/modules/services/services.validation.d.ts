import { z } from 'zod';
export declare const createServiceSchema: z.ZodObject<{
    name: z.ZodString;
    category: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration: z.ZodNumber;
    price: z.ZodNumber;
    status: z.ZodDefault<z.ZodOptional<z.ZodNativeEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "ACTIVE" | "INACTIVE";
    category: string;
    duration: number;
    price: number;
    description?: string | null | undefined;
}, {
    name: string;
    category: string;
    duration: number;
    price: number;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    description?: string | null | undefined;
}>;
export declare const updateServiceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    duration: z.ZodOptional<z.ZodNumber>;
    price: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodNativeEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    category?: string | undefined;
    description?: string | null | undefined;
    duration?: number | undefined;
    price?: number | undefined;
}, {
    name?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    category?: string | undefined;
    description?: string | null | undefined;
    duration?: number | undefined;
    price?: number | undefined;
}>;
export declare const serviceQuerySchema: z.ZodObject<{
    category: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodNativeEnum<{
        ACTIVE: "ACTIVE";
        INACTIVE: "INACTIVE";
    }>>;
    search: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    search?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    category?: string | undefined;
}, {
    search?: string | undefined;
    status?: "ACTIVE" | "INACTIVE" | undefined;
    category?: string | undefined;
}>;
//# sourceMappingURL=services.validation.d.ts.map