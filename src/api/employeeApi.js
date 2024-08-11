import { employees } from "@/data/employeesData";

// Иммитация получения данных с сервера
export function getEmployees() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(employees);
            }, 600);
        } catch (err) {
            console.error('/src/api/cityApi.js: getEmployees => ', err);
            reject(err);
        }
    });
}