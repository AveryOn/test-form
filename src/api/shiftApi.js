import { shifts } from "@/data/shiftsData";

// Иммитация получения данных с сервера
export function getShifts() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(shifts);
            }, 600);
        } catch (err) {
            console.error('/src/api/cityApi.js: getShifts => ', err);
            reject(err);
        }
    });
}