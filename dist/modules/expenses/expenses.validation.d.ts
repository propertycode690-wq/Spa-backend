import { z } from 'zod';
export declare const createExpenseSchema: z.ZodObject<{
    date: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    category: z.ZodEffects<z.ZodNativeEnum<{
        ELECTRICITY: "ELECTRICITY";
        WATER: "WATER";
        GENERATOR_FUEL: "GENERATOR_FUEL";
        GENERATOR_FUEL_GAS: "GENERATOR_FUEL_GAS";
        MAINTENANCE: "MAINTENANCE";
        REPAIRS: "REPAIRS";
        RENT: "RENT";
        CLEANING_SUPPLIES: "CLEANING_SUPPLIES";
        OTHER: "OTHER";
    }>, "ELECTRICITY" | "WATER" | "GENERATOR_FUEL" | "GENERATOR_FUEL_GAS" | "MAINTENANCE" | "REPAIRS" | "RENT" | "CLEANING_SUPPLIES" | "OTHER", unknown>;
    amount: z.ZodNumber;
    paymentMethod: z.ZodEffects<z.ZodNativeEnum<{
        CASH: "CASH";
        MTN_MOMO: "MTN_MOMO";
        ORANGE_MONEY: "ORANGE_MONEY";
    }>, "CASH" | "MTN_MOMO" | "ORANGE_MONEY", unknown>;
    note: z.ZodString;
}, "strip", z.ZodTypeAny, {
    date: string;
    note: string;
    category: "ELECTRICITY" | "WATER" | "GENERATOR_FUEL" | "GENERATOR_FUEL_GAS" | "MAINTENANCE" | "REPAIRS" | "RENT" | "CLEANING_SUPPLIES" | "OTHER";
    amount: number;
    paymentMethod: "CASH" | "MTN_MOMO" | "ORANGE_MONEY";
}, {
    note: string;
    amount: number;
    date?: string | undefined;
    category?: unknown;
    paymentMethod?: unknown;
}>;
export declare const expenseQuerySchema: z.ZodObject<{
    date: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodNativeEnum<{
        ELECTRICITY: "ELECTRICITY";
        WATER: "WATER";
        GENERATOR_FUEL: "GENERATOR_FUEL";
        GENERATOR_FUEL_GAS: "GENERATOR_FUEL_GAS";
        MAINTENANCE: "MAINTENANCE";
        REPAIRS: "REPAIRS";
        RENT: "RENT";
        CLEANING_SUPPLIES: "CLEANING_SUPPLIES";
        OTHER: "OTHER";
    }>>;
    paymentMethod: z.ZodOptional<z.ZodNativeEnum<{
        CASH: "CASH";
        MTN_MOMO: "MTN_MOMO";
        ORANGE_MONEY: "ORANGE_MONEY";
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
    endDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    date?: string | undefined;
    category?: "ELECTRICITY" | "WATER" | "GENERATOR_FUEL" | "GENERATOR_FUEL_GAS" | "MAINTENANCE" | "REPAIRS" | "RENT" | "CLEANING_SUPPLIES" | "OTHER" | undefined;
    paymentMethod?: "CASH" | "MTN_MOMO" | "ORANGE_MONEY" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}, {
    date?: string | undefined;
    category?: "ELECTRICITY" | "WATER" | "GENERATOR_FUEL" | "GENERATOR_FUEL_GAS" | "MAINTENANCE" | "REPAIRS" | "RENT" | "CLEANING_SUPPLIES" | "OTHER" | undefined;
    paymentMethod?: "CASH" | "MTN_MOMO" | "ORANGE_MONEY" | undefined;
    startDate?: string | undefined;
    endDate?: string | undefined;
}>;
//# sourceMappingURL=expenses.validation.d.ts.map