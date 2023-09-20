import "dotenv/config";

function throwHelper(name: string) : string {
    throw new ReferenceError(`process.env.${name} not set; did you forget to set ${name} in .env?`);
}

export const PORT = parseInt(process.env.PORT ?? "4000");
export const SECRET = process.env.SECRET ?? throwHelper("SECRET");
export const PG_URL = process.env.PG_URL ?? throwHelper("PG_URL");
export const ORIGIN = process.env.ORIGIN ?? "https://localhost:5147";
