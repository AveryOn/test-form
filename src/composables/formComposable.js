import { ref, computed, onMounted } from 'vue';
import { getCities } from '@/api/cityApi';
import { getWorkshops } from '@/api/workshopApi';
import { getEmployees } from '@/api/employeeApi';
import { getCrews } from '@/api/crewApi';
import { getShifts } from '@/api/shiftApi';

export default function useForm() {

// ########################################   DATA   ###############################################
    const formData = ref({ city: null, workshop: null, crew: null, employee: null, shift: null, });
    const formDataCopy = ref(null);                    // Копия данных формы (есть после первой записи данных в cookie)
    const isLoadingSaveForm = ref(false);              // Отображение прелоадера загрузки для submit-кнопки формы
    const isLoadingCitiesData = ref(false);            // Отображение прелоадера загрузки для селект-меню городов
    const isLoadingWorkshopsData = ref(false);         // Отображение прелоадера загрузки для селект-меню цехов
    const isLoadingEmployeesData = ref(false);         // Отображение прелоадера загрузки для селект-меню сотрудников
    const isLoadingCrewsData = ref(false);             // Отображение прелоадера загрузки для селект-меню бригад
    const isLoadingShiftsData = ref(false);            // Отображение прелоадера загрузки для селект-меню смен
    const cities = ref([]);                            // Список городов
    const workshops = ref([]);                         // Список цехов
    const employees = ref([]);                         // Список сотрудников
    const crews = ref([]);                             // Список бригад
    const shifts = ref([]);                            // Список смен


// ########################################   COMPUTED   ###############################################
    // Отфильтрованный массив цехов по ID города
    const filteredWorkshopsByCities = computed(() => {
        try {
            if(formData.value.city) {
                return workshops.value.filter((item) => item.cityId === formData.value.city?.id);
            } else return workshops.value;
        } catch (err) {
            console.error('/src/composables/formComposable.js: filteredWorkshopsByCities => ', err);
            throw err;
        }
    });

    // Отфильтрованный массив сотрудников по ID цеха
    const filteredEmployeesByWorkshop = computed(() => {
        try {
            if(formData.value.workshop) {
                return employees.value.filter((item) => item.workshopId === formData.value.workshop?.id);
            } else return employees.value;
        } catch (err) {
            console.error('/src/composables/formComposable.js: filteredEmployeesByWorkshop => ', err);
            throw err;
        }
    });

    const isDisabledSubmitBtn = computed(() => {
        try {
            return (!formData.value.city && !formData.value.crew && !formData.value.employee && !formData.value.shift && !formData.value.workshop) || formDataCopy.value === JSON.stringify(formData.value);
        } catch (err) {
            console.error('/src/composables/formComposable.js: isDisabledSubmitBtn => ', err);
            throw err;
        }
    });


// ########################################   METHODS   ###############################################
    // Получение городов с сервера
    async function handlerOpenCities() {
        if(!cities.value.length) {
            isLoadingCitiesData.value = true;
            try {
                cities.value = await getCities();
            } catch (err) {
                console.error('/src/composables/formComposable.js: handlerOpenCities => ', err);
                throw err;
            } finally {
                isLoadingCitiesData.value = false;
            }
        }
    }

    // Получение цехов с сервера
    async function handlerOpenWorkshops() {
        if(!workshops.value.length) {
            isLoadingWorkshopsData.value = true;
            try {
                workshops.value = await getWorkshops();
            } catch (err) {
                console.error('/src/composables/formComposable.js: handlerOpenWorkshops => ', err);
                throw err;
            } finally {
                isLoadingWorkshopsData.value = false;
            }
        }
    }

    // Получение сотрудников с сервера
    async function handlerOpenEmployees() {
        if(!employees.value.length) {
            isLoadingEmployeesData.value = true;
            try {
                employees.value = await getEmployees();
            } catch (err) {
                console.error('/src/composables/formComposable.js: handlerOpenEmployees => ', err);
                throw err;
            } finally {
                isLoadingEmployeesData.value = false;
            }
        }
    }

    // Получение бригад с сервера
    async function handlerOpenCrews() {
        if(!crews.value.length) {
            isLoadingCrewsData.value = true;
            try {
                crews.value = await getCrews();
            } catch (err) {
                console.error('/src/composables/formComposable.js: handlerOpenCrews => ', err);
                throw err;
            } finally {
                isLoadingCrewsData.value = false;
            }
        }
    }

    // Получение бригад с сервера
    async function handlerOpenShifts() {
        if(!shifts.value.length) {
            isLoadingShiftsData.value = true;
            try {
                shifts.value = await getShifts();
            } catch (err) {
                console.error('/src/composables/formComposable.js: handlerOpenShifts => ', err);
                throw err;
            } finally {
                isLoadingShiftsData.value = false;
            }
        }
    }

    // Обновление связанных с городами данных
    function handlerChangeCity() {
        try {
            formData.value.workshop = null;
            formData.value.employee = null;
        } catch (err) {
            console.error('/src/composables/formComposable.js: handlerChangeCity => ', err);
            throw err;
        }
    }

    // Обновление связанных с цехами данных
    function handlerChangeWorkshop(data, isEmployeeReq) {
        try {
            if(!isEmployeeReq) formData.value.employee = null;
            // проверка на длину массива т.к при загрузке страницы массивов данных нет, а данные в селекты были вставлены из cookie
            if(cities.value.length) formData.value.city = cities.value.find((item) => item.id === data.cityId);
        } catch (err) {
            console.error('/src/composables/formComposable.js: handlerChangeWorkshop => ', err);
            throw err;
        }
    }

    // Обновление связанных с сотрудниками данных
    function handlerChangeEmployee(data) {
        try {
            // проверка на длину массива т.к при загрузке страницы массивов данных нет, а данные в селекты были вставлены из cookie
            if(workshops.value.length) formData.value.workshop = workshops.value.find((item) => item.id === data.workshopId);
            handlerChangeWorkshop(formData.value.workshop, true);
        } catch (err) {
            console.error('/src/composables/formComposable.js: handlerChangeEmployee => ', err);
            throw err;
        }
    }

    // Запись в cookie
    function setDataInCookie(name, value, days) {
        try {
            let expires = "";
            if (days) {
                const date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        } catch (err) {
            console.error('/src/composables/formComposable.js: setDataInCookie => ', err);
            throw err;
        }
   
    }

    // Извлечение данных из cookie
    function getCookie(name) {
        try {
            const nameEQ = name + "=";
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1, cookie.length);
                }
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }
            return null;
        } catch (err) {
            console.error('/src/composables/formComposable.js: getCookie => ', err);
            throw err;
        }
    }

    // Подтверждение формы
    function submitForm() {
        if(!isDisabledSubmitBtn.value) {
            isLoadingSaveForm.value = true;
            try {
                setTimeout(() => {
                    let savedFormData = JSON.stringify(formData.value);
                    setDataInCookie('form_data', savedFormData, 30);
                    isLoadingSaveForm.value = false;
                    formDataCopy.value = savedFormData;
                }, 600);
            } catch (err) {
                console.error('/src/composables/formComposable.js: submitForm => ', err);
                throw err;
            }
        }
    }

    // Инициализация копии формы после извлечения её из cookie
    function initFormCopy() {
        try {
            let formDataCookie = getCookie('form_data');
            formDataCopy.value = formDataCookie;
            if(formDataCookie) {
                formDataCookie = JSON.parse(formDataCookie);
                formData.value.city = formDataCookie.city;
                formData.value.crew = formDataCookie.crew;
                formData.value.employee = formDataCookie.employee;
                formData.value.shift = formDataCookie.shift;
                formData.value.workshop = formDataCookie.workshop;
            }
        } catch (err) {
            console.error('/src/composables/formComposable.js: initFormCopy => ', err);
            throw err;
        }
    }

// ########################################   LIFECYCLE HOOKS   ###############################################
    onMounted(() => {
        initFormCopy();
    });

    return {
        // DATA
        formData,
        isLoadingSaveForm,
        isLoadingCitiesData,
        isLoadingWorkshopsData,
        isLoadingEmployeesData,
        isLoadingCrewsData,
        isLoadingShiftsData,
        cities,
        crews,
        shifts,

        // COMPUTED
        filteredWorkshopsByCities,
        filteredEmployeesByWorkshop,
        isDisabledSubmitBtn,

        // METHODS
        handlerOpenCities,
        handlerOpenWorkshops,
        handlerOpenEmployees,
        handlerOpenCrews,
        handlerOpenShifts,
        handlerChangeCity,
        handlerChangeWorkshop,
        handlerChangeEmployee,
        submitForm,
    }
} 