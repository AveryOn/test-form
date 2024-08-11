import { workshops } from "@/data/workshopsData";

// Иммитация получения данных с сервера
export function getWorkshops() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(workshops);
            }, 600);
        } catch (err) {
            console.error('/src/api/cityApi.js: getWorkshops => ', err);
            reject(err);
        }
    });
}