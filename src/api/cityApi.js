import { cities } from "@/data/citiesData";

// Иммитация получения данных с сервера
export function getCities() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(cities);
            }, 600);
        } catch (err) {
            console.error('/src/api/cityApi.js: getCities => ', err);
            reject(err);
        }
    });
}