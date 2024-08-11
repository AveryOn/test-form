import { crews } from "@/data/crewsData";

// Иммитация получения данных с сервера
export function getCrews() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(crews);
            }, 600);
        } catch (err) {
            console.error('/src/api/cityApi.js: getCrews => ', err);
            reject(err);
        }
    });
}